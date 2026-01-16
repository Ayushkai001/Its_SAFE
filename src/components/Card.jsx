import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import pic1 from '../assets/pic1.png';
import pic2 from '../assets/pic2.png';
import pic3 from '../assets/pic3.png';
import pic4 from '../assets/pic4.png';
import pic5 from '../assets/pic5.png';


export default function App() {
  const navigate = useNavigate();
  useGSAP(() => {
      gsap.fromTo('.koko', { opacity: 0 }, { opacity: 1, duration: 5 });
    });
  const galleryRef = useRef(null);
  const cardsContainerRef = useRef(null);
  
  // Internal state to hold the navigation functions
  const scrollFunctions = useRef({ scrollToOffset: null, getOffset: null, duration: 0 });

  useEffect(() => {
    // Helper to load external scripts
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initCarousel = async () => {
      try {
        // Load GSAP and ScrollTrigger from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');

        const gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);
        const ScrollTrigger = window.ScrollTrigger;

        const cards = gsap.utils.toArray('.card-item');
        const spacing = 0.2; // Increased spacing for finite feel
        const snapTime = gsap.utils.snap(spacing);

        // Set initial state: Hidden and to the right
        gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

        // Build a single linear timeline for all items
        const mainTimeline = gsap.timeline({ paused: true });
        
        cards.forEach((card, i) => {
          const startTime = i * spacing;
          mainTimeline.fromTo(
            card,
            { scale: 0, opacity: 0, xPercent: 400 },
            { 
              scale: 1, 
              opacity: 1, 
              zIndex: 100, 
              duration: 0.5, 
              yoyo: true, 
              repeat: 1, 
              ease: "power1.inOut", 
              immediateRender: false 
            },
            startTime
          ).fromTo(
            card,
            { xPercent: 400 },
            { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
            startTime
          );
        });

        const timelineDuration = mainTimeline.duration();
        const playhead = { offset: 0 };

        // Smooth scrub proxy
        const scrub = gsap.to(playhead, {
          offset: 0,
          onUpdate() {
            mainTimeline.time(playhead.offset);
          },
          duration: 0.5,
          ease: "power3",
          paused: true,
        });

        // ScrollTrigger to drive the finite timeline
        const trigger = ScrollTrigger.create({
          start: 0,
          end: "+=3000",
           scrub: true,
          onUpdate(self) {
            // Map 0-1 progress directly to 0-duration of timeline
            scrub.vars.offset = self.progress * timelineDuration;
            scrub.invalidate().restart();
          },
          pin: galleryRef.current,
        });

        const scrollToOffset = (offset) => {
          // Clamp the offset between 0 and the end of the timeline
          const clampedOffset = gsap.utils.clamp(0, timelineDuration, offset);
          const progress = clampedOffset / timelineDuration;
          trigger.scroll(progress * trigger.end);
        };

        // Expose functions to refs
        scrollFunctions.current.scrollToOffset = scrollToOffset;
        scrollFunctions.current.getOffset = () => scrub.vars.offset;
        scrollFunctions.current.duration = timelineDuration;
        scrollFunctions.current.spacing = spacing;

        const onScrollEnd = () => scrollToOffset(snapTime(scrub.vars.offset));
        ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

        // Store references for cleanup
        window._carouselCleanup = () => {
          trigger.kill();
          scrub.kill();
          mainTimeline.kill();
          ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
        };

      } catch (err) {
        console.error("Failed to load GSAP", err);
      }
    };

    initCarousel();

    return () => {
      if (window._carouselCleanup) window._carouselCleanup();
    };
  }, []);

  const handleNext = () => {
    const { scrollToOffset, getOffset, spacing } = scrollFunctions.current;
    if (scrollToOffset) scrollToOffset(getOffset() + spacing);
  };

  const handlePrev = () => {
    const { scrollToOffset, getOffset, spacing } = scrollFunctions.current;
    if (scrollToOffset) scrollToOffset(getOffset() - spacing);
  };

  const CARD_IMAGES = [
    pic1,
    pic2,
    pic3,
    pic4,
    pic5
  ];

  return (
    <div className="bg-neutral-950 min-h-screen text-white overflow-x-hidden">
      {/* Scroll context spacer */}
      <div className="h-[4000px] w-full">
        <div 
          ref={galleryRef} 
          className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center select-none"
        >
          {/* Card Container */}
          <div className="relative w-56 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96">
            <ul ref={cardsContainerRef} className="absolute inset-0 list-none p-0 m-0">
              {CARD_IMAGES.map((url, index) => (
                <li
                  key={index}
                  className="card-item absolute inset-0 rounded-xl bg-cover bg-center bg-no-repeat shadow-2xl border border-white/10"
                  style={{ backgroundImage: `url(${url})` }}
                />
                
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
            <button
              onClick={handlePrev}
              className="group flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/10 transition-all active:scale-90"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-xs font-bold uppercase tracking-widest">Prev</span>
            </button>
            <button
              onClick={() => navigate('/Solution')}
              className="group koko flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/10 transition-all active:scale-90 hidden md:flex"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-green-500">Solution</span>
              
            </button>
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/10 transition-all active:scale-90"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Next</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .card-item {
          aspect-ratio: 9/16;
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(0,0,0,0.8);
          will-change: transform, opacity;
        }
      `}} />
    </div>
  );
}