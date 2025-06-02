'use client';
import { useEffect } from 'react';

export default function ContactPage() {
  useEffect(() => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gray-100 min-h-screen flex flex-col">

      <main className="flex-grow p-8 bg-blue-50">
        <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
        <p className="text-center max-w-2xl mx-auto mb-8">
          We’d love to hear from you! Whether you have a question, feedback, or just want to say hello, drop us a message below.
        </p>

        <form className="contact-form max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">Name</label>
            <input type="text" id="name" placeholder="Your Name" required className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">Email</label>
            <input type="email" id="email" placeholder="you@example.com" required className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 font-semibold">Message</label>
            <textarea id="message" placeholder="Your message..." required className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none" />
          </div>

          <button type="submit" className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-all duration-300 ease-in-out">
            Send Message
          </button>
        </form>
      </main>

      <footer className="bg-slate-800 text-white text-center p-4 mt-8">
        <p>&copy; <span id="year"></span> SOPify. All rights reserved.</p>
      </footer>
    </div>
  );
}