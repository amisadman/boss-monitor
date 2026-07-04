#define FAN1_PIN 16
#define FAN2_PIN 17
#define LIGHT1_PIN 18
#define LIGHT2_PIN 19
#define LIGHT3_PIN 21
#define CURRENT_SENSOR_PIN 34
#define UNUSED_ANALOG_PIN 35

const float MAINS_VOLTAGE = 220.0;

bool fan1 = false;
bool fan2 = false;
bool light1 = false;
bool light2 = false;
bool light3 = false;

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(UNUSED_ANALOG_PIN));

  pinMode(FAN1_PIN, OUTPUT);
  pinMode(FAN2_PIN, OUTPUT);
  pinMode(LIGHT1_PIN, OUTPUT);
  pinMode(LIGHT2_PIN, OUTPUT);
  pinMode(LIGHT3_PIN, OUTPUT);

  digitalWrite(FAN1_PIN, LOW);
  digitalWrite(FAN2_PIN, LOW);
  digitalWrite(LIGHT1_PIN, LOW);
  digitalWrite(LIGHT2_PIN, LOW);
  digitalWrite(LIGHT3_PIN, LOW);
}

void loop() {
  static unsigned long lastToggle = 0;

  if (millis() - lastToggle > 5000) {
    lastToggle = millis();

    fan1   = random(2);
    fan2   = random(2);
    light1 = random(2);
    light2 = random(2);
    light3 = random(2);

    digitalWrite(FAN1_PIN,   fan1   ? HIGH : LOW);
    digitalWrite(FAN2_PIN,   fan2   ? HIGH : LOW);
    digitalWrite(LIGHT1_PIN, light1 ? HIGH : LOW);
    digitalWrite(LIGHT2_PIN, light2 ? HIGH : LOW);
    digitalWrite(LIGHT3_PIN, light3 ? HIGH : LOW);

    int rawADC = analogRead(CURRENT_SENSOR_PIN);
    float sensorVoltage = (rawADC / 4095.0) * 3.3;
    float currentAmps = abs(sensorVoltage - 1.65) / 0.185;
    float totalPowerWatts = currentAmps * MAINS_VOLTAGE;

    char json[512];
    snprintf(json, sizeof(json),
      "{\n"
      "  \"room\": \"DrawingRoom\",\n"
      "  \"devices\": [\n"
      "    { \"deviceId\": \"drawing-fan-1\",   \"status\": \"%s\" },\n"
      "    { \"deviceId\": \"drawing-fan-2\",   \"status\": \"%s\" },\n"
      "    { \"deviceId\": \"drawing-light-1\", \"status\": \"%s\" },\n"
      "    { \"deviceId\": \"drawing-light-2\", \"status\": \"%s\" },\n"
      "    { \"deviceId\": \"drawing-light-3\", \"status\": \"%s\" }\n"
      "  ],\n"
      "  \"currentAmps\": %.2f,\n"
      "  \"totalWatts\": %.2f\n"
      "}",
      fan1   ? "on" : "off",
      fan2   ? "on" : "off",
      light1 ? "on" : "off",
      light2 ? "on" : "off",
      light3 ? "on" : "off",
      currentAmps,
      totalPowerWatts
    );

    Serial.println(json);
  }

  delay(1000);
}
