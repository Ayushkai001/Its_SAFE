import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import pic1 from '../assets/pic1.png';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Outfit:wght@200;400;600&display=swap');

  :root {
    --bg-base: #030303;
    --text-high: #ffffff;
    --text-low: #444444;
    --accent: #ff3e00;
    --border: rgba(255, 255, 255, 0.1);
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-high);
    margin: 0;
    overflow-x: hidden;
  }

  .scroll-container {
    font-family: 'Outfit', sans-serif;
  }

  /* Progress Bar */
  .progress-bar {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 60px;
    height: 60px;
    z-index: 1000;
  }

  .progress-circle {
    transform: rotate(-90deg);
  }

  /* Blank Editorial Section */
  .editorial-header {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8%;
    box-sizing: border-box;
  }

  .editorial-header h1 {
    font-family: 'Syncopate', sans-serif;
    font-size: clamp(3rem, 10vw, 8rem);
    text-transform: uppercase;
    line-height: 0.85;
    margin: 0;
    letter-spacing: -0.05em;
  }

  .editorial-header .sub {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: var(--accent);
    margin-bottom: 20px;
  }

  /* Horizontal Section */
  .horizontal-wrapper {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: #000;
  }

  .horizontal-track {
    display: flex;
    height: 100vh;
    width: max-content;
    align-items: center;
    padding: 0 10vw;
  }

  .gallery-item {
    position: relative;
    width: 60vw;
    height: 70vh;
    margin-right: 15vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 40px;
    box-sizing: border-box;
    overflow: hidden;
    background: #0a0a0a;
    border: 1px solid var(--border);
    will-change: transform;
  }

  .item-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #111, #050505);
    z-index: 0;
  }

  .gallery-item h2 {
    font-family: 'Syncopate', sans-serif;
    font-size: clamp(1.5rem, 4vw, 3rem);
    margin: 0;
    z-index: 1;
    text-transform: uppercase;
  }

  .gallery-item p {
    font-size: 1rem;
    color: var(--text-low);
    max-width: 400px;
    z-index: 1;
    margin: 15px 0 0 0;
  }

  .item-number {
    position: absolute;
    top: 40px;
    right: 40px;
    font-family: 'Syncopate', sans-serif;
    font-size: 1.2rem;
    color: var(--accent);
    opacity: 0.8;
  }

  .loader {
    position: fixed;
    inset: 0;
    background: var(--bg-base);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    font-family: 'Syncopate', sans-serif;
    letter-spacing: 1em;
    font-size: 0.7rem;
  }
`;

const DATA = [
  { title: "RIGID BODY", sub: "Engineered with industrial-grade materials to withstand extreme conditions, delivering long-term reliability without compromise." },
  { title: "Sensors Stacks", sub: "A tightly integrated stack of physiological and environmental sensors ensures accurate, low-latency data capture at all times." },
  { title: "Affordable", sub: "Optimized hardware design and efficient processing make advanced safety technology accessible and scalable in affordable pricing." },
  { title: "Real Time Monitoring", sub: "Continuous data streaming and on-device processing enable instant alerts and actionable insights." },
  { title: "Robust AI", sub: "An intelligent System that learns, predicts, and evolves—always one step ahead." }
];

const HorizontalGallery = () => {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const itemsRef = useRef([]);

  useLayoutEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const items = itemsRef.current;
      
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      // Main Horizontal Scroll
      const scrollTween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Item Skew & Scale Effect
      items.forEach((item) => {
        gsap.fromTo(item, 
          { skewX: 5, scale: 0.9, opacity: 0.5 },
          {
            skewX: 0,
            scale: 1,
            opacity: 1,
            ease: "sine.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: scrollTween,
              start: "left 90%",
              end: "left 40%",
              scrub: true,
            }
          }
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="horizontal-wrapper" ref={wrapperRef}>
      <div className="horizontal-track" ref={trackRef}>
        {DATA.map((d, i) => (
          <div 
            key={i} 
            className="gallery-item"
            ref={el => itemsRef.current[i] = el}
          >
            <div className="item-image-placeholder" ><img src={pic1} alt="" /></div>
            <span className="item-number">0{i + 1}</span>
            <h2>{d.title}</h2>
            <p>{d.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'
    ];

    const load = (src) => new Promise((res) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; document.head.appendChild(s);
    });

    Promise.all(scripts.map(load)).then(() => {
      window.gsap.registerPlugin(window.ScrollTrigger);
      setIsReady(true);
    });
  }, []);

  if (!isReady) return <div className="loader">CREANDUM...</div>;

return (
    <div className="scroll-container">
        <style>{STYLES + `
            @media (max-width: 900px) {
                .editorial-header {
                    padding: 0 4%;
                }
                .horizontal-track {
                    padding: 0 2vw;
                }
                .gallery-item {
                    width: 80vw;
                    height: 40vh;
                    margin-right: 8vw;
                    padding: 20px;
                }
                .item-number {
                    top: 20px;
                    right: 20px;
                    font-size: 1rem;
                }
            }
            @media (max-width: 600px) {
                .editorial-header {
                    height: 60vh;
                    padding: 0 2%;
                }
                .editorial-header h1 {
                    font-size: clamp(2rem, 8vw, 4rem);
                }
                .horizontal-wrapper, .horizontal-track {
                    height: 50vh;
                }
                .gallery-item {
                    width: 90vw;
                    height: 30vh;
                    margin-right: 4vw;
                    padding: 10px;
                }
                .gallery-item h2 {
                    font-size: clamp(1rem, 5vw, 2rem);
                }
                .gallery-item p {
                    font-size: 0.9rem;
                }
            }
        `}</style>
        
        <section className="editorial-header">
            <span className="sub Capitalized">Helmet that can see the future</span>
            <h1>SMART<br/>Helmet</h1>
        </section>

        <HorizontalGallery />

        <section className="editorial-header" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
            <h1>Its_SAFE</h1>
            <span className="sub">With US</span>
        </section>
    </div>
);
}