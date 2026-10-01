'use client'
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! Your message has been received.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Contact Us</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Have questions about orders, payments, or seller registration? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Mail className="text-emerald-400" size={24} />
            <h4 className="font-bold text-white text-sm">Email Us</h4>
            <p className="text-xs text-slate-400">support@gocart.com</p>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-2">
            <Phone className="text-emerald-400" size={24} />
            <h4 className="font-bold text-white text-sm">Call Us</h4>
            <p className="text-xs text-slate-400">+91 8433210134</p>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-2">
            <MapPin className="text-emerald-400" size={24} />
            <h4 className="font-bold text-white text-sm">Location</h4>
            <p className="text-xs text-slate-400">Bhojipura, Bareilly, UP, India</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-800 p-8 rounded-2xl space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Query about Order #1234"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="How can we help you?"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Send size={15} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}