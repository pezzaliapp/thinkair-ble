#include "Arduino_BHY2.h"

Sensor temperature(SENSOR_ID_TEMP);
Sensor humidity(SENSOR_ID_HUM);
Sensor pressure(SENSOR_ID_BARO);
Sensor gasRes(SENSOR_ID_GAS);

float offset = -4.5;

void setup() {
  Serial.begin(115200);
  BHY2.begin();
  temperature.begin();
  humidity.begin();
  pressure.begin();
  gasRes.begin();
}

void loop() {
  BHY2.update();

  float temp = temperature.value() + offset;
  float hum = humidity.value();
  float pres = pressure.value();
  float gas = gasRes.value();

  Serial.println("---------");
  Serial.print("Temp: "); Serial.println(temp);
  Serial.print("Hum: "); Serial.println(hum);
  Serial.print("Pres: "); Serial.println(pres);
  Serial.print("Gas: "); Serial.println(gas);

  delay(2000);
}
