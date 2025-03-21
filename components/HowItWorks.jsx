"use client"
import React, { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const HowItWorks = () => {
  const steps = [
    {
      title: "ESP32/ESP8266 Sensor",
      icon: "microchip",
      description: "IoT devices equipped with temperature and humidity sensors collect environmental data. These ESP devices run custom firmware that reads sensor values at configurable intervals, processes the raw data, and prepares it for transmission."
    },
    {
      title: "MQTT Broker",
      icon: "network",
      description: "The ESP devices publish data to specific topics on an MQTT broker (like Mosquitto). The broker acts as a message bus, receiving published messages from sensors and making them available to subscribed clients. This publish-subscribe model enables efficient, real-time data distribution."
    },
    {
      title: "Backend Server",
      icon: "server",
      description: "A Node.js backend server subscribes to relevant MQTT topics and processes incoming data. It validates, enriches, and transforms the data before establishing WebSocket connections to stream the processed information to connected clients."
    },
    {
      title: "Frontend Dashboard",
      icon: "dashboard",
      description: "The React-based frontend connects to the WebSocket server to receive real-time updates. It processes and visualizes the incoming data stream, updating the dashboard dynamically without page refreshes."
    }
  ]
  const [stars, setStars] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(generatedStars);
    
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      offset: 50,
    });
    
    // Set visible after a short delay to trigger entrance animations
    setTimeout(() => {
      setVisible(true);
      AOS.refresh();
    }, 100);
  }, []);
  
  return (
    <div className={`min-h-screen bg-black text-white relative overflow-hidden transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated stars that fade in */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: star.width + "px",
            height: star.height + "px",
            top: star.top + "%",
            left: star.left + "%",
            opacity: visible ? star.opacity : 0,
            transition: `opacity 2s ease-in-out ${i % 5 * 0.1}s`,
          }}
        />
      ))}
      <section id="how-it-works" className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            How It Works
          </h2>
          <p 
            className="text-gray-400 text-center max-w-2xl mx-auto mb-16"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="1000"
          >
            SensorDash leverages a modern IoT stack to deliver real-time sensor data from your devices to your dashboard.
          </p>
          
          <div className="relative">
            {/* Timeline line with animation */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-purple-800/50"
              style={{
                height: visible ? '100%' : '0%',
                transition: 'height 2s ease-out 0.5s',
              }}
            ></div>
            
            {/* Timeline items */}
            {steps.map((step, index) => (
              <div key={index} className="relative mb-20 last:mb-0">
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Content */}
                  <div 
                    className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}
                    data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                    data-aos-delay={300 + (index * 200)}
                    data-aos-duration="1000"
                  >
                    <h3 className="text-xl font-bold text-purple-400 mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                  
                  {/* Icon with pulse animation */}
                  <div 
                    className="w-16 h-16 bg-gray-900 border-2 border-purple-600 rounded-full flex items-center justify-center z-10 shadow-lg shadow-purple-900/30"
                    data-aos="zoom-in"
                    data-aos-delay={500 + (index * 200)}
                    style={{
                      animation: visible ? `pulse 2s infinite ${1 + index * 0.5}s` : 'none',
                    }}
                  >
                    {step.icon === "microchip" && (
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h12v16H6V4zm10 2H8v12h8V6zM2 8h2v8H2V8zm18 0h2v8h-2V8zM8 8h8v8H8V8z" />
                      </svg>
                    )}
                    {step.icon === "network" && (
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 3a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5a2 2 0 012-2h4zm0 2h-4v4h4V5zM5 11a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4zm2 0v4h4v-4H7zM17 13a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4zm0 2h4v4h-4v-4z" />
                      </svg>
                    )}
                    {step.icon === "server" && (
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 3h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v2h14V5H5zm0 6h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2zm0 2v2h14v-2H5zm0 6h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2zm0 2v2h14v-2H5z" />
                      </svg>
                    )}
                    {step.icon === "dashboard" && (
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v10H3V3zm0 12h8v6H3v-6zm10-12h8v6h-8V3zm0 8h8v8h-8v-8z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Empty div for layout */}
                  <div className="w-1/2"></div>
                </div>
                
                {/* Connection animation */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-3 h-8"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: `opacity 1s ease-in-out ${1 + index * 0.5}s`,
                    }}
                  >
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse self-center"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse self-center" style={{ animationDelay: "0.5s" }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Technical details */}
          <div 
            className="mt-20 bg-gray-900/70 border border-gray-800 rounded-lg p-6 backdrop-blur-sm"
            data-aos="fade-up"
            data-aos-delay={500 + (steps.length * 200)}
            data-aos-duration="1200"
          >
            <h3 className="text-xl font-bold text-purple-400 mb-4">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div data-aos="fade-right" data-aos-delay={600 + (steps.length * 200)}>
                  <h4 className="font-semibold text-white mb-2">ESP Device Configuration</h4>
                  <p className="text-gray-300 text-sm">ESP devices are programmed with Arduino or ESP-IDF frameworks to connect to your WiFi network, read sensor data, and publish to MQTT topics at configurable intervals.</p>
                </div>
                <div data-aos="fade-right" data-aos-delay={700 + (steps.length * 200)}>
                  <h4 className="font-semibold text-white mb-2">MQTT Topics Structure</h4>
                  <p className="text-gray-300 text-sm">Data is published to topics like <code className="bg-gray-800 px-1 rounded text-purple-300">sensordash/devices/{`{device_id}`}/temperature</code> and <code className="bg-gray-800 px-1 rounded text-purple-300">sensordash/devices/{`{device_id}`}/humidity</code>.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div data-aos="fade-left" data-aos-delay={600 + (steps.length * 200)}>
                  <h4 className="font-semibold text-white mb-2">Backend Processing</h4>
                  <p className="text-gray-300 text-sm">The Node.js backend uses libraries like <code className="bg-gray-800 px-1 rounded text-purple-300">mqtt</code> to subscribe to topics and <code className="bg-gray-800 px-1 rounded text-purple-300">ws</code> for WebSocket connections. Data is timestamped and formatted before being sent to the frontend.</p>
                </div>
                <div data-aos="fade-left" data-aos-delay={700 + (steps.length * 200)}>
                  <h4 className="font-semibold text-white mb-2">Frontend WebSocket Connection</h4>
                  <p className="text-gray-300 text-sm">The React frontend establishes WebSocket connections to receive real-time updates, handling data parsing, state management, and rendering the dashboard components.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add these keyframes styles for the pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default HowItWorks