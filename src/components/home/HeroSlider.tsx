import React, { useState, useEffect } from 'react';
import { HERO_EDITORIAL_SLIDES, EditorialSlide } from '../../assets/editorialImages';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface HeroSliderProps {
  onNavigate: (section: string) => void;
  onStartAshaDemo?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, onStartAshaDemo }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slow, gentle auto-slide (8 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_EDITORIAL_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = HERO_EDITORIAL_SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_EDITORIAL_SLIDES.length) % HERO_EDITORIAL_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_EDITORIAL_SLIDES.length);
  };

  return (
    <div
      className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with smooth crossfade */}
      {HERO_EDITORIAL_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-[#091124]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091124]/70 via-transparent to-[#091124]/40" />
        </div>
      ))}

      {/* Floating Editorial Badge & Info Card */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-md bg-[#091124]/90 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono font-bold tracking-wider text-teal-300 uppercase shadow-xs">
          {currentSlide.tag}
        </span>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-amber-950/80 backdrop-blur-md border border-amber-600/40 text-[10px] font-mono font-bold text-amber-300 uppercase">
          {currentSlide.levelBadge}
        </span>
      </div>

      {/* Caption Glass Overlay (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
        <div className="bg-[#091124]/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-lg text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold">{currentSlide.metricHighlight}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Quick Demo CTA */}
            <button
              onClick={() => {
                if (onStartAshaDemo) onStartAshaDemo();
                else onNavigate('analyze');
              }}
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Dots and Controls */}
          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5">
              {HERO_EDITORIAL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIdx ? 'w-6 bg-teal-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[11px] font-mono mr-2 text-slate-400">
                0{currentIdx + 1} / 0{HERO_EDITORIAL_SLIDES.length}
              </span>
              <button
                onClick={handlePrev}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Visual"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Visual"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
