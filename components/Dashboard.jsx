"use client"

import RealTimeTable from "./RealTimeTable"

const Dashboard = () => {
  return (
    <div className="w-full max-w-3xl">
      <div 
        className="bg-gray-900 border border-gray-800 shadow-xl rounded-lg p-6 backdrop-blur-sm bg-opacity-80"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 
          className="text-2xl font-bold text-center mb-6 text-white"
          data-aos="fade-down"
          data-aos-delay="200"
        >
          Sensor Dashboard
        </h2>
        <RealTimeTable />
      </div>
    </div>
  )
}

export default Dashboard