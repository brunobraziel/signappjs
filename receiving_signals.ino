#include <SoftwareSerial.h>
 
SoftwareSerial bluetooth(2, 3); // RX, TX do Arduino
String command = "";
long f;
long t;
char freq[16];
char tempo[16];
const int soundpin=A2;
float sensorval = 0.0;

void setup()  
{  
  Serial.begin(9600);  
  pinMode(soundpin, INPUT);  
  pinMode(10, INPUT);
  pinMode(11, INPUT);
   
  bluetooth.begin(9600);  
}  
   
void loop()  
{  
  delay(1);
  
  sensorval = analogRead(soundpin);
  ltoa(sensorval,freq,10);
  
  Serial.print(sensorval, 10);
  Serial.write("\n");
  
  bluetooth.print(sensorval, 4);  
  bluetooth.write("\n");
  
}
