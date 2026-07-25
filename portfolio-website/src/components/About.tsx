import { useEffect, useRef, useState } from "react";
import "./styles/About.css";
import { config } from "../config";

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-section" id="about">
      <div 
        ref={containerRef}
        className={`about-container ${isVisible ? "animate-in" : ""}`}
      >
        {/* Left Column: Developer Photo Card */}
        <div className="about-left">
          <div className="about-photo-glow"></div>
          <div className="about-photo-card">
            <img 
              src="/images/about-photo.jpg.png" 
              alt="Sachidananda Nayak - About Me"
              onError={(e) => {
                e.currentTarget.src = "/images/about-photo.jpg";
              }}
            />
          </div>
        </div>

        {/* Right Column: About Me Info */}
        <div className="about-me">
          <h3 className="title">{config.about.title}</h3>
          <p className="para">{config.about.description}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
