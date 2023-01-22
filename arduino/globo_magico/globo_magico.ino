#include <StringTokenizer.h>

#define STP_B  9
#define STP_L  8
#define STP_D  7
#define STP_F  6
#define STP_R  5
#define STP_U  4
#define DIRECT 3
#define ENABLE 2


////// GLOBAL ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
int STEP_SPEED;
unsigned long START;

void wait4Algorithm();
int getStepPIN(char motor);
void switchMotors(bool state);
void rotateCube(String twist);

void executeAlgorithm(String algorithm);

////// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void setup()
{
  Serial.begin(9600);

  pinMode(STP_B, OUTPUT);
  pinMode(STP_L, OUTPUT);
  pinMode(STP_D, OUTPUT);
  pinMode(STP_F, OUTPUT);
  pinMode(STP_R, OUTPUT);
  pinMode(STP_U, OUTPUT);
  pinMode(DIRECT, OUTPUT);
  pinMode(ENABLE, OUTPUT);

  STEP_SPEED = 850;
  switchMotors(false);
}
////// LOOPING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void loop()
{
  wait4Algorithm();

//  rotateCube("F2");
//  delay(1000);
}

////// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

int getStepPIN(char motor)
{
  switch (motor)
  {
    case 'F':
      return STP_F;
    case 'B':
      return STP_B;
    case 'L':
      return STP_L;
    case 'R':
      return STP_R;
    case 'D':
      return STP_D;
    case 'U':
      return STP_U;
    default:
      return 0;
  }
}


void switchMotors(bool state) {
  int ON_OFF = 0;

  if (state)
    ON_OFF = LOW;
  else
    ON_OFF = HIGH;

  digitalWrite(ENABLE, ON_OFF);
}

void wait4Algorithm()
{
  String algorithm = "";
  char character;

  // Enquanto receber algo pela serial
  while (Serial.available() > 0)
  {
    // Lê byte da serial
    character = Serial.read();
    // Ignora character de quebra de linha
    if (character != '\n')
    {
      // Concatena valores
      algorithm.concat(character);
    }
    // Aguarda buffer serial ler próximo character
    delay(10);
  }
  algorithm.toUpperCase();

  if (algorithm != "")
    executeAlgorithm(algorithm);
}

void rotateCube(String twist)
{
  twist.replace("'", "’");
  twist.replace("*", "’");
  twist.replace("\r", "");
  int STEPS = 50, STP = getStepPIN(twist[0]);

  Serial.print("Twist ");
  Serial.print(twist[0]);

  // Check if is clockwise
  if (twist.indexOf("’") > 0)
  {
    Serial.print(" anti-clockwise ");
    digitalWrite(DIRECT, LOW);
  }
  else
  {
    Serial.print(" clockwise ");
    digitalWrite(DIRECT, HIGH);
  }
  // Check if is 180 degres
  if (twist.indexOf("2") > 0)
  {
    Serial.println(" 180 degrees.");
    STEPS = STEPS * 2;
  }
  else
    Serial.println(" 90 degrees.");

  // Twist the Cube
  if (STP == 0)
  {
    // E = UD
    // S = FB
    // M = RL
    int OLD_SPEED = STEP_SPEED;
    STEP_SPEED = STEP_SPEED - 100;

    if (twist.indexOf("’") < 0)
    {
      Serial.print(" anti-clockwise ");
      digitalWrite(DIRECT, LOW);
    }
    else
    {
      Serial.print(" clockwise ");
      digitalWrite(DIRECT, HIGH);
    }

    switch (twist[0])
    {
      case 'M':
        for (int x = 0; x < STEPS; x++)
        {
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_R, HIGH);
          digitalWrite(STP_L, HIGH);
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_R, LOW);
          digitalWrite(STP_L, LOW);
        }
        break;
      case 'S':
        for (int x = 0; x < STEPS; x++)
        {
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_F, HIGH);
          digitalWrite(STP_B, HIGH);
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_F, LOW);
          digitalWrite(STP_B, LOW);
        }
        break;
      case 'E':
        for (int x = 0; x < STEPS; x++)
        {
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_U, HIGH);
          digitalWrite(STP_D, HIGH);
          delayMicroseconds(STEP_SPEED);
          digitalWrite(STP_U, LOW);
          digitalWrite(STP_D, LOW);
        }
        break;
      default:
        Serial.println("Invalid Twist...");
        break;
    }
    STEP_SPEED = OLD_SPEED;
  }
  else

    for (int x = 0; x < STEPS; x++)
    {
      delayMicroseconds(STEP_SPEED);
      digitalWrite(STP, HIGH);
      delayMicroseconds(STEP_SPEED);
      digitalWrite(STP, LOW);

    }
}

void executeAlgorithm(String algorithm)
{
  START = millis();
  StringTokenizer tokens(algorithm, " ");

  switchMotors(true);

  while (tokens.hasNext()) {
    rotateCube(tokens.nextToken());
  }

  switchMotors(false);

  Serial.print(algorithm);
  Serial.print(" ... ");
  Serial.print("done in ");
  Serial.print(float(millis() - START) / 1000);
  Serial.println(" secs.");
}
