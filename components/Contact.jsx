import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCommentDots, 
  faHome, 
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import emailjs from 'emailjs-com';

// Initialize EmailJS with your Public Key
emailjs.init('RQX6d9WXxco9xulzo');

function Contact() {
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: '' });

    try {
      // Send email using EmailJS service with template_milwi98
      await emailjs.send(
        'service_0tqq52b',      // Your Service ID
        'template_milwi98',     // Your Template ID
        {
          to_email: 'shreyash.padase@mitace.ac.in',
          title: 'New Contact Form Submission',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }
      );

      setStatus({ submitting: false, success: true, error: '' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus({ 
        submitting: false, 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-lg p-6 md:p-8 max-w-4xl w-full flex flex-col md:flex-row mb-6 border border-gray-200">
        {/* Left Section */}
        <div className="w-full md:w-1/2 pr-0 md:pr-8 flex flex-col items-center justify-center mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            Contact Form
          </h1>
          <p className="text-gray-600 text-center text-sm md:text-base">
            Have a question or feedback? Feel free to reach out, and we will get back to you as soon as possible.
          </p>
          
          {/* Contact Info */}
          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
              <span className="text-gray-700">shreyash.padase@mitace.ac.in</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-3" />
              <span className="text-gray-700">+91 7709472811</span>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full p-3 pl-3 border border-gray-300 rounded-lg focus:outline-none shadow-sm ${
                    focusedField === "name" ? "ring-2  ring-blue-500 border-blue-500" : ""
                  }`}
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full p-3 pl-3 border border-gray-300 rounded-lg focus:outline-none shadow-sm ${
                    focusedField === "email" ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full p-3 pl-3 border border-gray-300 rounded-lg focus:outline-none shadow-sm ${
                    focusedField === "phone" ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                />
                <FontAwesomeIcon
                  icon={faPhone}
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Message *</label>
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Type your message"
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full p-3 pl-3 border border-gray-300 rounded-lg focus:outline-none shadow-sm ${
                    focusedField === "message" ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                />
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            {/* Status Messages */}
            {status.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {/* Button Section */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center bg-gray-700 text-white py-3 px-5 rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out shadow-sm focus:outline-none"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Back to Home
              </button>
              <button
                type="submit"
                disabled={status.submitting}
                className={`flex items-center justify-center py-3 px-5 rounded-lg transition duration-200 ease-in-out shadow-sm focus:outline-none ${
                  status.submitting 
                    ? 'bg-pink-400 cursor-not-allowed' 
                    : 'bg-pink-600 hover:bg-pink-700 text-white'
                }`}
              >
                {status.submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Submit Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;