'use client';
import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Users,
  FileText,
  Download,
  Eye,
  Code,
  PenTool,
  Target,
  Image as ImageIcon,
  Sparkles,
  Star,
  HeartHandshake,
  Rocket
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Lightbulb color="#facc15" size={32} />,
      title: "Template Guidance",
      text: "Pre-designed SOP templates with suggestions.",
    },
    {
      icon: <Users color="#10b981" size={32} />,
      title: "Team Collaboration",
      text: "Invite others to view, comment or review SOPs.",
    },
    {
      icon: <FileText color="#3b82f6" size={32} />,
      title: "Content Editing",
      text: "Fully editable sections for personalized inputs.",
    },
    {
      icon: <Download color="#ef4444" size={32} />,
      title: "Multi-format Export",
      text: "Export to PDF, DOCX, JPG, PNG, and more.",
    },
    {
      icon: <Code color="#8b5cf6" size={32} />,
      title: "Automatic Screenshot",
      text: "Captures workflow and highlights actions.",
    },
    {
      icon: <PenTool color="#f472b6" size={32} />,
      title: "Design Tools",
      text: "Use fonts, spacing, and styles for a clean layout.",
    },
  ];

  const team = [
    {
      name: "Anamika Singh",
      role: "Backend Developer",
      image: "girl.jpg",
      tasks: [
        
      ],
    },
    {
      name: "Yadav Ruchi Tulsiram",
      role: "Frontend Developer",
      image: "girl.jpg",
      tasks: [
       
        
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-100 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="border border-blue-200 bg-white/90 rounded-3xl shadow-xl p-6 md:p-10 backdrop-blur-sm relative overflow-hidden"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
        >
          <Sparkles className="absolute top-4 right-4 text-yellow-400 animate-pulse" size={28} />
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 text-center">About SOPify</h1>
          <p className="text-center text-lg text-gray-600 mt-4">
            SOPify helps you create structured SOPs automatically with screenshots, highlights, and formatting – all exportable in one click.
          </p>
        </motion.div>

        {/* Our Vision */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="border border-purple-300 bg-gradient-to-r from-purple-50 to-white rounded-3xl p-6 shadow-md"
          style={{ backgroundImage: "url('white.jpg')" }}
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <Eye color="#7c3aed" /> Our Vision
          </h2>
          <p className="text-gray-700">
            We envision a world where SOP creation is no longer a tedious task but an automated, intuitive process. SOPify empowers educators, businesses, and professionals to document efficiently, boost productivity, and maintain consistency.
          </p>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="border border-indigo-300 bg-gradient-to-l from-indigo-50 to-white rounded-3xl p-6 shadow-md"
        
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <Target color="#6366f1" /> Our Mission
          </h2>
          <p className="text-gray-700">
            Our mission is to eliminate the manual hassle of SOP documentation by delivering smart, automated tools that streamline the creation, customization, and sharing of process guides – helping teams save time and scale faster.
          </p>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="border border-green-200 bg-gradient-to-tr from-green-50 to-white rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Key Features</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-white border rounded-xl shadow text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-2 animate-pulse">{feature.icon}</div>
                <h4 className="font-semibold text-md text-blue-600">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Use SOPify */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="border border-blue-200 bg-white rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <ImageIcon color="#3b82f6" /> How to Use SOPify
          </h2>
          <img
            src="SOPIFY.jpg"
            alt="How to use SOPify"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </motion.div>

        {/* Meet the Team */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="border border-pink-200 bg-pink-50 rounded-3xl p-6 shadow-md"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center flex items-center justify-center gap-2">
            <HeartHandshake /> Meet the Team
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="border bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full border"
                  />
                  <div>
                    <h4 className="font-bold text-blue-700">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <ul className="mt-2 ml-2 list-disc text-sm text-gray-600">
                  {member.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="border border-blue-300 bg-blue-50 rounded-3xl p-6 shadow relative"
        >
          <Rocket className="absolute top-4 right-4 text-indigo-400 animate-bounce" />
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <PenTool color="#2563eb" /> Conclusion
          </h2>
          <p className="text-gray-700">
            SOPify is built to revolutionize how professionals create SOPs. By simplifying the process, enabling exports, and saving valuable time, we empower users to focus on what truly matters — their goals.
          </p>
        </motion.div>

        <footer className="text-center text-sm text-gray-500 pt-10">
          © 2025 SOPify. Built by Anamika Singh & Ruchi Tulsiram.
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
