#include "DHTesp.h" // Click here to get the library: http://librarymanager/All#DHTesp
#include <ESP8266WiFi.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager

DHTesp dht;

const char *ssid = "asdf";
const char *password = "asdf";
const char *host = "192.168.1.55";
const uint16_t port = 8085;

int temperature;     // C * 100
int humidity;        // % * 100
int setPoint = 1278; // C * 100 (55 F)
boolean heat = false;

void setup()
{
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFiManager wm;
  bool res = wm.autoConnect("AutoConnectAP", "password"); // password protected ap
  if (!res)
  {
    Serial.println("Failed to connect");
    // ESP.restart();
  }
  else
  {
    // if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");
  }
  // WiFi.mode(WIFI_STA);
  // WiFi.begin(ssid, password);
  // while (WiFi.status() != WL_CONNECTED)
  // {
  //   delay(500);
  //   Serial.print(".");
  // }
  // Serial.println("");
  // Serial.println("WiFi connected");
  // Serial.println("IP address: ");
  // Serial.println(WiFi.localIP());

  dht.setup(D1, DHTesp::DHT22); // Connect DHT sensor to GPIO 17
}

long lastRead = 0;

void loop()
{
  delay(dht.getMinimumSamplingPeriod());
  humidity = dht.getHumidity() * 100;
  temperature = dht.getTemperature() * 100;

  if ((millis() - lastRead) > 60 * 1000)
  { // once a minute for now.
    // Use WiFiClient class to create TCP connections
    WiFiClient client;
    if (!client.connect(host, port))
    {
      Serial.println("connection failed");
      delay(5000);
      return;
    }

    // This will send a string to the server
    Serial.println("sending data to server");
    sendData(client);
    readData(client);
    // Close the connection
    Serial.println();
    Serial.println("closing connection");
    client.stop();
  }
}

void sendData(WiFiClient client)
{
  if (client.connected())
  {
    client.print("{temp:");
    client.print(temperature);
    client.print(",");
    client.print("hum:");
    client.print(humidity);
    client.print(",");
    client.print("stpt:");
    client.print(setPoint);
    client.print(",");
    client.print("heat:");
    client.print(heat);
    client.println("}");
  }
}

void readData(WiFiClient client)
{
  // wait for data to be available
  unsigned long timeout = millis();
  while (client.available() == 0)
  {
    if (millis() - timeout > 5000)
    {
      Serial.println(">>> Client Timeout !");
      client.stop();
      delay(60000);
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  Serial.println("receiving from remote server");
  // not testing 'client.connected()' since we do not need to send data here
  while (client.available())
  {
    char ch = static_cast<char>(client.read());
    Serial.print(ch);
  }
}
