import { useEffect, useState } from "react";
import "./styles/PremiumLoader.css";

const PremiumLoader = () => {
  const [stage, setStage] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    // Lock scroll during loader duration
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setStage(1), 200);   // 0.2s: "Sachidananda Nayak" slides in
    const t2 = setTimeout(() => setStage(2), 600);   // 0.6s: "CLOUD ENGINEER & FULL STACK DEVELOPER" appears
    const t3 = setTimeout(() => setFadingOut(true), 3400); // 3.4s: Smooth fade-out begins
    const t4 = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("portfolioLoaderFinished"));
    }, 4000); // 4.0s: Fully hidden, scroll restored, portfolio reveals

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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

      {/* Content Positioned at Bottom so Central Sphere Animation is Fully Visible */}
      <div className="loader-content">
        <div className="loader-text-group">
          {/* Developer Name in Black */}
          <h1 className={`loader-name ${stage >= 1 ? "show" : ""}`}>
            Sachidananda Nayak
          </h1>

          {/* Role Subtitle in Black */}
          <h2 className={`loader-role ${stage >= 2 ? "show" : ""}`}>
            CLOUD ENGINEER & FULL STACK DEVELOPER
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
