import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';
import { Mail, Send, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    setIsSending(true);

    // Replace these with your actual EmailJS credentials in the future
    const SERVICE_ID = 'service_oo9lnmj';
    const TEMPLATE_ID = 'template_7ryqcox';
    const PUBLIC_KEY = 't7wXzHIv_WWhHlbu4';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        toast.success('Message sent successfully!');
        form.current?.reset();
      }, (error) => {
        console.error('EmailJS Error:', error.text);
        toast.error('Failed to send message. Please check your EmailJS configuration.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-64px)] bg-gray-50/50 p-4 md:p-8 flex items-center justify-center"
    >
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black tracking-tight">Get in touch with us</h1>
          <p className="text-gray-500 mt-2">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text" 
                name="user_name"
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required
                type="email" 
                name="user_email"
                placeholder="john@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
              <input 
                required
                type="text" 
                name="subject"
                placeholder="How can we help?"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
              <textarea 
                required
                name="message"
                rows={5}
                placeholder="Your message here..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none placeholder:text-gray-300 resize-none"
              />
            </div>

            <button 
              disabled={isSending}
              type="submit"
              className="w-full bg-black text-white rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-black/10"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Message
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="text-xs font-medium">support@nexus-crm.com</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
