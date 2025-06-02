// UserDashboard.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaFileAlt,
  FaPlusCircle,
  FaCog,
  FaChevronRight,
  FaCheckCircle,
  FaRegEdit,
  FaBars,
  FaRocket,
  FaInfoCircle,
  FaQuestionCircle
} from 'react-icons/fa';

const sidebarItems = [
  { label: 'Dashboard', icon: <FaFileAlt /> },
  { label: 'Create SOP', icon: <FaPlusCircle /> },
  { label: 'Help', icon: <FaQuestionCircle /> },
  { label: 'Settings', icon: <FaCog /> },
  { label: 'Logout', icon: <FaSignOutAlt /> },
];

const quickActions = [
  {
    title: 'Create New SOP',
    desc: 'Start documenting your process now.',
    icon: <FaPlusCircle size={24} />,
    color: 'bg-indigo-100 border-indigo-200',
  },
  {
    title: 'Recent SOPs',
    desc: 'View your latest saved procedures.',
    icon: <FaFileAlt size={24} />,
    color: 'bg-blue-100 border-blue-200',
  },
  {
    title: 'Settings',
    desc: 'Manage your account and preferences.',
    icon: <FaCog size={24} />,
    color: 'bg-purple-100 border-purple-200',
  },
  {
    title: 'Get Started Guide',
    desc: 'Read our beginner guide.',
    icon: <FaInfoCircle size={24} />,
    color: 'bg-sky-100 border-sky-200',
  },
];

const recentSOPs = [
  {
    title: 'Onboarding Process',
    date: 'Apr 20, 2025',
    status: 'Draft',
    statusIcon: <FaRegEdit className="text-yellow-500" />,
  },
  {
    title: 'App Setup Guide',
    date: 'Apr 18, 2025',
    status: 'Published',
    statusIcon: <FaCheckCircle className="text-green-500" />,
  },
];

const UserDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="min-h-screen flex text-gray-800"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
        backgroundColor: '#f0f4ff',
      }}
    >
      <AnimatePresence>
        {(!isMobile || menuOpen) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="bg-gradient-to-b from-gray-900 via-indigo-900 to-indigo-800 text-white w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 z-30 shadow-2xl border-r border-indigo-700 md:relative"
          >
            <div className="flex flex-col items-center space-y-2">
              <FaUserCircle size={56} className="text-white drop-shadow-lg" />
              <span className="text-lg font-semibold">Hello, User</span>
            </div>
            <div className="text-2xl font-bold text-center tracking-wide mt-2 mb-4">
              SOPify
            </div>
            <nav className="mt-6">
              {sidebarItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.07, x: 8 }}
                  className="flex items-center space-x-4 p-3 hover:bg-indigo-700 rounded-lg transition group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  <FaChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition" />
                </motion.a>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 transition-all">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-2xl shadow-2xl border border-indigo-100 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FaRocket className="text-indigo-800 text-2xl animate-bounce" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-800">
                Welcome back, <span className="text-indigo-600">User!</span>
              </h1>
            </div>
            <button
              className="md:hidden p-2 rounded bg-indigo-800 text-white shadow-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open sidebar"
            >
              <FaBars size={22} />
            </button>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {quickActions.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.04 }}
                className={`p-6 rounded-xl border shadow-md hover:shadow-xl transition cursor-pointer ${card.color} bg-opacity-80 backdrop-blur-md`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-indigo-900 animate-pulse">{card.icon}</div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                </div>
                <p className="text-gray-700">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent SOP List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center space-x-2 text-indigo-800">
              <FaFileAlt />
              <span>Your Recent SOPs</span>
            </h3>
            <div className="rounded-2xl overflow-x-auto shadow-xl border border-indigo-100 bg-white bg-opacity-90 backdrop-blur-md">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b">Title</th>
                    <th className="py-3 px-4 border-b">Created</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSOPs.map((sop, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="border-t hover:bg-indigo-50 transition"
                    >
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <FaFileAlt className="text-indigo-700" />
                        <span>{sop.title}</span>
                      </td>
                      <td className="py-3 px-4">{sop.date}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        {sop.statusIcon}
                        <span>{sop.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="flex items-center space-x-1 text-indigo-600 hover:underline hover:text-indigo-800 transition">
                          <FaRegEdit />
                          <span>Edit</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;