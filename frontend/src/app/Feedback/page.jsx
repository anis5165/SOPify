'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, MessageCircle } from "lucide-react";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6 flex items-center justify-center">
      <motion.div
        initial={{ capacity: 0, scale: 0.9, y: 50 }}
        animate={{ capacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-6 text-indigo-600"
          initial={{ capacity: 0, y: -30 }}
          animate={{ capacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MessageCircle className="inline-block mr-2 text-indigo-400" />
          We Value Your Feedback!
        </motion.h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Your Feedback
            </label>
            <textarea
              placeholder="Share your experience using SOPify..."
              rows={4}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="block text-sm font-semibold text-gray-700 mr-2">
              Rate Us:
            </label>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                onClick={() => setRating(i + 1)}
                className={`w-6 h-6 cursor-pointer transition-transform ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                } hover:scale-110`}
                fill={i < rating ? "currentColor" : "none"}
              />
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold text-lg py-3 hover:bg-indigo-700 transition rounded-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Feedback
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
