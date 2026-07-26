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

  // Toast Hint State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3D Parallax Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  });

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    setToastVisible(true);

    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const toggleVideoState = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.ended) {
        video.currentTime = 0;
        video.muted = false;
        video.volume = 1;
        await video.play();
        isPlayingRef.current = true;
        setIsPlaying(true);
        setHasEnded(false);
        showToast("☝ Tap anywhere to pause");
      } else if (!video.paused) {
        video.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        showToast("☝ Tap anywhere to resume");
      } else {
        // Video is paused or in initial state -> play/resume with audio from current timestamp
        video.muted = false;
        video.volume = 1;
        await video.play();
        isPlayingRef.current = true;
        setIsPlaying(true);
        setHasEnded(false);
        showToast("☝ Tap anywhere to pause");
      }
    } catch (err) {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Single global pointerdown listener for non-interactive tap anywhere toggle
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore if user clicked on any interactive element (buttons, links, inputs, navbar, social links)
      if (
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-no-video-toggle]'
        )
      ) {
        return;
      }

      toggleVideoState();
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleVideoEnded = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setHasEnded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Resets to frame 0 so video preview displays
    }
    showToast("↻ Tap anywhere to replay");
  };

  const handleVideoPlay = () => {
    isPlayingRef.current = true;
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    if (videoRef.current && !videoRef.current.ended) {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
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
              className={`hero-video-card ${tiltStyle.isHovered ? "is-hovered" : ""}`}
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
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
              >
                <source src="/new_video.mp4.mp4" type="video/mp4" />
                <source src="/new_video.mp4" type="video/mp4" />
                <source src="/about-me.mp4.mp4" type="video/mp4" />
                <source src="/about-me.mp4" type="video/mp4" />
              </video>

              {/* Initial Overlay Button when video has NOT played yet */}
              {!isPlaying && !hasEnded && (
                <div 
                  className="hero-video-overlay" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoState();
                  }}
                >
                  <button className="hero-video-play-btn" aria-label="Play Introduction Video">
                    <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>PLAY INTRODUCTION</span>
                    <span className="video-duration">20 SEC</span>
                  </button>
                </div>
              )}

              {/* Replay Overlay when Video Finishes */}
              {!isPlaying && hasEnded && (
                <div 
                  className="hero-video-overlay" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoState();
                  }}
                >
                  <button className="hero-video-play-btn replay-mode" aria-label="Replay Introduction Video">
                    <svg className="replay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    <span>REPLAY INTRODUCTION</span>
                  </button>
                </div>
              )}

              {/* Floating Toast Notification Pill */}
              <div className={`hero-video-toast ${toastVisible ? "show" : ""}`}>
                <svg className="toast-icon" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                  <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26A1.99 1.99 0 0 0 13.4 13.5H13V7.5a1.5 1.5 0 0 0-3 0v10.18l-3.37-1.12a1.5 1.5 0 0 0-1.74.55c-.38.56-.34 1.3.1 1.82l4.89 5.86c.46.55 1.14.86 1.86.86h6.76c1.08 0 2.02-.75 2.23-1.81l1.01-5.07c.18-.89-.25-1.81-1.05-2.21z"/>
                </svg>
                <span>{toastMessage}</span>
              </div>
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
