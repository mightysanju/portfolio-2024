import { useState } from 'react';
import { Quote, Linkedin } from 'lucide-react';

const TestimonialScroll = () => {
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      text: 'Sanju is one of the team members on the floor who always strive towards process excellence.',
      author: 'Deepak Sharma',
      position: 'Operations Manager, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/D5603AQERROWVAu8dow/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1670845258471?e=1736985600&v=beta&t=8vwbeBLWl9dmRYRvSXrg5qguF85YoJu8ktUlBs_2Gb8',
    },
    {
      text: 'He is highly innovative and would love to explore above and beyond his domain.',
      author: 'D V L Sravya',
      position: 'BIE, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/C4D03AQHAZWXY64qv1w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1611839569487?e=1736985600&v=beta&t=3go2wONAcYvHx6RsjgYk2Kn_9RxrIXF6Xexi8vSmq8k',
    },
    {
      text: "Sanju's Python programming skills are top-notch, and they consistently deliver efficient and well-structured code.",
      author: 'Hemanth Pittu',
      position: 'Manager, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/C5603AQFMJnvXtFaiKw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1607003313161?e=1736985600&v=beta&t=mzl1mbe7P-LCpo71fViLHbXFvPFfidDwHE6wNrswOZ8',
    },
  ];

  return (
    <div className="w-full overflow-hidden py-8">
      <div
        className={`flex ${isPaused ? '' : 'animate-scroll-fast'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={index}
            className="flex-none w-96 mx-3 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm
              hover:transform hover:scale-105 transition-all duration-300 neon-card nebula-glow cursor-pointer
              hover:bg-gray-800/70"
            onClick={() => window.open('https://linkedin.com/in/mightysanju/', '_blank')}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-6 h-6 text-purple-400" />
                <Linkedin className="w-5 h-5 text-blue-400 hover:text-blue-300 transition-colors" />
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {testimonial.text}
              </p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-gray-200 font-medium text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialScroll;
