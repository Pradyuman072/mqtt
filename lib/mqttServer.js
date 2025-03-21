const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const WebSocket = require("ws");
const app = express();
app.use(cors());
const PORT = 5001;
const MQTT_BROKER = "mqtt://broker.emqx.io";
const MQTT_TOPIC = "emqx/esp8266/sensor";
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

// Create a data stack to store the last 5 entries
const MAX_STACK_SIZE = 5;
let dataStack = [];

// Create a unique client ID
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const mqttClient = mqtt.connect(MQTT_BROKER, {
  clientId: clientId,
  clean: true, // Clean session
  connectTimeout: 4000, // Connection timeout
  reconnectPeriod: 1000, // Reconnect period
});

// Handle successful connection
mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
    } else {
      console.error("MQTT Subscription Error:", err);
    }
  });
});

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("MQTT Connection Error:", err);
});

// Handle MQTT Messages
mqttClient.on("message", (topic, message) => {
  try {
    console.log(`Received message on ${topic}: ${message.toString()}`);
    
    // Create data object with timestamp
    const data = {
      timestamp: new Date().toISOString(),
      value: message.toString()
    };
    
    // Add new data to the beginning of the stack
    dataStack.unshift(data);
    
    // Keep only the latest 5 entries
    if (dataStack.length > MAX_STACK_SIZE) {
      dataStack = dataStack.slice(0, MAX_STACK_SIZE);
    }
    
    // Broadcast the entire stack to all WebSocket clients
    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(dataStack));
      }
    });
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

// WebSocket Connection for connecting the backend to the frontend
wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");
  clients.push(ws);
  
  // Send the current stack to the newly connected client
  if (dataStack.length > 0) {
    ws.send(JSON.stringify(dataStack));
  }
  
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("WebSocket client disconnected");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});