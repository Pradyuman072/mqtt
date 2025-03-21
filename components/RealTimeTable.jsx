"use client"
import { useEffect, useState } from "react"
import AOS from 'aos'

const RealTimeTable = () => {
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
  }

  return (
    <div className="p-4" data-aos="fade-up" data-aos-delay="400">
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
        <table className="min-w-full  bg-gray-800/50 border border-gray-700 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700/50 text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Timestamp</th>
              {hasSensorData(sensorData[0] || {}) ? (
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
  )
}

export default RealTimeTable