import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, UserCheck } from 'lucide-react';

type Role = 'recruiter' | 'other';

interface FormData {
  name: string;
  email: string;
  message: string;
  role: Role;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    role: 'other',
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          role: formData.role,
          _subject:
            formData.role === 'recruiter'
              ? '[Recruiter] New Contact Form Submission'
              : 'New Contact Form Submission',
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', role: 'other' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
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
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="font-mono text-xs text-[#7a8296] mb-2">
          04 / Contact
        </p>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
          Get in touch
        </h2>
        <p className="text-sm sm:text-base text-[#a3a9b8] max-w-xl">
          Direct inquiries for engineering roles, consulting, or technical collaboration.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="p-6 rounded-[14px] bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] space-y-5">
            <h3 className="text-base font-medium text-[#eef0f5]">
              Direct channels
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3 text-[#a3a9b8]">
                <Mail className="w-4 h-4 text-[#7a8296] flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:sanju.k3r@gmail.com"
                  className="hover:text-[#eef0f5] transition-colors duration-150"
                >
                  sanju.k3r@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#a3a9b8]">
                <Phone className="w-4 h-4 text-[#7a8296] flex-shrink-0" strokeWidth={1.5} />
                <span className="font-mono tabular-nums">224 702 6736</span>
              </div>
              <div className="flex items-center gap-3 text-[#a3a9b8]">
                <MapPin className="w-4 h-4 text-[#7a8296] flex-shrink-0" strokeWidth={1.5} />
                <span>Naperville, IL</span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 p-6 rounded-[14px] bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[#a3a9b8] mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none focus:border-white/[0.24] transition-colors duration-150"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#a3a9b8] mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none focus:border-white/[0.24] transition-colors duration-150"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a3a9b8] mb-1.5">
              Inquiry type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`cursor-pointer h-10 px-3.5 rounded-[8px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-150 ${
                  formData.role === 'recruiter'
                    ? 'bg-[#1a1e28]/70 backdrop-blur-md border-white/[0.2] text-[#eef0f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'bg-[#0b0d14]/70 border-white/[0.10] text-[#a3a9b8] hover:text-[#eef0f5]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <UserCheck className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <span>Recruiter</span>
              </label>

              <label
                className={`cursor-pointer h-10 px-3.5 rounded-[8px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-150 ${
                  formData.role === 'other'
                    ? 'bg-[#1a1e28]/70 backdrop-blur-md border-white/[0.2] text-[#eef0f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'bg-[#0b0d14]/70 border-white/[0.10] text-[#a3a9b8] hover:text-[#eef0f5]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="other"
                  checked={formData.role === 'other'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Mail className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <span>General inquiry</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium text-[#a3a9b8] mb-1.5"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none focus:border-white/[0.24] resize-none transition-colors duration-150"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 px-5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-colors duration-150"
          >
            <Send className="w-4 h-4" strokeWidth={1.5} />
            <span>{isSubmitting ? 'Sending...' : 'Send message'}</span>
          </button>

          {submitStatus === 'success' && (
            <p className="text-[#4cc38a] text-xs">Message sent.</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-400 text-xs">
              Failed to send message. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
