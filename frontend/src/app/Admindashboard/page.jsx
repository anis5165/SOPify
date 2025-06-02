'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Download, Settings, LogOut, BookMarked
} from 'lucide-react';

// Animation for cards
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: i => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    },
  }),
};

// Animation for logout button
const buttonVariants = {
  rest: { scale: 1, backgroundColor: '#ef4444' },
  hover: {
    scale: 1.05,
    backgroundColor: '#b91c1c',
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 }
};

// Feature Cards Data
const features = [
  {
    icon: <Users size={28} className="text-indigo-600" />,
    title: 'User Management',
    desc: 'Manage user accounts and permissions.',
  },
  {
    icon: <FileText size={28} className="text-blue-600" />,
    title: 'SOP Templates',
    desc: 'Edit or create SOP templates based on categories.',
  },
  {
    icon: <BookMarked size={28} className="text-green-600" />,
    title: 'Review Requests',
    desc: 'View and respond to peer or expert review submissions.',
  },
  {
    icon: <Download size={28} className="text-teal-600" />,
    title: 'Export Logs',
    desc: 'Track downloads and export formats used.',
  },
  {
    icon: <Settings size={28} className="text-yellow-600" />,
    title: 'System Settings',
    desc: 'Customize platform behavior and branding.',
  },
];

export default function AdminDashboard() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <motion.header
        className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={32} />
          Admin Dashboard
        </h1>

        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="px-4 py-2 text-white rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </motion.header>

      {/* Feature Cards */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            }
          }
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
            className="bg-white p-6 rounded-2xl border border-gray-200 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-gray-100 p-3 rounded-full shadow-inner">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{feature.title}</h2>
            </div>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="mt-16 text-center text-sm text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        © {new Date().getFullYear()} SOPify Admin Panel
      </motion.footer>
    </motion.div>
  );
}
