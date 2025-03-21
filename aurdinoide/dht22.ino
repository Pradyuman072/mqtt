#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// WiFi settings
const char *ssid = "Mohit";  // WiFi name
const char *password = "Mohit220044"; //password

// MQTT Broker settings
const char *mqtt_broker = "broker.emqx.io"; // EMQX broker endpoint
const char *mqtt_topic = "emqx/esp8266/led"; // MQTT topic
const char *mqtt_topic_sensor = "emqx/esp8266/sensor"; // Single topic for all sensor data
const char *mqtt_username = "emqx"; // MQTT username for authentication
const char *mqtt_password = "public"; // MQTT password for authentication
const int mqtt_port = 1883; // MQTT port (TCP)

// DHT22 sensor settings
#define DHTPIN D4     // Pin connected to the DHT22 sensor (change if needed)
#define DHTTYPE DHT22 // DHT22 sensor type
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient mqtt_client(espClient);

unsigned long lastMsg = 0;
const long interval = 5000; // Send sensor data every 5 seconds

void connectToWiFi();
void connectToMQTTBroker();
void mqttCallback(char *topic, byte *payload, unsigned int length);
void readAndPublishSensorData();

void setup() {
    Serial.begin(115200);
    dht.begin(); // Initialize DHT sensor
    connectToWiFi();
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setCallback(mqttCallback);
    connectToMQTTBroker();
}

void connectToWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to the WiFi network");
}

void connectToMQTTBroker() {
    while (!mqtt_client.connected()) {
        String client_id = "esp8266-client-" + String(WiFi.macAddress());
        Serial.printf("Connecting to MQTT Broker as %s.....\n", client_id.c_str());
        if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Connected to MQTT broker");
            mqtt_client.subscribe(mqtt_topic);
            // Publish message upon successful connection
            mqtt_client.publish(mqtt_topic, "Hi EMQX I'm ESP8266 with DHT22 sensor");
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message received on topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    for (unsigned int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
    }
    Serial.println();
    Serial.println("-----------------------");
}

void readAndPublishSensorData() {
    // Read temperature and humidity
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    // Check if any reads failed
    if (isnan(humidity) || isnan(temperature)) {
        Serial.println("Failed to read from DHT22 sensor!");
        return;
    }

    // Create JSON document
    StaticJsonDocument<128> doc;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["team"] = "TEAM OJAS";
    
    // Serialize JSON to string
    char jsonBuffer[128];
    serializeJson(doc, jsonBuffer);
    
    // Print to serial monitor
    Serial.print("Sensor data: ");
    Serial.println(jsonBuffer);
    
    // Publish to MQTT
    mqtt_client.publish(mqtt_topic_sensor, jsonBuffer);
}

void loop() {
    if (!mqtt_client.connected()) {
        connectToMQTTBroker();
    }
    mqtt_client.loop();
    
    unsigned long now = millis();
    if (now - lastMsg > interval) {
        lastMsg = now;
        readAndPublishSensorData();
    }
}
