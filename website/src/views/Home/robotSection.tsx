"use client";

import type React from "react";
import { memo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useAnimation } from "framer-motion";
import { isMobileDevice } from "@/utils/deviceDetection";
import type { LottieRefCurrentProps } from "lottie-react";
import type { SectionProps } from "@/utils/types/section";
import { SECTION_CONTAINER_CLASS } from "@/utils/configs";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
    </div>
  ),
});

const GlowEffect = memo(() => {
  const isMobile = isMobileDevice();

  const mobileConfig = {
    outer: {
      size: "w-[250px] h-[250px]",
      blur: "blur-[40px]",
      opacity: "opacity-20",
    },
    inner: {
      size: "w-[150px] h-[150px]",
      blur: "blur-[25px]",
      opacity: "opacity-30",
    },
  };

  const desktopConfig = {
    outer: {
      size: "w-[600px] h-[600px]",
      blur: "blur-[120px]",
      opacity: "opacity-30",
    },
    inner: {
      size: "w-[350px] h-[350px]",
      blur: "blur-[80px]",
      opacity: "opacity-40",
    },
  };

  const config = isMobile ? mobileConfig : desktopConfig;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          ${config.outer.size} ${config.outer.blur} ${config.outer.opacity}
          rounded-full bg-green-500/50`}
        aria-hidden="true"
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          ${config.inner.size} ${config.inner.blur} ${config.inner.opacity}
          rounded-full bg-green-400/40`}
        aria-hidden="true"
      />
    </div>
  );
});

GlowEffect.displayName = "GlowEffect";

const RobotSection: React.FC<SectionProps> = ({ id, animationData }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const controls = useAnimation();
  const isMobile = isMobileDevice();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (isMobile) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      if (!isMounted) return;

      if (entry.isIntersecting) {
        lottieRef.current?.animationItem?.play();
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 },
        });
      } else {
        lottieRef.current?.animationItem?.pause();
        controls.start({ opacity: 0, y: 30 });
      }
    };

    const observerOptions: IntersectionObserverInit = { threshold: 0.3 };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, [controls, isMobile, isMounted]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative h-dvh md:min-h-screen bg-black flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
    >
      <GlowEffect />

      <motion.div
        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        animate={controls}
        className={`relative z-10 flex flex-col items-center text-center ${SECTION_CONTAINER_CLASS}`}
      >
        <h2 className="text-white text-3xl sm:text-4xl font-light mb-12 tracking-tight">
          with{" "}
          <span className="font-extrabold text-green-400 drop-shadow-lg">
            AI<span className="text-white">...</span>
          </span>
        </h2>

        <div className="w-full max-w-[280px] sm:max-w-[400px] aspect-square">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              lottieRef={lottieRef}
              style={{
                filter: "brightness(0) invert(1)",
                width: "100%",
                height: "100%",
              }}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
                progressiveLoad: true,
                hideOnTransparent: true,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-400/40 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(RobotSection);
