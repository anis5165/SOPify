import React from 'react';

const Home = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Header */}
      

      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('backgroundhomepage.jpg')", // Replace with an attractive SOP-related background
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Automate Your SOP Creation  
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            SOPify makes it seamless to document, manage, and export your SOPs with precision and ease.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </section>

      {/* Why SOPify */}
      <section className="py-20 px-10 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10 animate-fadeIn">
          Why SOPify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Auto Screenshot & Highlights',
              desc: 'Capture actions and auto-generate steps with clarity.',
              img: 'autoscreenshot.jpg'
            },
            {
              title: 'Professional Templates',
              desc: 'Pick from structured SOP templates crafted for clarity.',
              img: 'Templates.jpg'
            },
            {
              title: 'Export in Multiple Formats',
              desc: 'Download SOPs as PDF, DOCX, PNG or JPG – free forever.',
              img: 'Export.jpg'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02]"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-6 bg-blue-50">
        <h2 className="text-3xl font-semibold text-center mb-10 animate-fadeIn">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Anamika Singh',
              role: 'Registration, Procedure Generation, Content Editing',
              img: 'girl.jpg' // Add illustrated girl image here
            },
            {
              name: 'Yadav Ruchi Tulsiram',
              role: 'Dashboard, Feedback, Exporting Tools',
              img: 'girl.jpg' // Add illustrated girl image here
            }
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg w-72 text-center transition duration-300 hover:scale-105"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-200"
              />
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} SOPify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;