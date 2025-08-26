import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, UserCheck, Star } from 'lucide-react';

type Role = 'recruiter' | 'other';

interface FormData {
  name: string;
  email: string;
  message: string;
  role: Role;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    role: 'other'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/manyjkkr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          role: formData.role,
          _subject: formData.role === 'recruiter' ? '⭐ [RECRUITER] New Contact Form Submission' : 'New Contact Form Submission',
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', role: 'other' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Get in Touch
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-purple-400" />
                <span>sanju.k3r@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-3 text-purple-400" />
                <span>224 7026736</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                <span>Naperville, IL</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
              I am a
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 relative cursor-pointer ${
                formData.role === 'recruiter' ? 'bg-purple-500/20 border-purple-500' : 'bg-gray-800 border-gray-700'
              } border rounded-lg p-4 transition-colors duration-200`}>
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center justify-center">
                  <UserCheck className={`w-5 h-5 ${
                    formData.role === 'recruiter' ? 'text-purple-400' : 'text-gray-400'
                  } mr-2`} />
                  <span className={formData.role === 'recruiter' ? 'text-purple-300' : 'text-gray-300'}>
                    Recruiter
                  </span>
                  {formData.role === 'recruiter' && (
                    <Star className="w-4 h-4 text-yellow-400 ml-2 animate-pulse" />
                  )}
                </div>
              </label>

              <label className={`flex-1 relative cursor-pointer ${
                formData.role === 'other' ? 'bg-purple-500/20 border-purple-500' : 'bg-gray-800 border-gray-700'
              } border rounded-lg p-4 transition-colors duration-200`}>
                <input
                  type="radio"
                  name="role"
                  value="other"
                  checked={formData.role === 'other'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center justify-center">
                  <Mail className={`w-5 h-5 ${
                    formData.role === 'other' ? 'text-purple-400' : 'text-gray-400'
                  } mr-2`} />
                  <span className={formData.role === 'other' ? 'text-purple-300' : 'text-gray-300'}>
                    Other
                  </span>
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg
              hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              focus:ring-offset-gray-900 transition-colors duration-200 flex items-center justify-center disabled:opacity-50
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 flex justify-center overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            <Send className="w-5 h-5 mr-2" />
            <span className="relative">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </span>
            {formData.role === 'recruiter' && (
              <Star className="w-4 h-4 text-yellow-400 ml-2 animate-pulse" />
            )}
          </button>

          {submitStatus === 'success' && (
            <p className="text-green-400 text-sm mt-2">Message sent successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-400 text-sm mt-2">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;