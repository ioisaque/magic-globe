#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

ESP8266WebServer server;
char* ssid = "BLOCK";
char* password = "q2T3dXPN";

void TOGGLE_PIN();
int  PIN      = 0;
int  D_PINS[] = {D0, D1, D2, D3, D4, D5, D6, D7, D8};
bool S_PINS[] = {false, false, false, false, false, false, false, false, false};

size_t N_PINS = sizeof D_PINS / sizeof D_PINS[0];

char* webpage PROGMEM = R"=====(
  <!DOCTYPE html>
  <html lang="pt-br">
  
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="viewport-fit=auto, initial-scale=1" />
      
      <title>BLOCK</title>
      <meta name="title" content="BLOCK" property="og:title" />
      <meta name="author" content="Isaque Costa" />
      <meta name="description" content="IdeYou - Acelerando Ideias!" />
  
      <link rel="shortcut icon" href="https://cdn.ideyou.com.br/assets/favicons/favicon.png" />
      <link rel="apple-touch-icon" href="https://cdn.ideyou.com.br/assets/favicons/touch-icon-iphone.png" />
      <link rel="apple-touch-startup-image" href="https://cdn.ideyou.com.br/assets/favicons/launch_logo.png" />
  
      <link href="https://cdn.ideyou.com.br/assets/css/main-styles.css" rel="stylesheet" />
      <link href="https://cdn.ideyou.com.br/assets/css/mobile-styles.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700%7CPoppins:400,500" rel="stylesheet" />
  </head>
  
  <body class="bg-danger">
      <div class="main-area">
          <span>
              <h1>STOP</h1>
              <h5>Who the fuck are you?</h5>
          </span>
          <img src="https://cdn.ideyou.com.br/assets/errorcodes/401.svg">
          <button class="btn" onclick="TOGGLE()">CALL 911 NOW!!!</button>
      </div>
  </body>
  
  <script>
    function TOGGLE(PIN)
    {      
      let xhr = new XMLHttpRequest();      
      xhr.open("POST", "/TOGGLE", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");      
      xhr.send(`PIN=${PIN}`);
    };
    // document.addEventListener('DOMContentLoaded', sendRequest, false);
  </script>
  
  </html>)=====";


void setup()
{
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println('.');
  }

  Serial.println();
  Serial.print(" Conected to ");
  Serial.print(ssid);
  Serial.println(".");

  Serial.print("  IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.print(" MAC Address: ");
  Serial.println(WiFi.macAddress());

  for (int i = 1; i < N_PINS; i++) {
    pinMode(D_PINS[i], OUTPUT);
    digitalWrite(D_PINS[i], S_PINS[i]);

    Serial.print("D");
    Serial.print(i);
    Serial.print(".");
    Serial.print(S_PINS[i]);
    if (i + 1 != N_PINS)
      Serial.print("|");
  }
  Serial.println();

  server.on("/", []() {
    server.send_P(200, "text/html", webpage);
  });
  server.on("/TOGGLE", TOGGLE_PIN);
  server.begin();
}

void loop()
{
  server.handleClient();
}

void TOGGLE_PIN()
{
  PIN = server.arg("PIN").toInt();

  if (D_PINS[PIN]) {
    S_PINS[PIN] = !S_PINS[PIN];
    digitalWrite(D_PINS[PIN], S_PINS[PIN]);

    for (int i = 1; i < N_PINS; i++) {
      Serial.print("D");
      Serial.print(i);
      Serial.print(".");
      Serial.print(S_PINS[i]);
      if (i + 1 != N_PINS)
        Serial.print("|");
    }
    Serial.println();
  } else {
    Serial.print("PIN D");
    Serial.print(PIN);
    Serial.println(" not available.");
  }

  delay(1);
  server.send(200, "text/plain", "OK");
}
