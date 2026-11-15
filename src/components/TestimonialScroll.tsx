import React, { useState } from 'react';
import { Quote, Linkedin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const TestimonialScroll: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { data } = usePortfolio();
  const testimonials = data.testimonials || [];

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden py-6 marquee-mask">
      <div
        className="flex w-max animate-scroll-fast"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => {
          const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            testimonial.author
          )}&background=1a1e28&color=eef0f5&size=200`;

          const avatarSrc =
            testimonial.image && !testimonial.image.includes('ui-avatars.com')
              ? testimonial.image
              : fallbackAvatar;

          return (
            <div
              key={`${testimonial.id || index}-${index}`}
              className="flex-none w-96 min-h-[210px] mx-3 p-6 rounded-[14px] bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] hover:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between cursor-pointer transition-colors duration-150"
              onClick={() =>
                window.open(
                  testimonial.linkedinUrl ||
                    data.hero.linkedinUrl ||
                    'https://linkedin.com/in/mightysanju/',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <Quote className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                  <Linkedin className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                </div>
                <p className="text-[#a3a9b8] text-sm leading-relaxed line-clamp-4">
                  {testimonial.text}
                </p>
              </div>

              <div className="flex items-center pt-4 mt-4 border-t border-white/[0.10]">
                <img
                  src={avatarSrc}
                  alt={testimonial.author}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== fallbackAvatar) {
                      target.src = fallbackAvatar;
                    }
                  }}
                  className="w-9 h-9 rounded-full mr-3 object-cover border border-white/[0.10] bg-[#1a1e28]/70 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[#eef0f5] font-medium text-sm truncate">
                    {testimonial.author}
                  </p>
                  <p className="text-[#7a8296] text-xs truncate">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialScroll;
