import { useRef, useEffect, useState } from "react";
import "./styles/Landing.css";
import { config } from "../config";
import SocialIcons from "./SocialIcons";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);

  // 3D Parallax Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  });

  // Direct PLAY / REPLAY ONLY Handler (NO PAUSE ALLOWED)
  const handleVideoTap = () => {
    const video = videoRef.current;
    if (!video) return;

    // If video is ALREADY playing, DO NOTHING (NO PAUSE ALLOWED)
    if (isPlaying && !video.paused && !video.ended) {
      return;
    }

    try {
      if (video.ended || hasEnded) {
        video.currentTime = 0;
      }
      video.muted = false;
      video.volume = 1;
      video.play().then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        setHasEnded(false);
      }).catch(() => {});
    } catch (err) {
      // Browser autoplay policy catch fallback
    }
  };

  useEffect(() => {
    // Initial play attempt on mount
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
      }).catch(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    }

    // Automatically play video with audio on first page click/tap anywhere
    const handleFirstPageInteraction = () => {
      const v = videoRef.current;
      if (v && v.paused && !v.ended) {
        v.muted = false;
        v.volume = 1;
        v.play().then(() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
          setHasEnded(false);
        }).catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstPageInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstPageInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstPageInteraction);
      window.removeEventListener("touchstart", handleFirstPageInteraction);
    };
  }, []);

  const handleVideoEnded = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setHasEnded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Return to first/preview frame
    }
  };

  const handleVideoPlay = () => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    setHasEnded(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`,
      glareX,
      glareY,
      glareOpacity: 0.45,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false,
    });
  };

  return (
    <div className="landing-section" id="landingDiv" ref={sectionRef}>
      <div className="landing-container">
        {/* Left Column: Intro, Titles & CTAs */}
        <div className="landing-left">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              <span className="first-name">{firstName.toUpperCase()}</span>
              <br />
              {lastName && <span className="last-name">{lastName.toUpperCase()}</span>}
            </h1>
          </div>

          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Cloud Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Full Stack Developer</div>
            </h2>
          </div>

          <div className="landing-actions">
            <div className="cta-button-row">
              <a href="/resume" className="cta-btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>DOWNLOAD RESUME</span>
              </a>

              <a href={`mailto:${config.contact.email}`} className="cta-btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>CONTACT ME</span>
              </a>
            </div>

            <div className="call-row">
              <a href="tel:9353598537" className="call-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>CALL ME</span>
              </a>
              <span className="phone-number">9353598537</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Video Player Card */}
        <div className="landing-right">
          <div className="hero-bg-orb"></div>
          <div className="hero-video-frame">
            <div className="hero-video-ambient-glow"></div>
            
            <div 
              ref={cardRef}
              className={`hero-video-card ${isPlaying ? "is-playing" : "is-waiting"} ${tiltStyle.isHovered ? "is-hovered" : ""}`}
              onClick={handleVideoTap}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: tiltStyle.transform,
                transition: tiltStyle.isHovered
                  ? "transform 0.08s ease-out, box-shadow 0.3s ease"
                  : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease",
              }}
            >
              <video
                ref={videoRef}
                className="hero-video-element"
                playsInline
                preload="metadata"
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnded}
              >
                <source src="/new_video.mp4.mp4" type="video/mp4" />
                <source src="/new_video.mp4" type="video/mp4" />
                <source src="/about-me.mp4.mp4" type="video/mp4" />
                <source src="/about-me.mp4" type="video/mp4" />
              </video>

              {/* Translucent Center Play Overlay Icon (Shown ONLY when waiting/paused/ended) */}
              {!isPlaying && (
                <div className="hero-video-center-icon" aria-label="Play Introduction">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <SocialIcons />
      </div>
    </div>
  );
};

export default Landing;
