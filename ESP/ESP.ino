#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ====== CONFIG ======
const char* WIFI_SSID = "MIX&MIN_2.4GHz";
const char* WIFI_PASS = "0957530900";

String BASE_URL = "http://192.168.1.34:3000"; // เปลี่ยนเป็น IP backend ของคุณ

// ปุ่มน้ำ (ตอนนี้เราจะ treat มันเป็นปุ่มธรรมดา D5 <-> GND)
const int PIN_USE_BUTTON   = D5;
// ปุ่มรีเซ็ตแทงเข้า reset water (D6 <-> GND) -- ยังไม่ต้องต่อก็ได้
const int PIN_RESET_BUTTON = 0;

// ml ต่อ tick
const int USED_ML_PER_TICK = 50;

// ยิง update ทุกกี่ ms ระหว่างกดค้าง
const unsigned long FLOW_INTERVAL_MS = 200;

// LCD poll interval
const unsigned long POLL_INTERVAL = 1000;

LiquidCrystal_I2C lcd(0x27, 16, 2);

// ----- state -----
unsigned long lastPoll = 0;
unsigned long lastFlowSend = 0;

bool flowActive = false;        // ตอนนี้ถือว่า "กำลังไหลน้ำ" อยู่ไหม
bool prevUsePressed = false;    // สถานะปุ่มน้ำรอบก่อน
bool prevResetPressed = false;  // สถานะปุ่ม reset รอบก่อน

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void setup() {
  // IMPORTANT:
  // ดึงขึ้นไว้ภายใน -> ยังไม่ต่ออะไร ขาจะอยู่ HIGH เสมอ -> ถือว่า "ไม่กด"
  pinMode(PIN_USE_BUTTON, INPUT_PULLUP);

  // ปุ่มรีเซ็ตก็เหมือนกัน ใช้ปุ่ม 2 ขา D6 <-> GND
  pinMode(PIN_RESET_BUTTON, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();

  setupWiFi();

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Booting...");
}

void loop() {
  unsigned long now = millis();

  // 1) อัปเดตจอทุก 1 วิ
  if (now - lastPoll >= POLL_INTERVAL) {
    lastPoll = now;
    pollStatusAndUpdateLCD();
  }

  // 2) อ่านปุ่มน้ำ
  // ตอนนี้ logic คือ:
  //   กดปุ่มจริง = ขา D5 ลง GND = digitalRead(D5) == LOW
  //   ยังไม่กด = digitalRead(D5) == HIGH
  bool isUsePressed = (digitalRead(PIN_USE_BUTTON) == HIGH);

  // transition: เริ่มกด -> เริ่ม "เปิดน้ำ"
  if (isUsePressed && !prevUsePressed) {
    flowActive = true;
    lastFlowSend = now; // เริ่มจับเวลา tick
  }

  // transition: ปล่อยปุ่ม -> หยุดน้ำ
  if (!isUsePressed && prevUsePressed) {
    flowActive = false;
  }

  prevUsePressed = isUsePressed;

  // ถ้ากำลังไหล -> ยิง /api/device/update เป็น interval
  if (flowActive) {
    if (now - lastFlowSend >= FLOW_INTERVAL_MS) {
      lastFlowSend = now;
      sendUsage();
    }
  }

  // 3) ปุ่ม reset
  bool isResetPressed = (digitalRead(PIN_RESET_BUTTON) == LOW);
  if (isResetPressed && !prevResetPressed) {
    sendReset();
  }
  prevResetPressed = isResetPressed;

  delay(10);
}

// ===================== helpers =====================

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
