import { bigShoe1 } from '@/assets/images/page';
import Image from 'next/image';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-zinc-800">
      <div
        style={{
          width: '100vw',
          height: '90vh',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '20px',
        }}
      >
        <div className="flex flex-col ">
          <div className="relative ">
            <p className="text-xl font-montserrat text-coral-red text-white ">
              Papers Dock
            </p>
           
            <br/>
            <h1 className="font-montserrat font-bold text-white ">
              <span
                style={{ display: 'block', whiteSpace: 'nowrap' }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl  xl:text-8xl"
              >
                Advanced Academia
              </span>
             <br/>
              <span
                style={{ display: 'block', whiteSpace: 'nowrap' }}
                className=" mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              >
                Mastering <span style={{color:'#EADEA1'}}>
                  
                  A Levels
                  </span>
              </span>
            </h1>
        
            <p className="font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm text-white">
              Empowering students with comprehensive O and A level resources for
              academic excellence.
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <Image src={bigShoe1} alt="hero image" width={400} height={400} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
