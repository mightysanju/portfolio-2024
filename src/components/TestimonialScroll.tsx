import { useState } from 'react';
import { Quote, Linkedin } from 'lucide-react';

const TestimonialScroll = () => {
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      text: '"Sanju provided the TheyPay Carrier Management Team (TCMT) a tailored application "Defect Disputes Override" tool or "DDO" that reduced associate research workload for dispositioning appointment defects carrier incurred working with Amazon.',
      author: 'Jake Porter',
      position: 'Senior Supply Chain Manager, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/D5603AQEgbMCz8YxCGQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706211347116?e=1758758400&v=beta&t=ukCwXKsLtMiuNwAHG0mZpixama_JF0wUmBwlF_vo50w',
    },
    {
      text: "Sanju demonstrated a knowledgeable and professional approach to every task. He quickly grasped the project's nuances and offered insightful solutions to every technical challenge.",
      author: 'Jaime Martinez',
      position: 'Manager, General Dynamics Land Systems',
      image:
        'https://media.licdn.com/dms/image/v2/D5603AQGgN7ybGzbAwA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726678183711?e=1758758400&v=beta&t=kEeb-mnqJBOH8Z07BfXVSO_1Q_oHNjaJv3h1SOTNBtI',
    },
    {
      text: 'Sanju is one of the team members on the floor who always strive towards process excellence.',
      author: 'Deepak Sharma',
      position: 'Operations Manager, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/D5603AQERROWVAu8dow/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1670845258471?e=1758758400&v=beta&t=ErdqPpc_32QCS0CyJSgf5u_bD25zNBCIq6j-GBy8PS4',
    },
    {
      text: 'He is highly innovative and would love to explore above and beyond his domain.',
      author: 'D V L Sravya',
      position: 'BIE, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/C4D03AQHAZWXY64qv1w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1611839569487?e=1758758400&v=beta&t=IeuMibPc6oDIvOWmoDGhYGan3OO09jsC62JvJarwDHk',
    },
    {
      text: "Sanju's Python programming skills are top-notch, and they consistently deliver efficient and well-structured code.",
      author: 'Hemanth Pittu',
      position: 'Manager, Amazon',
      image:
        'https://media.licdn.com/dms/image/v2/D5603AQGuajNYh2Cl7A/profile-displayphoto-shrink_800_800/B56ZbKtd57GsAc-/0/1747157639537?e=1758758400&v=beta&t=mheENDSn7tOImA2ULTuQwiea2We6kZF2GeHsVtChoA8',
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
