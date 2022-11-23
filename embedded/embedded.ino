#include <ArduinoHttpClient.h>
#include <Adafruit_ESP8266.h>
#include "DHTesp.h"      // Click here to get the library: http://librarymanager/All#DHTesp
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <ArduinoJson.h>

DHTesp dht;

const char *ssid = "asdf";
const char *password = "asdf";
const char *host = "http://192.168.1.55";
const char *path = "data";
const uint16_t port = 8085;

int temperature;     // C * 100
int humidity;        // % * 100
int setPoint = 1278; // C * 100 (55 F)
boolean heat = false;
boolean heating = false;

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
    HttpClient http = HttpClient(client, host, port);
    http.beginRequest();
    sendData(http);
    readData(http);
  }
}

void sendData(HttpClient http)
{
  StaticJsonDocument<200> doc;
  doc["temp"] = temperature;
  doc["hum"] = humidity;
  doc["heating"] = heating;
  doc["setpt"] = setPoint;

  String json;
  serializeJson(doc, json);

  //  http.POST(json);
  http.post(path);
  http.beginBody();
  http.print(json);
  http.endRequest();
}

void readData(HttpClient http)
{
  // Read all the lines of the reply from server and print them to Serial
  Serial.println("receiving from remote server");
  String res = http.responseBody();

  StaticJsonDocument<200> doc;
  deserializeJson(doc, res);
}
