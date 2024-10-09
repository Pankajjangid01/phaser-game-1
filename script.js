const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  parent: "gameArea",
  backgroundColor: "#00BFFF",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let ball;
let ballVelocityX;
let ballVelocityY;
let sessionTimer;
let countdown = 0;
let countdownText;
let activeSession = null;
let sessionLogs = document.getElementById("sessionLogs");
let sessions = [];

let currentSessionId = document.getElementById("currentSessionId");
let currentStartTime = document.getElementById("currentStartTime");
let currentEndTime = document.getElementById("currentEndTime");

let clockSound;
const game = new Phaser.Game(config);

const minHeight = 20;
const maxHeight = 480;
const maxVelocity = 300; 
const minSpeed = 100; 
const speedIncrement = 20; 

function preload() {
  this.load.audio("clock", "./assets/clock.mp3");
}

function create() {
  ball = this.add.circle(400, 250, 20, 0xff0000);
  ballVelocityX = Phaser.Math.Between(50, 100); 
  ballVelocityY = Phaser.Math.Between(100, 150); 
  countdownText = this.add.text(10, 10, "Counter: 0", {
    fontSize: "20px",
    fill: "#FFFFFF",
  });

  clockSound = this.sound.add("clock");

  document
    .getElementById("startSession")
    .addEventListener("click", startSession.bind(this));
}

function update(time, delta) {
  if (activeSession) {
    ball.x += (ballVelocityX * delta) / 1000;
    ball.y += (ballVelocityY * delta) / 1000;

    if (ball.x <= 20 || ball.x >= 780) {
      ballVelocityX = -ballVelocityX; 
      ballVelocityX += Phaser.Math.Between(-20, 20); 
      increaseSpeed(); 
    }

    if (ball.y <= minHeight || ball.y >= maxHeight) {
      ballVelocityY = -ballVelocityY; 
      ballVelocityY += Phaser.Math.Between(-20, 20); 
      increaseSpeed(); 
    }

    ballVelocityX = Phaser.Math.Clamp(ballVelocityX, -maxVelocity, maxVelocity);
    ballVelocityY = Phaser.Math.Clamp(ballVelocityY, -maxVelocity, maxVelocity);
  }
}

function startSession() {
  if (activeSession) return;
  const sessionId = "S" + Math.random().toString(36).substr(2, 9);
  const startTime = new Date();
  countdown = Phaser.Math.Between(30, 120);
  activeSession = { sessionId, startTime };

  currentSessionId.textContent = "-";
  currentStartTime.textContent = "-";
  currentEndTime.textContent = "-";
  countdownText.setText("Counter: " + countdown);

  clockSound.play({ loop: true });

  sessionTimer = setInterval(() => {
    countdown--;
    countdownText.setText("Counter: " + countdown);
    if (countdown <= 0) {
      endSession();
    }
  }, 1000);
}

function endSession() {
  clearInterval(sessionTimer);
  const endTime = new Date();
  activeSession.endTime = endTime;
  sessions.push(activeSession);
  currentSessionId.textContent = activeSession.sessionId;
  currentStartTime.textContent = activeSession.startTime.toLocaleTimeString();
  currentEndTime.textContent = endTime.toLocaleTimeString();

  clockSound.stop();

  const li = document.createElement("li");
  li.textContent = `Session ID: ${
    activeSession.sessionId
  }, Start: ${activeSession.startTime.toLocaleTimeString()}, End: ${endTime.toLocaleTimeString()}`;
  sessionLogs.appendChild(li);
  activeSession = null;
  countdownText.setText("Counter: 0");
}

function increaseSpeed() {
  if (Math.abs(ballVelocityX) < maxVelocity) {
    ballVelocityX += (ballVelocityX > 0 ? 1 : -1) * speedIncrement;
  }
  if (Math.abs(ballVelocityY) < maxVelocity) {
    ballVelocityY += (ballVelocityY > 0 ? 1 : -1) * speedIncrement;
  }

  if (Math.abs(ballVelocityX) < minSpeed) {
    ballVelocityX = (ballVelocityX > 0 ? 1 : -1) * minSpeed;
  }
  if (Math.abs(ballVelocityY) < minSpeed) {
    ballVelocityY = (ballVelocityY > 0 ? 1 : -1) * minSpeed;
  }
}
