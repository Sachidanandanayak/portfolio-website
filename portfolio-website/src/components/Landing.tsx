import { useRef, useState, useEffect } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);

  // 3D Parallax Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let handleFirstInteraction: (() => void) | null = null;
    let handleScroll: (() => void) | null = null;
    let loaderFinishListener: (() => void) | null = null;

    const startPlayback = () => {
      if (!videoRef.current) return;
      const v = videoRef.current;

      try {
        v.currentTime = 0;
      } catch {
        // Ignore if metadata is loading
      }
      v.volume = 1;
      v.muted = false;
      v.defaultMuted = false;

      v.play()
        .then(() => {
          // Audible autoplay succeeded!
        })
        .catch(() => {
          // Fall back to muted autoplay if browser blocks unmuted play
          v.muted = true;
          v.play().catch(() => {});

          // Listen for first user interaction to unmute
          handleFirstInteraction = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.defaultMuted = false;
              videoRef.current.volume = 1;
              if (videoRef.current.paused && !videoRef.current.ended) {
                videoRef.current.play().catch(() => {});
              }
            }
            if (handleFirstInteraction) {
              window.removeEventListener("click", handleFirstInteraction);
              window.removeEventListener("pointerdown", handleFirstInteraction);
              window.removeEventListener("touchstart", handleFirstInteraction);
              window.removeEventListener("keydown", handleFirstInteraction);
            }
          };

          window.addEventListener("click", handleFirstInteraction);
          window.addEventListener("pointerdown", handleFirstInteraction);
          window.addEventListener("touchstart", handleFirstInteraction);
          window.addEventListener("keydown", handleFirstInteraction);
        });

      // Scroll listener: pause video ONLY when scrolled down past top hero section (>250px)
      handleScroll = () => {
        if (videoRef.current) {
          if (window.scrollY > 250) {
            if (!videoRef.current.paused) {
              videoRef.current.pause();
            }
          } else {
            if (videoRef.current.paused && !videoRef.current.ended) {
              videoRef.current.play().catch(() => {});
            }
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
    };

    // If loader is active, wait until it finishes (5.0s) so video doesn't play invisibly behind loader
    const loaderActive = document.querySelector(".premium-loader-overlay");
    if (loaderActive) {
      loaderFinishListener = () => {
        startPlayback();
        if (loaderFinishListener) {
          window.removeEventListener("portfolioLoaderFinished", loaderFinishListener);
        }
      };
      window.addEventListener("portfolioLoaderFinished", loaderFinishListener);
    } else {
      startPlayback();
    }

    return () => {
      if (handleScroll) {
        window.removeEventListener("scroll", handleScroll);
      }
      if (loaderFinishListener) {
        window.removeEventListener("portfolioLoaderFinished", loaderFinishListener);
      }
      if (handleFirstInteraction) {
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("pointerdown", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      }
    };
  }, []);

  const handleVideoClick = () => {
    if (videoEnded && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.play().then(() => setVideoEnded(false)).catch(() => {});
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
                autoPlay
                playsInline
                preload="auto"
                poster="/images/photo.jpg.jpeg"
                onEnded={() => setVideoEnded(true)}
                onClick={handleVideoClick}
                style={{ cursor: videoEnded ? "pointer" : "default" }}
              >
                <source src="/new_video.mp4.mp4" type="video/mp4" />
                <source src="/new_video.mp4" type="video/mp4" />
                <source src="/about-me.mp4.mp4" type="video/mp4" />
                <source src="/about-me.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
