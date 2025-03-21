import Dashboard from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Header */}
     

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mb-4 text-center">
          Real-Time Sensor <span className="text-purple-500">Dashboard</span>
        </h1>
        <p className="text-gray-400 max-w-xl mb-12 text-center">
          Monitor your IoT sensors in real-time with our advanced dashboard. Get instant updates and visualize your
          data.
        </p>

        <Dashboard />
      </main>

      {/* AI Assistant Bot */}
      <div className="fixed bottom-8 right-8 z-20">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-10 h-10 bg-purple-800 rounded-md flex items-center justify-center">
            <div className="w-6 h-3 bg-purple-400 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

