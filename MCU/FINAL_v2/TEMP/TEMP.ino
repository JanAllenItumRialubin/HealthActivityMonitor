// firebase and ntp
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// temperature
#include <Adafruit_MLX90614.h>
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// gps
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
static const int RXPin = D4, TXPin = D3;
static const uint32_t GPSBaud = 9600;
TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);
String gps_loc;

// firebase
// wifi 2.4GHz credentials
#define WIFI_SSID "CBVSV_plus"
#define WIFI_PASSWORD "aaaaaaaa"
#define FIREBASE_HOST "healthactivity-monitor-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "JYPsMcKNyHCWWQmZKgclbMdLWPbt8uRSwLJIj4Uf"
FirebaseData fbdo;

unsigned long rst_1 = 0;
const unsigned long in_1 = 10000;

float temp;

String devid = "1";
String devid_num = "d01";
int f = 0;

String pushKey;
int tempreq = 0;

String s_lat;
String s_lng;
float f_lat;
float f_lng;

void setup()
{
  Serial.begin(115200);
  ss.begin(GPSBaud);
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
  Serial.println("Initializing MLX90614");
  if (!mlx.begin())
  {
    Serial.println("Error connecting to MLX sensor. Check wiring.");
    while (1)
      ;
  };
  Serial.print("Emissivity = ");
  Serial.println(mlx.readEmissivity());
  Serial.println("================================================");
}


void send_data()
{
  if (Firebase.getString(fbdo, "/_keys/1"))
  {
    pushKey = fbdo.stringData();
  }
  pushKey = pushKey.remove(1, 1);
  pushKey = pushKey.remove(strlen(pushKey), -1);
  Firebase.set(fbdo, "/latest/loc_1", gps_loc);
  Firebase.set(fbdo, "/latest/temp_1", temp);
  Firebase.set(fbdo, "/data/" + pushKey + "/loc", gps_loc);
  Firebase.set(fbdo, "/data/" + pushKey + "/temp", temp);
  Firebase.setInt(fbdo, "/tempreq/", 0);
  Serial.println(" [ DATA SENT ] ");
  ESP.restart();
}

void loop() {
  float temp_s;
  if (Firebase.getInt(fbdo, "/tempreq/"))
  {
    tempreq = fbdo.intData();
  }

  if (tempreq == 1) {
    while (true) {
      temp_s = mlx.readObjectTempC();
      if (temp > 60) {
        ;
      } else {
        for (int i = 0; i < 20; i++) {
          temp = mlx.readObjectTempC();
          Serial.print(" Temperature : ");
          Serial.print(temp);
          Serial.println(" *C");
          if (i > 10) {
            send_data();
            break;
          }
        }
      }
    }
  }


  while (ss.available() > 0) {
    if (gps.encode(ss.read())) {
      Serial.print(" Location : ");
      if (gps.location.isValid()) {
        f = f + 1;

        f_lat = gps.location.lat();
        f_lng = gps.location.lng();
        s_lat = String(f_lat, 6);
        s_lng = String(f_lng, 6);
        gps_loc = s_lat + "," + s_lng;
        Serial.println(gps_loc);
      } else {
        Serial.println(" INVALID");
      }
    }
  }

  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(" No GPS detected: check wiring.");
    while (true);
  }
}
