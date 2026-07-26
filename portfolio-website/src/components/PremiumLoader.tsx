import { useEffect, useState, useRef } from "react";
import "./styles/PremiumLoader.css";

const PremiumLoader = () => {
  const [percent, setPercent] = useState<number>(1);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Lock scroll during loader duration
    document.body.style.overflow = "hidden";

    // Smooth rAF progress 1% -> 100% over 4600ms (total duration ~5000ms including 100% hold)
    const DURATION = 4600;

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(1, elapsed / DURATION);

      // Calculate smooth percentage integer from 1 to 100
      const currentPercent = Math.max(1, Math.min(100, Math.floor(rawProgress * 99) + 1));
      setPercent(currentPercent);

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Reached 100% -> Hold 100% visible briefly (200ms) then fade out smoothly
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            setHidden(true);
            document.body.style.overflow = "";
            window.dispatchEvent(new CustomEvent("portfolioLoaderFinished"));
          }, 350); // 350ms fade transition
        }, 200);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`premium-loader-overlay ${fadingOut ? "fade-out" : ""}`}>
      {/* Background Video & Dark Gradient Overlay */}
      <div className="loader-video-container">
        <video autoPlay loop muted playsInline className="loader-video">
          <source src="/video/video.webm" type="video/webm" />
        </video>
        <div className="loader-overlay-dark"></div>
      </div>

      {/* Center Content */}
      <div className="loader-content">
        {/* SN Badge */}
        <div className="loader-logo show">
          <span>SN</span>
        </div>

        {/* Developer Name */}
        <h1 className="loader-name show">
          Sachidananda Nayak
        </h1>

        {/* Role Subtitle */}
        <h2 className="loader-role show">
          CLOUD ENGINEER & FULL-STACK DEVELOPER
        </h2>

        {/* Loading Indicator with Percentage Counter */}
        <div className="loader-bar-wrap show">
          <div className="loader-text-row">
            <span className="loader-text">LOADING</span>
            <span className="loader-percentage">{percent}%</span>
          </div>

          <div className="loader-line-track">
            <div
              className="loader-line-fill"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
