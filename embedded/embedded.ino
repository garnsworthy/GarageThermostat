#include "DHTesp.h" // Click here to get the library: http://librarymanager/All#DHTesp
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ArduinoHttpClient.h>

DHTesp dht;

const char *ssid = "ufo";
const char *password = "1234asdf";
const char *host = "192.168.1.36";
// const char *host = "192.168.1.7";
const char *path = "/data";
const uint16_t port = 8085;
const int deadband = 2;
const int HEATING = D1;

int temperature;     // C * 100
int humidity;        // % * 100
int setPoint = 1278; // C * 100 (55 F)
boolean heat = false;
boolean heating = false;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, host, port);

void setup()
{
  Serial.begin(9600);
  pinMode(HEATING, OUTPUT);
  WiFi.mode(WIFI_STA);
  // WiFiManager wm;
  // bool res = wm.autoConnect("AutoConnectAP", "password"); // password protected ap
  // WORKS IF YOU USE THIS CODE BLOCK INSTEAD
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }
  // if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  dht.setup(D2, DHTesp::DHT22);
}

long lastRead = 0;

void loop()
{
  delay(dht.getMinimumSamplingPeriod());
  humidity = int(dht.getHumidity() * 100);
  temperature = int(dht.getTemperature() * 100);

  if(temperature > setPoint + deadband) {
    heating = false;
  } else if(temperature < setPoint - deadband) {
    heating = true;
  }

Serial.println(heat);
Serial.println(heating);
  if(heat && heating) {
    digitalWrite(HEATING, HIGH);
  } else {
    digitalWrite(HEATING, LOW);
  }

  if ((millis() - lastRead) > 15 * 1000)
  {
    if (!wifi.connect(host, port))
    {
      Serial.println("Connect Failed");
      return;
    }
    sendData(wifi);
    readData(wifi);
    lastRead = millis();
  }
}

void sendData(WiFiClient wifi)
{
  StaticJsonDocument<200> doc;
  doc["temp"] = temperature;
  doc["hum"] = humidity;
  doc["heating"] = heating;
  doc["setpt"] = setPoint;

  String json;
  serializeJson(doc, json);
  client.post("/data", "application/json", json);
}

void readData(WiFiClient wifi)
{
  // Read all the lines of the reply from server and print them to Serial
  Serial.println("receiving from remote server");

  // read the status code and body of the response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  Serial.println(response);

  StaticJsonDocument<200> doc;
  deserializeJson(doc, response);
  setPoint = doc["setpoint"];
  heat = doc["heat"];
}
