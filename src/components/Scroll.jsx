import React, { useEffect, useRef, useState } from 'react';
import Card from './Card.jsx';
import Hero from './Hero.jsx';
import Content from './content.jsx';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const stageRef = useRef(null);
  const tubeInnerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const numLines = 9;
  const fontSizeBase = 6;
  const angle = 360/ numLines;

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');

      initGSAP();
    };

    const initGSAP = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      let radius = 0;
      let origin = '50% 50% 0px';

      // -------------------------------
      // 3D CALCULATIONS (UNCHANGED)
      // -------------------------------
      const set3D = () => {
        const width = window.innerWidth;
        const fontSizePx = (width / 100) * fontSizeBase;
        radius = (fontSizePx / 2) / Math.sin((180 / numLines) * (Math.PI / 180));
        origin = `50% 50% -${radius}px`;
      };

      const setProps = (targets) => {
        targets.forEach((target) => {
          const paramSet = gsap.quickSetter(target, 'css');
          const degrees = gsap.getProperty(target, 'rotateX');
          const radians = degrees * (Math.PI / 180);
          const conversion = Math.abs(Math.cos(radians) / 2 + 0.5);

          paramSet({
            opacity: conversion + 0.5,
            fontWeight: 200 + 700 * conversion,
            fontStretch: `${100 + 700 * conversion}%`,
          });
        });
      };

      const positionTxt = () => {
        gsap.set('.line', {
          rotationX: (i) => -angle * i,
          z: radius,
          transformOrigin: origin,
        });
      };

      // -------------------------------
      // MASTER TIMELINE (KEY CHANGE)
      // -------------------------------
      const setupAnimations = () => {
        set3D();
        positionTxt();
        setProps(gsap.utils.toArray('.line'));

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            scrub: 1,
            start: 'top top',
            end: 'bottom bottom',
          },
        });

        // 🔁 TEXT TUBE ROTATION
        master.to(
          '.line',
          {
            rotateX: '+=1080',
            ease: 'none',
            onUpdate() {
              setProps(this.targets());
            },
          },
          0
        );

        // 🎥 PERSPECTIVE DEPTH
        master.to(
          '.tube',
          {
            perspective: '2vw',
            ease: 'expo.out',
          },
          0
        );
       

        // master.from('.features-section', {
        //   opacity: 0,
        //   y: 150,
        // }, 0.35);

        // master.from('.product-section', {
        //   scale: 0.85,
        //   opacity: 0,
        // }, 0.6);

        // master.from('.contact-section', {
        //   opacity: 0,
        //   y: 80,
        // }, 0.8);
        

        // Show stage when everything is ready
        gsap.to(stageRef.current, { autoAlpha: 1, duration: 0.3 });

        return () => {
          master.kill();
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      };

      const cleanup = setupAnimations();

      const handleResize = () => {
        set3D();
        positionTxt();
      };

      window.addEventListener('resize', handleResize);
      setIsLoaded(true);

      return () => {
        window.removeEventListener('resize', handleResize);
        cleanup();
      };
    };

    loadScripts();
  }, []);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black">
      <style>
        {`
          :root {
            --fontSize: ${fontSizeBase};
          }
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: black;
          }
          .stage {
            height: 1000vh;
            width: 100%;
            visibility: hidden;
            position: relative;
          }
          .tube-container {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            transform: translate(-50%, -50%);
          }
          .tube {
            perspective: 100vw;
          }
          .tube__inner {
            position: relative;
            transform-style: preserve-3d;
          }
          .line {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
            font-family: 'Inter', system-ui, sans-serif;
            font-size: calc(var(--fontSize) * 1vw);
            text-transform: uppercase;
            line-height: 1;
            transform-style: preserve-3d;
            font-weight: 800;
            font-variation-settings: "wght" 800, "wdth" 150;
          }
          @media (max-width: 640px) {
            .overlay-hint {
              left: 50%;
              bottom: auto;
              top: 60%;
              transform: translateX(-50%);
            }
            .tube {
              perspective: 60vw;
            }
            .line {
              font-size: calc(var(--fontSize) * 1.3vw);
            }
            .tube-container {
              width: 100vw;
              height: 100vh;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        `}
      </style>

      {/* SCROLL STAGE */}
      <div ref={stageRef} className="stage">
        {/* FIXED 3D TUBE */}
        <div className="tube-container">
          <div className="tube">
            <div ref={tubeInnerRef} className="tube__inner">
              {[...Array(numLines)].map((_, i) => (
                <h1 key={i} className="line">
                  <span className="text-shadow-gray-500 text-gray-500">SPY HELMET</span>
                </h1>
              ))}
            </div>
          </div>
        </div>
        <div>
            <Content></Content>
            <Content></Content>
            <Content></Content>
            <Content></Content>
            <Content></Content>
        </div>
      </div>

      {/* Overlay hint */}
      <div className="overlay-hint fixed bottom-8 left-8 text-[10px] uppercase tracking-widest opacity-30 pointer-events-none">
        <p className='hero-title mt-4 text-lg'>
          <span className='text-[#86e8d6] font-bold'>SMART</span><span onClick={() => navigate('/Solution')} className='cursor-pointer'> SOLUTION </span>
        </p>
      </div>
    </div>
  );
};

export default App;
