const cvs = document.getElementById("pong");                                                                   //Id wird definiert
const ctx = cvs.getContext("2d");                                                                              //methoden und Eigenschaften werden hiermit angegeben

const user = {                                                                                                          //der User wird definiert
    x : 0,                                                                                                              //x-Wert
    y : cvs.height/2 - 100/2,                                                                                           //y-Wert
    width : 10,                                                                                                         //die Breite
    height : 100,                                                                                                       //die Höhe
    color : "WHITE",                                                                                                    //die Farbe
    score : 0                                                                                                           //und der Score, den der User am Anfang hat
}

const com = {                                                                                                           //der Computer wird definiert
    x : cvs.width - 10,                                                                                                 //siehe oben
    y : cvs.height/2 - 100/2,                                                                                           //-"-
    width : 10,                                                                                                         //-"-
    height : 100,                                                                                                       //-"-
    color : "WHITE",                                                                                                    //-"-
    score : 0                                                                                                           //-"-
}

const ball = {                                                                                                          //der Ball wird definiert
    x : cvs.width/2,                                                                                                    //-"-
    y : cvs.height/2,                                                                                                   //-"-
    width : 10,                                                                                                         //-"-
    radius : 10,                                                                                                        //der Radius
    speed : 5,                                                                                                          //die geschwindigkeit, die der ball besitzt
    geschwindigkeitX : 5,                                                                                               //geschwindigkeit in x-richtung
    geschwindigkeitY : 5,                                                                                               //geschwindigkeit in y-richtung
    color : "WHITE",                                                                                                    //-"-
}

function drawRect(x, y, w, h, color) {                                                                                  //ein Rechteck wird gezeichnet -> in abhängigkeit von x, y, breite, höhe, farbe
    ctx.fillStyle = color;                                                                                              //die Füllfarbe wird angewannt
    ctx.fillRect(x, y, w, h);                                                                                           //die verscheidenen Werte werden angewannt
}

const netz = {                                                                                                          //das Netz in der Mitte des Spielfeldes wird definiert
    x : cvs.width/2 - 1,                                                                                                //-"-
    y : 0,                                                                                                              //-"-
    width : 2,                                                                                                          //-"-
    height : 10,                                                                                                        //-"-
    color : "WHITE",                                                                                                    //-"-
}

function drawnetz() {                                                                                                   //Funktion zeichnet das Netz
    for (let i = 0; i <= cvs.height; i += 15) {                                                                         //eine Konstante i wird eingeführt, welche gleich der Höhe des Canvas ist -> i=15
        drawRect(netz.x, netz.y + i, netz.width, netz.height, netz.color);                                           //das Netz wird mit den Werten gezeichnet
    }
}

function drawCircle(x, y, r, color) {                                                                                   //der Ball wird gezeichnet
    ctx.fillStyle = color;                                                                                              //Füllfarbe des Ball's
    ctx.beginPath();                                                                                                    //der Weg das Ball's wird beschrieben
    ctx.arc(x, y, r, 0, Math.PI*2, false);                                            //Weg des Ball's, zu seiner Ausgangsposition
    ctx.closePath();                                                                                                    //Weg beendet
    ctx.fill();                                                                                                         //wird gefüllt
}

function drawText (text, x, y, color) {                                                                                 //text wird angegeben/ gezeichnent
    ctx.fillStyle = color;                                                                                              //Füllfarbe
    ctx.font = "45px fantasy";                                                                                          //die schrift ist 45 Pixel auseinander
    ctx.fillText(text, x, y);                                                                                           //der text wird mit den Werten ausgegeben
}

function render() {                                                                                                     //das spiel konstruieren

    drawRect(0, 0, cvs.width, cvs.height, "BLACK");                                                         //löschen des Canvas


    drawnetz();                                                                                                         //Netz zeichnen

                                                                                                                        //den Score zeichnen
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");                                               //der Score wird gezeichnet
    drawText(com.score, 3 * cvs.width/4, cvs.height/5, "WHITE");                                            //der Score wird gezeichnet



    drawRect(user.x, user.y, user.width, user.height, user.color);                                                      //der Spieler und das Paddles wird gezeichnet
    drawRect(com.x, com.y, com.width, com.height, com.color);                                                           //der Spieler und das Paddles wird gezeichnet


    drawCircle(ball.x, ball.y, ball.radius, ball.color);                                                                //der Ball wird gezeichnet
}




cvs.addEventListener("mousemove",bewegePaddle);                                                                    //das Paddle des Spieler wird durch die Maus bewegt

function bewegePaddle(evt) {                                                                                            //funktion für das Bewegen des Paddels
    let rect = cvs.getBoundingClientRect();                                                                             //varable definiert

    user.y = evt.clientY - rect.top - user.height/2;                                                                    //die Mitte des Paddles des Spieler folgt der Mausbewegung
}


                                                                                                                        //Kollisions Funktion
function kollision(b ,p) {                                                                                              //b für Ball, p für Spieler
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

                                                                                                                        //resetet den Ball
function resetBall() {                                                                                                  //der Ball wird nach dem erziehlen eines Punktes, wieder in die Ausgangsposition zurück gepackt
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.geschwingkeit = 5;
    ball.geschwindigkeitX = - ball.geschwindigkeitX;
}


                                                                                                                        // Update Funktion -> position, bewegungen, score,...
function update() {
    ball.x += ball.geschwindigkeitX;                                                                                    //der Ball bewegt sich -> x-Wert wird mit der Geschwindigkeit gleichgesetzt
    ball.y += ball.geschwindigkeitY;                                                                                    //der Ball bewegt sich -> -"-
                                                                                                                        // einfache AI für das kontrollieren der Computer Paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;


    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {                                                //wenn der Ball den unteren oder oberen Balken berührt
        ball.geschwindigkeitY = -ball.geschwindigkeitY;                                                                 //,dann wird die Geschwindigkeit in y-Richtung in eine negative Bewegung umgeändert -> der Ball springt ab
    }

    let player = (ball.x < cvs.width / 2) ? user : com;                                                                 //hier wird festgestellt, welcher Spieler den Ball berührt

    if (kollision(ball, player)) {
                                                                                                                        //wo der Ball den Spieler berührt
        let collidePoint = ball.y - (player.y + player.height / 2);

                                                                                                                        //Normalisierung
        collidePoint = collidePoint / (player.height / 2);
                                                                                                                        //berechnung des Winkels im Bogenmaß
        let angelRad = collidePoint * Math.PI / 4;


                                                                                                                        //x-Richtung des Ball's, wenn er etwas berührt
        let Richtung = (ball.x < cvs.width / 2) ? 1 : -1;


        ball.geschwindigkeitX = -ball.geschwindigkeitX;                                                                 //veränderung der x-, y-Geschwindigkeit
                                                                                                                        //jedes mal, wenn der Ball das Paddle berührt, erhöht er die Geschwindigkeit
        ball.geschwingkeit += 0.1;
    }


                                                                                                                        //Update des Scores
    if (ball.x - ball.radius < 0) {
                                                                                                                        //der Computer gewinnt/ macht einen Punkt
        com.score++;                                                                                                    //der Score wird höher
        resetBall();                                                                                                    //der Ball wird wieder reseted
    } else if (ball.x + ball.radius > cvs.width) {
                                                                                                                        //der Spieler gewinnt/ macht einen Punkt
        user.score++;                                                                                                   //der Score wird höher
        resetBall();                                                                                                    //der Ball wird wieder reseted
    }
}
                                                                                                                        //Spiel init
function Spiel() {
    update();
    render();
}

                                                                                                                        //loop
const framePerSecond = 50;                                                                                              //Variable wird definiert
setInterval(Spiel, 1000/framePerSecond);                                                                        //der Loop wird jede Sekunde 50 mal abgespielt