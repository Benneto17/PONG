//Canvas auswählen
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//User Paddle
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}


//Computer Paddle
const com = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

//Ball
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    width : 10,
    radius : 10,
    speed : 5,
    geschwindigkeitX : 5,
    geschwindigkeitY : 5,
    color : "WHITE",
}

//eine Rechteck funktion zeichnen
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//Netz konstruieren
const netz = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE",
}

//das Netz zeichnen
function drawnetz() {
    for (let i = 0; i <= cvs.height; i += 15) {
        drawRect(netz.x, netz.y + i, netz.width, netz.height, netz.color);
    }
}

//Kreis zeichnen
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

//Text zeichnen

function drawText (text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

//das spiel konstruieren
function render() {
    //lösches des Canvas zuerst
    drawRect(0, 0, cvs.width, cvs.height, "BLACK");

    //Netz zeichnen
    drawnetz();

    //den Score zeichnen
    drawText(user.score, cvs.width/4, cvs.height/5, "WHITE");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "WHITE");


    //den Spieler und die Paddles zeichnen
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //den Ball zeichnen
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}


//kontrolle über die Paddles

cvs.addEventListener("mousemove", bewegePaddle);

function bewegePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}


//Kollisions Funktion
function kollision(b ,p) {    //b für Ball, p für Spieler
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
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs. height/2;

    ball.geschwingkeit = 5;
    ball.geschwindigkeitX = - ball.geschwindigkeitX;
}

// Update Funktion -> position, bewegungen, score,...
function update() {
    ball.x += ball.geschwindigkeitX;
    ball.y += ball.geschwindigkeitY;

    //einfache AI für das kontrollieren der Computer Paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;


    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.geschwindigkeitY = - ball. geschwindigkeitY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if (kollision(ball, player)) {
        //wo trifft der Ball den Spieler
        let kollisionsPunkt = ball.y - (player.y + player.height);

        //Normalisierung
        kollisionsPunkt = kollisionsPunkt/(player.height/2);

        //berechne den Winkel im Bogenmaß
        let winkleBog = kollisionsPunkt * Math.PI/4;


        //x-richtung des ball's, wenn er berührt
        let richtung = (ball.x < cvs.width/2) ? 1 : -1;


        //veränderung geschwindigkeit X und Y
        ball.geschwindigkeitX = richtung * ball.geschwingkeit * Math.cos(winkleBog)
        ball.geschwindigkeitY =            ball.geschwingkeit * Math.sin(winkleBog)

        //jedes mal, wenn der Ball das paddle berührt nimmt die geschwindigkeit zu
        ball.geschwingkeit += 0.5;
    }

    //update den Score
    if (ball.x - ball.radius < 0) {
        //der Computer gewinnt
        com.score++;
        resetBall();
    }else if (ball.x + ball.radius > cvs.width) {
        //der User gewinnt
        user.score++;
        resetBall();
    }
}
 //Spiel init
function Spiel() {
    update();
    render();
}

//loop
const framePerSecond = 50;
setInterval(Spiel, 1000/framePerSecond);