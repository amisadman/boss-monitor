#define FAN1_PIN 16
#define FAN2_PIN 17
#define LIGHT1_PIN 18
#define LIGHT2_PIN 19
#define LIGHT3_PIN 21
#define CURRENT_SENSOR_PIN 34
#define UNUSED_ANALOG_PIN 35

const float MAINS_VOLTAGE = 220.0;

void setup() {
  Serial.begin(115200);
  Serial.println("--- Boss Monitor ESP32 Room Controller Started ---");

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

    bool fan1 = random(2);
    bool fan2 = random(2);
    bool light1 = random(2);
    bool light2 = random(2);
    bool light3 = random(2);

    digitalWrite(FAN1_PIN, fan1 ? HIGH : LOW);
    digitalWrite(FAN2_PIN, fan2 ? HIGH : LOW);
    digitalWrite(LIGHT1_PIN, light1 ? HIGH : LOW);
    digitalWrite(LIGHT2_PIN, light2 ? HIGH : LOW);
    digitalWrite(LIGHT3_PIN, light3 ? HIGH : LOW);

    Serial.println("\n[Action] Device States Randomized:");
    Serial.printf(" - Fan 1: %s | Fan 2: %s\n", fan1 ? "ON" : "OFF", fan2 ? "ON" : "OFF");
    Serial.printf(" - Light 1: %s | Light 2: %s | Light 3: %s\n", 
                  light1 ? "ON" : "OFF", light2 ? "ON" : "OFF", light3 ? "ON" : "OFF");
  }

  int rawADC = analogRead(CURRENT_SENSOR_PIN);
  
  float sensorVoltage = (rawADC / 4095.0) * 3.3;
  
  float currentAmps = (sensorVoltage - 1.65) / 0.185;
  if (currentAmps < 0) currentAmps = 0;
  
  float totalPowerWatts = currentAmps * MAINS_VOLTAGE;

  Serial.print("Sensor Voltage: ");
  Serial.print(sensorVoltage);
  Serial.print("V | Current: ");
  Serial.print(currentAmps);
  Serial.print("A | Total Room Power Draw: ");
  Serial.print(totalPowerWatts);
  Serial.println("W");

  delay(1000);
}
