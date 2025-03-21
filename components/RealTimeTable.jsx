"use client"
import { useEffect, useState } from "react"
import AOS from 'aos'

// Combined component that handles both the table and gauges
const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")

  useEffect(() => {
    let ws

    try {
      ws = new WebSocket("ws://localhost:8080") // Connect to WebSocket server

      ws.onopen = () => {
        setConnectionStatus("Connected")
      }

      ws.onclose = () => {
        setConnectionStatus("Disconnected")
      }

      ws.onerror = () => {
        setConnectionStatus("Connection Error")
      }

      ws.onmessage = (event) => {
        const dataString = event.data // Data arrives as string format

        // Try to parse as JSON
        try {
          const data = JSON.parse(dataString)
          
          // Check if data is an array (our stack from the backend)
          if (Array.isArray(data)) {
            setSensorData(data.map(item => {
              // Try to parse the value if it's a JSON string
              try {
                const parsedValue = JSON.parse(item.value);
                return {
                  timestamp: item.timestamp,
                  ...parsedValue
                };
              } catch (e) {
                // If parsing fails, just use the original value
                return {
                  timestamp: item.timestamp,
                  value: item.value
                };
              }
            }));
            
            // Refresh AOS when new data arrives
            setTimeout(() => AOS.refresh(), 100);
          }
        } catch (e) {
          console.error("Error parsing WebSocket data:", e);
        }
      }
    } catch (error) {
      setConnectionStatus("Connection Failed")
    }

    return () => {
      if (ws) ws.close() // Clean up on unmount
    }
  }, [])

  // Function to determine if we have sensor data or plain message data
  const hasSensorData = (data) => {
    return data.temperature !== undefined && data.humidity !== undefined;
  }

  // Get the latest readings for the gauges
  const latestReading = sensorData.length > 0 && hasSensorData(sensorData[0]) 
    ? sensorData[0] 
    : { temperature: 0, humidity: 0 };

  return (
    <div className="space-y-8">
      {/* Sensor Gauges Section */}
      <HorizontalGauges 
        temperature={latestReading.temperature} 
        humidity={latestReading.humidity}
        connectionStatus={connectionStatus}
      />
      
      {/* Real-Time Table Section */}
      <RealTimeTable 
        sensorData={sensorData}
        connectionStatus={connectionStatus}
        hasSensorData={hasSensorData}
      />
    </div>
  )
}

// Horizontal Gauges Component
const HorizontalGauges = ({ temperature = 0, humidity = 0, connectionStatus }) => {
  // Temperature and humidity ranges
  const tempConfig = {
    min: 24,
    max: 45,
    warningThreshold: 30,
    coldThreshold: 10,
    unit: "°C"
  };

  const humidityConfig = {
    min: 0,
    max: 200,
    highThreshold: 70,
    lowThreshold: 30,
    unit: "%"
  };

  // Calculate percentage for gauge width
  const calculatePercentage = (value, min, max) => {
    // Clamp value between min and max
    const clampedValue = Math.min(Math.max(value, min), max);
    // Convert to percentage
    return ((clampedValue - min) / (max - min)) * 100;
  };

  const tempPercentage = calculatePercentage(temperature, tempConfig.min, tempConfig.max);
  const humidityPercentage = calculatePercentage(humidity, humidityConfig.min, humidityConfig.max);

  // Get color for temperature
  const getTempColor = (value) => {
    if (value > tempConfig.warningThreshold) return "bg-red-400";
    if (value < tempConfig.coldThreshold) return "bg-blue-400";
    return "bg-green-400";
  };

  // Get text color for temperature
  const getTempTextColor = (value) => {
    if (value > tempConfig.warningThreshold) return "text-red-400";
    if (value < tempConfig.coldThreshold) return "text-blue-400";
    return "text-green-400";
  };

  // Get color for humidity
  const getHumidityColor = (value) => {
    if (value > humidityConfig.highThreshold) return "bg-blue-400";
    if (value < humidityConfig.lowThreshold) return "bg-yellow-400";
    return "bg-green-400";
  };

  // Get text color for humidity
  const getHumidityTextColor = (value) => {
    if (value > humidityConfig.highThreshold) return "text-blue-400";
    if (value < humidityConfig.lowThreshold) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg" data-aos="fade-up" data-aos-delay="200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white" data-aos="fade-right">
          Sensor Gauges
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === "Connected"
              ? "bg-green-500/20 text-green-400"
              : connectionStatus === "Connecting..."
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
          data-aos="fade-left"
        >
          {connectionStatus}
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Temperature Gauge */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4" data-aos="fade-up" data-aos-delay="400">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-300 text-lg">Temperature</h3>
            <p className={`text-xl font-bold ${getTempTextColor(temperature)}`}>
              {typeof temperature === 'number' ? temperature.toFixed(1) : '0.0'}{tempConfig.unit}
            </p>
          </div>
          
          {/* Gauge container */}
          <div className="mt-2">
            {/* Gauge background */}
            <div className="w-full h-8 bg-gray-700/50 rounded-lg overflow-hidden">
              {/* Temperature gradient background */}
              <div className="w-full h-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 opacity-30"></div>
            </div>
            
            {/* Active gauge */}
            <div className="relative mt-1">
              {/* Marker line */}
              <div 
                className={`absolute top-0 h-10 w-1 ${getTempColor(temperature)} rounded-full -mt-1`}
                style={{ 
                  left: `${tempPercentage}%`,
                  transform: 'translateX(-50%)',
                  transition: "left 0.5s ease-out"
                }}
              ></div>
              
              {/* Tick marks */}
              <div className="flex justify-between w-full relative">
                {[0, 10, 20, 30, 40].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <div className="h-3 w-px bg-gray-400"></div>
                    <span className="text-xs text-gray-300 mt-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Range indicators */}
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>Cold</span>
              <span>Normal</span>
              <span>Hot</span>
            </div>
          </div>
        </div>
        
        {/* Humidity Gauge */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4" data-aos="fade-up" data-aos-delay="600">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-300 text-lg">Humidity</h3>
            <p className={`text-xl font-bold ${getHumidityTextColor(humidity)}`}>
              {typeof humidity === 'number' ? humidity.toFixed(1) : '0.0'}{humidityConfig.unit}
            </p>
          </div>
          
          {/* Gauge container */}
          <div className="mt-2">
            {/* Gauge background */}
            <div className="w-full h-8 bg-gray-700/50 rounded-lg overflow-hidden">
              {/* Humidity gradient background */}
              <div className="w-full h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 opacity-30"></div>
            </div>
            
            {/* Active gauge */}
            <div className="relative mt-1">
              {/* Marker line */}
              <div 
                className={`absolute top-0 h-10 w-1 ${getHumidityColor(humidity)} rounded-full -mt-1`}
                style={{ 
                  left: `${humidityPercentage}%`,
                  transform: 'translateX(-50%)',
                  transition: "left 0.5s ease-out"
                }}
              ></div>
              
              {/* Tick marks */}
              <div className="flex justify-between w-full relative">
                {[0, 25, 50, 75, 100].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <div className="h-3 w-px bg-gray-400"></div>
                    <span className="text-xs text-gray-300 mt-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Range indicators */}
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>Dry</span>
              <span>Normal</span>
              <span>Humid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Real-Time Table Component (based on your original)
const RealTimeTable = ({ sensorData = [], connectionStatus = "Disconnected", hasSensorData }) => {
  // Render appropriate table based on data type
  const renderTableContent = () => {
    if (sensorData.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="py-6 px-6 text-center text-gray-500">
            Waiting for sensor data...
          </td>
        </tr>
      );
    }

    // If first item has temperature/humidity, render sensor data table
    if (hasSensorData(sensorData[0])) {
      return sensorData.map((data, index) => (
        <tr 
          key={index} 
          className="border-b border-gray-700 hover:bg-gray-700/30"
          data-aos="fade-up"
          data-aos-delay={100 * (index % 5)}
        >
          <td className="py-3 px-6">{data.timestamp}</td>
          <td className="py-3 px-6">
            <span
              className={
                data.temperature > 30
                  ? "text-red-400"
                  : data.temperature < 10
                    ? "text-blue-400"
                    : "text-green-400"
              }
            >
              {data.temperature}
            </span>
          </td>
          <td className="py-3 px-6">
            <span
              className={
                data.humidity > 70
                  ? "text-blue-400"
                  : data.humidity < 30
                    ? "text-yellow-400"
                    : "text-green-400"
              }
            >
              {data.humidity}
            </span>
          </td>
        </tr>
      ));
    } else {
      // Render generic data table
      return sensorData.map((data, index) => (
        <tr 
          key={index} 
          className="border-b border-gray-700 hover:bg-gray-700/30"
          data-aos="fade-up"
          data-aos-delay={100 * (index % 5)}
        >
          <td className="py-3 px-6">{data.timestamp}</td>
          <td className="py-3 px-6 text-gray-300" colSpan={2}>
            {data.value || 'N/A'}
          </td>
        </tr>
      ));
    }
  };

  return (
    <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg" data-aos="fade-up" data-aos-delay="400">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white" data-aos="fade-right">
          Real-Time Data (Latest 5 Entries)
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === "Connected"
              ? "bg-green-500/20 text-green-400"
              : connectionStatus === "Connecting..."
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
          }`}
          data-aos="fade-left"
        >
          {connectionStatus}
        </div>
      </div>

      <div className="overflow-x-auto" data-aos="fade-up" data-aos-delay="600">
        <table className="min-w-full bg-gray-800/50 border border-gray-700 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700/50 text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Timestamp</th>
              {sensorData.length > 0 && hasSensorData(sensorData[0]) ? (
                <>
                  <th className="py-3 px-6 text-left">Temperature (°C)</th>
                  <th className="py-3 px-6 text-left">Humidity (%)</th>
                </>
              ) : (
                <th className="py-3 px-6 text-left">Value</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-300 text-sm">
            {renderTableContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorDashboard;