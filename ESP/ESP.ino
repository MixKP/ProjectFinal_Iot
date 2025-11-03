#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ====== CONFIG ======
const char* WIFI_SSID = "Mix";
const char* WIFI_PASS = "mixer34324";

String BASE_URL = "http://172.20.10.2:3000";

const int PIN_USE_BUTTON   = D5;
const int PIN_RESET_BUTTON = 0;

const int USED_ML_PER_TICK = 50;

const unsigned long FLOW_INTERVAL_MS = 200;

const unsigned long POLL_INTERVAL = 1000;

LiquidCrystal_I2C lcd(0x27, 16, 2);

unsigned long lastPoll = 0;
unsigned long lastFlowSend = 0;

bool flowActive = false;
bool prevUsePressed = false;
bool prevResetPressed = false;

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void setup() {
  pinMode(PIN_USE_BUTTON, INPUT_PULLUP);
  pinMode(PIN_RESET_BUTTON, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();

  setupWiFi();

  lcd.clear();
  lcd.setCursor(0,0);
}

void loop() {
  unsigned long now = millis();

  if (now - lastPoll >= POLL_INTERVAL) {
    lastPoll = now;
    pollStatusAndUpdateLCD();
  }

  bool isUsePressed = (digitalRead(PIN_USE_BUTTON) == HIGH);

  if (isUsePressed && !prevUsePressed) {
    flowActive = true;
    lastFlowSend = now;
  }

  if (!isUsePressed && prevUsePressed) {
    flowActive = false;
  }

  prevUsePressed = isUsePressed;

  if (flowActive) {
    if (now - lastFlowSend >= FLOW_INTERVAL_MS) {
      lastFlowSend = now;
      sendUsage();
    }
  }

  bool isResetPressed = (digitalRead(PIN_RESET_BUTTON) == LOW);
  if (isResetPressed && !prevResetPressed) {
    sendReset();
  }
  prevResetPressed = isResetPressed;

  delay(10);
}

void pollStatusAndUpdateLCD() {
  if (WiFi.status() != WL_CONNECTED) {
    setupWiFi();
  }

  HTTPClient http;
  WiFiClient client;

  String url = BASE_URL + "/api/iot/status";
  http.begin(client, url);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    StaticJsonDocument<256> doc;
    DeserializationError err = deserializeJson(doc, payload);
    if (!err) {
      bool needLogin = doc["needLogin"] | true;
      const char* line1 = doc["line1"] | "Authentication";
      const char* line2 = doc["line2"] | "Please login...";

      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print(line1);

      lcd.setCursor(0,1);
      if (needLogin) {
        lcd.print("Please Login...");
      } else {
        lcd.print(line2);
      }
    }
  }

  http.end();
}

void sendUsage() {
  if (WiFi.status() != WL_CONNECTED) {
    setupWiFi();
  }

  HTTPClient http;
  WiFiClient client;

  String url = BASE_URL + "/api/device/update";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<128> body;
  body["usedMlPerTick"] = USED_ML_PER_TICK;

  String jsonStr;
  serializeJson(body, jsonStr);

  http.POST(jsonStr);
  http.end();
}

void sendReset() {
  if (WiFi.status() != WL_CONNECTED) {
    setupWiFi();
  }

  HTTPClient http;
  WiFiClient client;

  String url = BASE_URL + "/api/device/reset";
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  http.POST("{}");
  http.end();
}
