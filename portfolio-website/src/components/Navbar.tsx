import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      });
    });

    // Handle resize
    const handleResize = () => {
      lenis?.resize();
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      lenis?.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    const landing = document.querySelector("#landingDiv") as HTMLElement;
    if (landing && lenis) {
      lenis.scrollTo(landing, { offset: 0, duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={`header ${menuOpen ? "menu-open" : ""}`}>
        {/* Animated Solar Sun Logo containing "SN" */}
        <a
          href="/#"
          className="sun-logo-btn"
          data-cursor="disable"
          aria-label="Go to home"
          onClick={handleHomeClick}
        >
          <div className="sun-logo-container">
            {/* Expanding energy pulse ring */}
            <div className="sun-energy-ring"></div>

            {/* Rotating solar rays layer */}
            <svg className="sun-rays" viewBox="0 0 100 100" aria-hidden="true">
              <line x1="50" y1="6" x2="50" y2="16" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="84" x2="50" y2="94" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="50" x2="16" y2="50" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="84" y1="50" x2="94" y2="50" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="19" y1="19" x2="26" y2="26" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="74" y1="74" x2="81" y2="81" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="81" y1="19" x2="74" y2="26" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="26" y1="74" x2="19" y2="81" stroke="url(#sunRayGrad)" strokeWidth="2.5" strokeLinecap="round" />
              
              <defs>
                <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6A00" />
                  <stop offset="50%" stopColor="#FF8C00" />
                  <stop offset="100%" stopColor="#FFC247" />
                </linearGradient>
              </defs>
            </svg>

            {/* Non-rotating Sun Core containing centered "SN" */}
            <div className="sun-core">
              <span className="sun-logo-text">SN</span>
            </div>
          </div>
        </a>

        <a
          href="mailto:metisachin@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          metisachin@gmail.com
        </a>

        <button
          className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a
              data-href="#about"
              href="#about"
              onClick={() => handleLinkClick("#about")}
            >
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a
              data-href="#work"
              href="#work"
              onClick={() => handleLinkClick("#work")}
            >
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a
              data-href="#contact"
              href="#contact"
              onClick={() => handleLinkClick("#contact")}
            >
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
