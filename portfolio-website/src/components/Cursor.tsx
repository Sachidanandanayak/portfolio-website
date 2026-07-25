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

    // Direct GSAP quickSetter for ultra-high performance mouse tracking
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    let lastSparkTime = 0;

    // Interactive mouse spark particle generator
    const createSpark = (x: number, y: number) => {
      if (!sparkContainerRef.current) return;
      const now = Date.now();
      if (now - lastSparkTime < 40) return; // Throttle to maintain 60FPS+
      lastSparkTime = now;

      const spark = document.createElement("div");
      spark.className = "spark-particle";

      // Random particle spread, size, and direction
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 30 + 10;
      const destX = Math.cos(angle) * speed;
      const destY = Math.sin(angle) * speed;

      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      sparkContainerRef.current.appendChild(spark);

      gsap.to(spark, {
        x: destX,
        y: destY,
        opacity: 0,
        scale: 0.1,
        duration: 0.75,
        ease: "power2.out",
        onComplete: () => {
          spark.remove();
        },
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      createSpark(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", onMouseMove);

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
      document.removeEventListener("mousemove", onMouseMove);
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
