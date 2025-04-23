import React from "react";

const AboutSection = ({ title, content, imgSrc, reverse }) => {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center justify-between gap-6 md:gap-8 lg:gap-12 max-w-4xl lg:max-w-6xl mx-auto mb-12 md:mb-16 p-5 sm:p-6 md:p-8 bg-white shadow-md hover:shadow-lg rounded-lg md:rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-1`}
    >
      {/* Image Section */}
      <div className="w-full sm:w-4/5 md:w-2/5 lg:w-2/5 flex-shrink-0 rounded-lg overflow-hidden shadow-sm transform transition-transform duration-500 ease-in-out hover:scale-[1.02]">
        <img
          className="w-full h-auto object-cover rounded-lg aspect-video md:aspect-[4/5]"
          src={imgSrc}
          alt={title}
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-3/5 lg:w-1/2 text-center md:text-left mt-4 md:mt-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4 font-sans">
          {title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

function About() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-serif tracking-tight">
            Product And System
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-indigo-600 mx-auto mt-3 md:mt-4 rounded-full"></div>
        </div>

        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          <AboutSection
            title="About Us"
            imgSrc="/src/assets/Group.jpg"
            content="We are a team of passionate developers who love building innovative products that solve real-world problems. Our mission is to blend creativity with technology and deliver systems that make an impact."
            reverse={false}
          />

          <AboutSection
            title="Our Vision"
            imgSrc="/src/assets/Group.jpg"
            content="Our vision is to lead innovation by creating user-centric, sustainable, and scalable tech solutions. We aim to empower communities and industries through thoughtful design and cutting-edge development."
            reverse={true}
          />
        </div>
      </div>
    </section>
  );
}

export default About;