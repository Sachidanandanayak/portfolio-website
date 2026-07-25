import { useEffect, useState } from "react";
import "./styles/PremiumLoader.css";

const PremiumLoader = () => {
  const [stage, setStage] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    // Lock scroll during 5-second loader duration
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setStage(1), 300);   // 0.3s: SN appears
    const t2 = setTimeout(() => setStage(2), 800);   // 0.8s: Sachidananda Nayak name appears
    const t3 = setTimeout(() => setStage(3), 1400);  // 1.4s: CLOUD ENGINEER role + line appears
    const t4 = setTimeout(() => setFadingOut(true), 4500); // 4.5s: Exit fadeout begins
    const t5 = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("portfolioLoaderFinished"));
    }, 5000); // 5.0s: Fully hidden, scroll restored, hero video starts

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`premium-loader-overlay ${fadingOut ? "fade-out" : ""}`}>
      {/* Futuristic Purple Video Background (Shared with TechStack) */}
      <div className="loader-video-container">
        <video autoPlay loop muted playsInline className="loader-video">
          <source src="/video/video.webm" type="video/webm" />
        </video>
        <div className="loader-overlay-dark"></div>
      </div>

      {/* Center Content */}
      <div className="loader-content">
        {/* SN Badge */}
        <div className={`loader-logo ${stage >= 1 ? "show" : ""}`}>
          <span>SN</span>
        </div>

        {/* Developer Name */}
        <h1 className={`loader-name ${stage >= 2 ? "show" : ""}`}>
          Sachidananda Nayak
        </h1>

        {/* Role Subtitle */}
        <h2 className={`loader-role ${stage >= 3 ? "show" : ""}`}>
          CLOUD ENGINEER
        </h2>

        {/* Loading Indicator */}
        <div className={`loader-bar-wrap ${stage >= 3 ? "show" : ""}`}>
          <span className="loader-text">Loading...</span>
          <div className="loader-line-track">
            <div className="loader-line-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
