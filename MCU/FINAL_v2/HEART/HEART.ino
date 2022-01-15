// firebase and ntp
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// max30100
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

PulseOximeter pox;
void onBeatDetected()
{
  Serial.println("Beat!");
}

// firebase
// wifi 2.4GHz credentials
#define WIFI_SSID "CBVSV_plus"
#define WIFI_PASSWORD "aaaaaaaa"
#define FIREBASE_HOST "healthactivity-monitor-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "JYPsMcKNyHCWWQmZKgclbMdLWPbt8uRSwLJIj4Uf"
FirebaseData fbdo;

// ntp
const long utcOffsetInSeconds = 28800;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);
String formatted_date;
String date_final;
String time_final;

unsigned long rst_1 = 0;
const unsigned long in_1 = 1000;

// variables
int heartrate;
String devid = "1";
String devid_num = "d01";

int f = 0;

void setup()
{
  Serial.begin(115200);
  timeClient.begin();
  Wire.begin(D2, D1);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  delay(500);

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Serial.print("Initializing pulse oximeter");
  if (!pox.begin())
  {
    Serial.println("FAILED");
    for (;;)
      ;
  }
  else
  {
    Serial.println("SUCCESS");
  }
  pox.setOnBeatDetectedCallback(onBeatDetected);
}

void get_date_and_time()
{
  while (!timeClient.update())
  {
    timeClient.forceUpdate();
  }

  formatted_date = timeClient.getFormattedDate();
  int splitT = formatted_date.indexOf("T");
  date_final = formatted_date.substring(0, splitT);
  Serial.print(" DATE : ");
  Serial.println(date_final);
  time_final = formatted_date.substring(splitT + 1, formatted_date.length() - 1);
  Serial.print(" TIME : ");
  Serial.println(time_final);
}

void send_data()
{
  Firebase.set(fbdo, "/latest/date_1", date_final);
  Firebase.set(fbdo, "/latest/time_1" , time_final);
  Firebase.set(fbdo, "/latest/heart_1", heartrate);

  Firebase.push(fbdo, devid + "/", "keyActive");
  String pushKey = fbdo.pushName();
  Firebase.set(fbdo, "/data/" + pushKey + "/date", date_final);
  Firebase.set(fbdo, "/data/" + pushKey + "/time", time_final);
  Firebase.set(fbdo, "/data/" + pushKey + "/heart", heartrate);
  Firebase.set(fbdo, "/data/" + pushKey + "/id", devid_num);

  Firebase.set(fbdo, "_keys/1", pushKey);
  delay(1000);
  Firebase.set(fbdo, "tempreq", 1);
  Serial.println(" [ DATA SENT ] ");
  delay(1000);
  ESP.restart();
}

void loop()
{
  int heartrate_s;
  pox.update();
  if (((millis() - rst_1) > in_1))
  {
    f = f + 1;
    if (f > 20) {
      if (heartrate != 0) {
        get_date_and_time();
        send_data();
      } else {
        f = 0;
      }
    } else {
      heartrate_s = pox.getHeartRate();
      if ( heartrate_s > 58 && heartrate_s < 150) {
        Serial.print("Heart rate:");
        Serial.print(pox.getHeartRate());
        heartrate = pox.getHeartRate();
        Serial.print("bpm / SpO2:");
        Serial.print(pox.getSpO2());
        Serial.println("%");
      }
    }
    rst_1 = millis();
  }
}
