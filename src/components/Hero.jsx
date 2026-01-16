import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';

const Hero = () => {
    useGSAP(() => {
      gsap.fromTo('.hero-title', { opacity: 0 }, { opacity: 1, duration: 5 });
      gsap.fromTo('.intro', { y: -50 }, { y: 0, duration: 2 });
      gsap.fromTo('.yo', { opacity: 0 }, { opacity: 1, duration: 5});
    });
  return (
    <section className=' yo  text-white min-h-screen text-gray-gradient  rounded-b-lg border-[#b4dbd0] nav-height bg-black relative'>
      <div className='flex flex-col items-center justify-center rounded-b-xl h-full mt-30'>
        <h1 className='text-md md:text-7xl font-["Rubik"] intro text-white'>Welcome To <span className='text-[#056453] font-bold'>NEW ERA</span> </h1>
        <p className='hero-title mt-4 text-md font-["Rubik"]'>Scroll To Explore</p>
        <div className='w-full h-full absolute inset-0 bg-linear-to-b from-transparent to-black '>
            <Canvas></Canvas>
        </div>
      </div>
    </section>
  )
}

export default Hero