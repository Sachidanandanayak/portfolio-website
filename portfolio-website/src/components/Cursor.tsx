import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const sparkContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Direct GSAP quickSetter for high performance tracking
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    let lastSparkTime = 0;
    const MAX_PARTICLES = 35;

    // Interactive spark particle generator for desktop and mobile touch
    const createSpark = (x: number, y: number, isBurst = false) => {
      const container = sparkContainerRef.current;
      if (!container) return;

      const now = Date.now();
      if (!isBurst && now - lastSparkTime < 35) return; // Throttle trail to 35ms
      lastSparkTime = now;

      // Maintain max active particle limit for 60FPS mobile performance
      while (container.children.length > MAX_PARTICLES) {
        container.firstElementChild?.remove();
      }

      const colors = ["#FF6B00", "#F97316", "#F59E0B", "#FBBF24"];
      const particleCount = isBurst ? 6 : 1;

      for (let i = 0; i < particleCount; i++) {
        const spark = document.createElement("div");
        spark.className = "spark-particle";

        const size = Math.random() * 6 + 4;
        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 25 + 10 : Math.random() * 20 + 8;
        const destX = Math.cos(angle) * speed;
        const destY = Math.sin(angle) * speed;

        const color = colors[Math.floor(Math.random() * colors.length)];

        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.background = `radial-gradient(circle, ${color} 0%, transparent 100%)`;
        spark.style.boxShadow = `0 0 10px ${color}`;

        container.appendChild(spark);

        gsap.to(spark, {
          x: destX,
          y: destY,
          opacity: 0,
          scale: 0.1,
          duration: isBurst ? 0.6 : 0.7,
          ease: "power2.out",
          onComplete: () => {
            spark.remove();
          },
        });
      }
    };

    // Pointer handlers for Mouse & Touch
    const handlePointerDown = (e: PointerEvent) => {
      createSpark(e.clientX, e.clientY, true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      createSpark(e.clientX, e.clientY, false);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let animationFrameId: number;
    const loop = () => {
      if (!hover) {
        const delay = 5;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        xSet(cursorPos.x);
        ySet(cursorPos.y);
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    // Interactive element hover listeners
    const interactiveElements = document.querySelectorAll("[data-cursor]");
    interactiveElements.forEach((item) => {
      const element = item as HTMLElement;
      const onMouseOver = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          xSet(rect.left);
          ySet(rect.top);
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", onMouseOver as EventListener);
      element.addEventListener("mouseout", onMouseOut);
    });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="spark-container" ref={sparkContainerRef} />
      <div className="cursor-main" ref={cursorRef} />
    </>
  );
};

export default Cursor;
