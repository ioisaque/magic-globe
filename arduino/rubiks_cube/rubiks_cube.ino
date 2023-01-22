//..............................................................................................................................................................................
//.RRRRRRRRRRRRRR...RUUUU......UUUU...BBBBBBBBBBBBB....IIIII..KKKKK....KKKKKKKK'''''...SSSSSSSSS...............CCCCCCCCCC....UUUUU.....UUUUU..UBBBBBBBBBBBBB...BEEEEEEEEEEEEEE..
//.RRRRRRRRRRRRRRR..RUUUU......UUUU...BBBBBBBBBBBBBB...IIIII..KKKKK....KKKKKK.K'''''..SSSSSSSSSSSS...........CCCCCCCCCCCCC...UUUUU.....UUUUU..UBBBBBBBBBBBBBB..BEEEEEEEEEEEEEE..
//.RRRRRRRRRRRRRRR..RUUUU......UUUU...BBBBBBBBBBBBBBB..IIIII..KKKKK...KKKKKK..K'''''.SSSSSSSSSSSSS..........CCCCCCCCCCCCCCC..UUUUU.....UUUUU..UBBBBBBBBBBBBBB..BEEEEEEEEEEEEEE..
//.RRRRR....RRRRRR..RUUUU......UUUU...BBBBB....BBBBBB..IIIII..KKKKK..KKKKKK...K''''..SSSSSS.SSSSSSS.........CCCCCCC.CCCCCCC..UUUUU.....UUUUU..UBBBB....BBBBBB..BEEEE............
//.RRRRR.....RRRRR..RUUUU......UUUU...BBBBB.....BBBBB..IIIII..KKKKK.KKKKKK.....''''..SSSSS....SSSSS........ CCCCC.....CCCCC..UUUUU.....UUUUU..UBBBB.....BBBBB..BEEEE............
//.RRRRR.....RRRRR..RUUUU......UUUU...BBBBB.....BBBBB..IIIII..KKKKKKKKKKK......''''..SSSSSS................ CCCCC............UUUUU.....UUUUU..UBBBB.....BBBBB..BEEEE............
//.RRRRR....RRRRRR..RUUUU......UUUU...BBBBB....BBBBBB..IIIII..KKKKKKKKKKK............SSSSSSSSSS............ CCCC.............UUUUU.....UUUUU..UBBBB....BBBBBB..BEEEE............
//.RRRRRRRRRRRRRRR..RUUUU......UUUU...BBBBBBBBBBBBBB...IIIII..KKKKKKKKKKK............SSSSSSSSSSSS.......... CCCC.............UUUUU.....UUUUU..UBBBBBBBBBBBBB...BEEEEEEEEEEEEE...
//.RRRRRRRRRRRRRR...RUUUU......UUUU...BBBBBBBBBBBBBB...IIIII..KKKKKKKKKKKK.............SSSSSSSSSSS......... CCCC.............UUUUU.....UUUUU..UBBBBBBBBBBBBB...BEEEEEEEEEEEEE...
//.RRRRRRRRRRRRR....RUUUU......UUUU...BBBBBBBBBBBBBBB..IIIII..KKKKKKKKKKKK...............SSSSSSSSSS........ CCCC.............UUUUU.....UUUUU..UBBBBBBBBBBBBBB..BEEEEEEEEEEEEE...
//.RRRRR.RRRRRRR....RUUUU......UUUU...BBBBB....BBBBBBB.IIIII..KKKKKKKKKKKKK..................SSSSSS........ CCCC.............UUUUU.....UUUUU..UBBBB....BBBBBBB.BEEEE............
//.RRRRR..RRRRRRR...RUUUU.....UUUUU...BBBBB.....BBBBBB.IIIII..KKKKKK.KKKKKKK........'SSSS.....SSSSS........ CCCCC............UUUUU.....UUUUU..UBBBB......BBBBB.BEEEE............
//.RRRRR...RRRRRR...RUUUUU....UUUUU...BBBBB......BBBBB.IIIII..KKKKK...KKKKKK........'SSSSS....SSSSS........ CCCCC.....CCCCC..UUUUU.....UUUUU..UBBBB......BBBBB.BEEEE............
//.RRRRR....RRRRRR...UUUUUUUUUUUUUU...BBBBB....BBBBBBB.IIIII..KKKKK....KKKKKK.......'SSSSSSSSSSSSSS.........CCCCCCC.CCCCCCC..UUUUUUU.UUUUUUU..UBBBB....BBBBBBB.BEEEE............
//.RRRRR....RRRRRRR..UUUUUUUUUUUUUU...BBBBBBBBBBBBBBB..IIIII..KKKKK....KKKKKK........SSSSSSSSSSSSSS.........CCCCCCCCCCCCCCC...UUUUUUUUUUUUU...UBBBBBBBBBBBBBBB.BEEEEEEEEEEEEEE..
//.RRRRR.....RRRRRR...UUUUUUUUUUUU....BBBBBBBBBBBBBBB..IIIII..KKKKK.....KKKKKK........SSSSSSSSSSSS...........CCCCCCCCCCCCC....UUUUUUUUUUUUU...UBBBBBBBBBBBBBB..BEEEEEEEEEEEEEE..
//.RRRRR......RRRRRR...UUUUUUUUUU.....BBBBBBBBBBBBBB...IIIII..KKKKK.....KKKKKKK........SSSSSSSSSS..............CCCCCCCCCC......UUUUUUUUUU.....UBBBBBBBBBBBBB...BEEEEEEEEEEEEEE..
//..............................................................................................................................................................................
//.............................................................................................................................................................   By Block  ....
//..............................................................................................................................................................................
#include <StringTokenizer.h>
#include <LiquidCrystal.h>

unsigned long TIMESTAMP = millis();

//LiquidCrystal lcd(22, 23, 24, 25, 26, 27);

#define F   1
#define B   2
#define L   3
#define R   4
#define D   5
#define U   6

// BUTTONS
#define BTN_SOLVE       2
#define BTN_SCRAMBLE    3
#define BTN_TESTING     4

// MOTORS'S CONTROL
#define PIN_DISABLED    5
#define PIN_G_DIR       6

#define PIN_D_STEP     7
#define PIN_L_STEP     8
#define PIN_R_STEP     9
#define PIN_U_STEP     10
#define PIN_B_STEP     11
#define PIN_F_STEP     12

// POWER SUPPLY
#define PIN_POWER_ATX   13

bool isAllMotorsActive;

////// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  String listenWebServer();
  String listenForAlgorithm();
  int stepPinFor( int motor );  
  void setMotorsState( bool state );
  void translateMovement( String movement, float delayInSec = 0 );
  void executeAlgorithm( String algorithm, float delayInSec = 0 );

  bool is_TestRunCheck_Enabled();

////// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void setup() {
  // LCD START
//  lcd.begin(16, 2);
//  lcd.clear();
//  lcd.setCursor(2, 0);
//  lcd.print("Rubik's Cube");
//  lcd.setCursor(1, 1);
//  lcd.print("Machine Ready!");
    
   // DIRECTION PIN
   pinMode(PIN_G_DIR,  OUTPUT);

   // MOTORS'S PIN
   pinMode(PIN_F_STEP,  OUTPUT);
   pinMode(PIN_D_STEP,  OUTPUT);
   pinMode(PIN_R_STEP,  OUTPUT);
   pinMode(PIN_B_STEP,  OUTPUT);
   pinMode(PIN_U_STEP,  OUTPUT);
   pinMode(PIN_L_STEP,  OUTPUT);

   pinMode(PIN_DISABLED,  OUTPUT);
   pinMode(PIN_POWER_ATX, OUTPUT);

   setMotorsState( false );

   // BUTTON'S PIN
   pinMode(BTN_SCRAMBLE,  INPUT);
   pinMode(BTN_SOLVE,     INPUT);
   pinMode(BTN_TESTING,   INPUT);

  Serial.begin(9600);
  Serial3.begin(115200);
}
////// LOOPING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void loop() {   
  
    digitalWrite(PIN_POWER_ATX, 1);
  
/////////////////////////////////////////////////////////////////////
    //.......................................................
    //....CCCCCCC......OOOOOOO.....RRRRRRRRRR...EEEEEEEEEEE..
    //...CCCCCCCCC....OOOOOOOOOO...RRRRRRRRRRR..EEEEEEEEEEE..
    //..CCCCCCCCCCC..OOOOOOOOOOOO..RRRRRRRRRRR..EEEEEEEEEEE..
    //..CCCC...CCCCC.OOOOO..OOOOO..RRRR...RRRRR.EEEE.........
    //.CCCC.....CCC.OOOOO....OOOOO.RRRR...RRRRR.EEEE.........
    //.CCCC.........OOOO......OOOO.RRRRRRRRRRR..EEEEEEEEEE...
    //.CCCC.........OOOO......OOOO.RRRRRRRRRRR..EEEEEEEEEE...
    //.CCCC.........OOOO......OOOO.RRRRRRRR.....EEEEEEEEEE...
    //.CCCC.....CCC.OOOOO....OOOOO.RRRR.RRRR....EEEE.........
    //..CCCC...CCCCC.OOOOO..OOOOO..RRRR..RRRR...EEEE.........
    //..CCCCCCCCCCC..OOOOOOOOOOOO..RRRR..RRRRR..EEEEEEEEEEE..
    //...CCCCCCCCCC...OOOOOOOOOO...RRRR...RRRRR.EEEEEEEEEEE..
    //....CCCCCCC.......OOOOOO.....RRRR....RRRR.EEEEEEEEEEE..
    //.......................................................
/////////////////////////////////////////////////////////////////////

  listenWebServer();
  listenForAlgorithm();
  
  if ( digitalRead(BTN_SOLVE) == 1 )
    executeAlgorithm( "F2 B2 F' B' F' B' F2 B2 F' B' F' B'" );
    //executeAlgorithm( "D2 U2 F' R D2 B U' L' U R D L' F R U' B' D F2 U F'", 0.5 );
    
  if ( digitalRead(BTN_SCRAMBLE) == 1 )
    executeAlgorithm( "U2 D2 U' D' U' D' U2 D2 U' D' U' D'" );
    //executeAlgorithm( "F U' F2 D' B U R' F' L D' R' U' L U B' D2 R' F U2 D2" );

  if ( digitalRead(BTN_TESTING) == 1 )
  {
    executeAlgorithm( "R2 L2 R' L' R' L' R2 L2 R' L' R' L'" );
    //executeAlgorithm( "R2 R' R' L' L' L2 F2 F' F' B' B' B2 U2 U' U' D' D' D2", 0.5 );
    //delay(1500);
    //executeAlgorithm( "R L U2 R L' B2 U2 R2 F2 L2 D2 L2 F2" ); 
  }
  
}

////// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void setMotorsState( bool state )
{
    if ( state )
    {
      isAllMotorsActive = true;
      digitalWrite(PIN_DISABLED, LOW);
    }
    else
    {
      isAllMotorsActive = false;
      digitalWrite(PIN_DISABLED, HIGH);
    }
}

int stepPinFor( int motor ) {
  switch ( motor ) {
    case F: return PIN_F_STEP;
    case B: return PIN_B_STEP;
    case L: return PIN_L_STEP;
    case R: return PIN_R_STEP;
    case D: return PIN_D_STEP;
    case U: return PIN_U_STEP;
  }
  return 0;
}

String listenWebServer() {
  String algorithm = "";
  char character;

  // Enquanto receber algo pela serial
  while (Serial3.available() > 0) {
    // Lê byte da serial
    character = Serial3.read();
    // Ignora character de quebra de linha
    if (character != '\n') {
      // Concatena valores
      algorithm.concat(character);
    }
    // Aguarda buffer serial ler próximo character
    delay(10);
  }
  algorithm.toUpperCase();

  if (algorithm != "")
    executeAlgorithm(algorithm);

  return algorithm;
}

String listenForAlgorithm() {
  String algorithm = "";
  char character;

  // Enquanto receber algo pela serial
  while (Serial.available() > 0) {
    // Lê byte da serial
    character = Serial.read();
    // Ignora character de quebra de linha
    if (character != '\n') {
      // Concatena valores
      algorithm.concat(character);
    }
    // Aguarda buffer serial ler próximo character
    delay(10);
  }
  algorithm.toUpperCase();

  if (algorithm != "")
    executeAlgorithm(algorithm);

  return algorithm;
}

void translateMovement( String movement, float delayInSec ) {
  // Initialize variables
  int MOTOR = 0, DIRECTION = LOW, STEPS = 50;

    movement.replace("/ESP=", "");
    movement.replace("'", "’");
  
         if( movement == "R" )   { MOTOR = R;                      Serial.println("Lado direito (right) no sentido horário");       }
    else if( movement == "R’" )  { MOTOR = R; DIRECTION = HIGH;    Serial.println("Lado direito (right) no sentido anti-horário");  }
    else if( movement == "R2" )  { MOTOR = R; STEPS = STEPS*2;     Serial.println("Lado direito (right) com giro duplo");           }
    
    else if( movement == "L" )   { MOTOR = L;                      Serial.println("Lado esquerdo (left) no sentido horário");       }
    else if( movement == "L’" )  { MOTOR = L; DIRECTION = HIGH;    Serial.println("Lado esquerdo (left) no sentido anti-horário");  }
    else if( movement == "L2" )  { MOTOR = L; STEPS = STEPS*2;     Serial.println("Lado esquerdo (left) com giro duplo");           }

    else if( movement == "U" )   { MOTOR = U;                      Serial.println("Lado cima (up) no sentido horário");             }
    else if( movement == "U’" )  { MOTOR = U; DIRECTION = HIGH;    Serial.println("Lado cima (up) no sentido anti-horário");        }
    else if( movement == "U2" )  { MOTOR = U; STEPS = STEPS*2;     Serial.println("Lado cima (up) com giro duplo");                 }

    else if( movement == "D" )   { MOTOR = D;                      Serial.println("Lado baixo (down) no sentido horário");          }
    else if( movement == "D’" )  { MOTOR = D; DIRECTION = HIGH;    Serial.println("Lado baixo (down) no sentido anti-horário");     }
    else if( movement == "D2" )  { MOTOR = D; STEPS = STEPS*2;     Serial.println("Lado baixo (down) com giro duplo");              }

    else if( movement == "F" )   { MOTOR = F;                      Serial.println("Lado frente (front) no sentido horário");        }
    else if( movement == "F’" )  { MOTOR = F; DIRECTION = HIGH;    Serial.println("Lado frente (front) no sentido anti-horário");   }
    else if( movement == "F2" )  { MOTOR = F; STEPS = STEPS*2;     Serial.println("Lado frente (front) com giro duplo");            }

    else if( movement == "B" )   { MOTOR = B;                      Serial.println("Lado trás (back) no sentido horário");           }
    else if( movement == "B’" )  { MOTOR = B; DIRECTION = HIGH;    Serial.println("Lado trás (back) no sentido anti-horário");      }
    else if( movement == "B2" )  { MOTOR = B; STEPS = STEPS*2;     Serial.println("Lado trás (back) com giro duplo");               }

    else{ Serial.print(movement); Serial.print("  ===> "); Serial.println("Comando inválido!"); }

    if (MOTOR != 0)
      setMotorsState( true );

    // Define wich stepPin to send the command
    int stepPin = stepPinFor( MOTOR );
  
    // Define wich direction to move the cube's face RIGHT or LEFT
    digitalWrite(PIN_G_DIR, DIRECTION);

      //lcd.clear();
      //lcd.setCursor(3, 0);
      //lcd.print("SOLVE TIME");
      //lcd.setCursor(6, 1);
      //lcd.print(millis() - TIMESTAMP);
  
    // do the movement
    for (int x = 0; x < STEPS; x++) {  
      digitalWrite(stepPin, HIGH);
      delayMicroseconds(800);
      digitalWrite(stepPin, LOW);
      delayMicroseconds(800);
    }
    
  setMotorsState( false );
  delay(delayInSec*1000);

}

void executeAlgorithm(String algorithm, float delayInSec = 0 ) {    
    StringTokenizer tokens(algorithm, " ");

      TIMESTAMP = millis();
      
  //lcd.clear();
  //lcd.setCursor(0, 0);
  //lcd.print("Solving...");
      
      while (tokens.hasNext()) {
        String command = tokens.nextToken();
        
        // translate the movement
        translateMovement(command, delayInSec);
      }      
}

bool is_TestRunCheck_Enabled() {
   #define tempoDebounce 50 //(tempo para eliminar o efeito Bounce EM MILISEGUNDOS)

   bool estadoBotao;
   static bool estadoBotaoAnt; 
   static bool estadoRet = false;
   static unsigned long delayBotao = 0;

   if ( (millis() - delayBotao) > tempoDebounce ) {
       estadoBotao = digitalRead(BTN_TESTING);
       if ( estadoBotao && (estadoBotao != estadoBotaoAnt) ) {
          estadoRet = !estadoRet;
          delayBotao = millis();
       }
       estadoBotaoAnt = estadoBotao;
   }

   return estadoRet;
}
