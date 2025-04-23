import React, { useEffect, useState } from "react";

const images = [
  { src: "src/assets/image1.png", slogan: "Your Heart Health Matters!" },
  { src: "src/assets/image3.png", slogan: "Track Your Weight with Precision!" },
  { src: "src/assets/image0.png", slogan: "Stay on Top of Your Body Temperature!" }
];

const AboutSection = ({ title, content, imgSrc, reverse }) => {
  return (
    <div
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center justify-between gap-12 max-w-6xl mx-auto mt-16`}
    >
      {/* Image Section */}
      <div className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-500 ease-in-out hover:scale-105 w-full sm:w-96">
        {/* Black overlay */}
        <div className="absolute inset-0 "></div>
        <img
          className="w-full h-full object-cover"
          src={imgSrc}
          alt="Visual"
        />
      </div>

      {/* Content Section */}
      <div className="text-center md:text-left max-w-lg p-8 rounded-lg shadow-2xl transition-all duration-300 ease-out">
        <div className="group inline">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 leading-tight transition-all duration-500 ease-out group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-[length:100%_100%] group-hover:bg-left group-hover:bg-no-repeat group-hover:bg-clip-text">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset click animation after 200ms
  };

  return (
    <div>
      <div className="w-full my-15 flex items-center justify-center">
        <div
          className={`relative w-[100%] max-w-7xl h-72 sm:h-96 overflow-hidden rounded-xl shadow-lg cursor-pointer ${
            isClicked ? "scale-95" : "scale-100"
          } transition-transform duration-200 ease-in-out`}
          onClick={handleClick}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                currentIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full">
                {/* Black overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                {/* Image */}
                <img
                  src={image.src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                
                {/* Slogan in bottom-right corner */}
                <div className="absolute bottom-4 right-4 text-gray-300 text-xl sm:text-2xl font-bold px-4 py-2 bg-opacity-60 rounded-md">
                  {image.slogan}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-16 font-serif">
          Parameters
        </h1>

        <AboutSection
          title={<span><span className="text-red-500">H</span>eart-Rate & SpO2</span>}
          imgSrc="/src/assets/HeartRate.png"
          content="Heart-rate sensor detects pulse by tracking blood volume changes, giving BPM data.
          SpO₂ sensor measures oxygen levels using light absorption to assess respiratory health."
          reverse={false}
        />

        <AboutSection
          title={<span><span className="text-green-500">W</span>ight sensor</span>}
          imgSrc="/src/assets/Weight.png"
          content="Weight sensor (Load cell): Converts mechanical force or weight into an electrical signal, providing precise measurements for various applications.
          Applications: Commonly used in weighing scales, industrial machinery, and load monitoring systems for accurate weight tracking."
          reverse={true}
        />

        <AboutSection
          title={<span><span className="text-blue-500">b</span>ody-temperature </span>}
          imgSrc="/src/assets/temp.png"
          content="The body temperature sensor uses infrared technology to measure body temperature without direct contact.
          It provides quick and accurate readings, making it ideal for health monitoring and screening systems."
          reverse={false}
        />
      </div>
    </div>
  );
}

export default Home;
