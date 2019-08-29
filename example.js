const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let frames = 0
let interval

//flag to track the shooting key
var space = false

// Is a bullet already on the canvas?
var shooting = false

class Gameboard {
  constructor() {
    this.width = canvas.width
    this.height = canvas.height
    this.x = 0
    this.y = 0
    this.img = new Image()
    this.img.src = './img/fondo.png'
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  style() {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle
  }
}

const board = new Gameboard()

class Player {
  constructor(img, width, height, x, y, status, life) {
    this.img = new Image()
    this.img.src = img
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.speedX = 0
    this.status = status
    this.life = life
    this.dead = false
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }

  newPos() {
    this.x += this.speedX
  }

  updateStatus(status) {
    this.status = status
  }
}

const player1 = new Player('./img/at-at_P1.png', 180, 130, 0, 450, true)
const player2 = new Player('./img/at-at_P2.png', 180, 130, 700, 450, false)


function showLife() {
  bufferctx.fillStyle = "rgb(59,59,59)";
  bufferctx.font = "bold 16px Arial";
  bufferctx.fillText("Vidas: " + player.life, canvas.width - 100, 40);
}

function getRandomNumber(range) {
  return Math.floor(Math.random() * range);
}

function Player(life, score) {
  var settings = {
    marginBottom: 10,
    defaultHeight: 66
  };
  player1 = new Image();
  player1.src = 'img/at-at_P1.png';
  player1.posX = (canvas.width / 2) - (player1.width / 2);
  player1.posY = canvas.height - (player1.height == 0 ? settings.defaultHeight : player1.height) - settings.marginBottom;
  player1.life = life;
  player1.score = score;
  player1.dead = false;
  player1.speed = player1Speed;

  var shoot = function () {
    if (nextPlayer1Shot < now || now == 0) {
      player1Shot = new PlayerShot(player1.posX + (player1.width / 2) - 5, player1.posY);
      player1Shot.add();
      now += player1ShotDelay;
      nextPlayer1Shot = now + player1ShotDelay;
    } else {
      now = new Date().getTime();
    }
  };

  player1.doAnything = function () {
    if (player1.dead)
      return;
    if (keyPressed.left && player1.posX > 5)
      player1.posX -= player1.speed;
    if (keyPressed.right && player1.posX < (canvas.width - player1.width - 5))
      player1.posX += player1.speed;
    if (keyPressed.fire)
      shoot();
  };

  player1.killPlayer1 = function () {
    if (this.life > 0) {
      this.dead = true;
      evilShotsBuffer.splice(0, evilShotsBuffer.length);
      player1ShotsBuffer.splice(0, player1ShotsBuffer.length);
      this.src = player1KilledImage.src;
      createNewEvil();
      setTimeout(function () {
        player1 = new Player1(player1.life - 1, player1.score);
      }, 500);

    } else {
      saveFinalScore();
      youLoose = true;
    }
  };

  return player1;
}

/******************************* DISPAROS *******************************/
function Shot(x, y, array, img) {
  this.posX = x;
  this.posY = y;
  this.image = img;
  this.speed = shotSpeed;
  this.identifier = 0;
  this.add = function () {
    array.push(this);
  };
  this.deleteShot = function (idendificador) {
    arrayRemove(array, idendificador);
  };
}

function PlayerShot(x, y) {
  Object.getPrototypeOf(PlayerShot.prototype).constructor.call(this, x, y, playerShotsBuffer, playerShotImage);
  this.isHittingEvil = function () {
    return (!evil.dead && this.posX >= evil.posX && this.posX <= (evil.posX + evil.image.width) &&
      this.posY >= evil.posY && this.posY <= (evil.posY + evil.image.height));
  };
}

PlayerShot.prototype = Object.create(Shot.prototype);
PlayerShot.prototype.constructor = PlayerShot;

function EvilShot(x, y) {
  Object.getPrototypeOf(EvilShot.prototype).constructor.call(this, x, y, evilShotsBuffer, evilShotImage);
  this.isHittingPlayer = function () {
    return (this.posX >= player.posX && this.posX <= (player.posX + player.width) &&
      this.posY >= player.posY && this.posY <= (player.posY + player.height));
  };
}

EvilShot.prototype = Object.create(Shot.prototype);
EvilShot.prototype.constructor = EvilShot;
/******************************* FIN DISPAROS ********************************/


/******************************* ENEMIGOS *******************************/
function Enemy(life, shots, enemyImages) {
  this.image = enemyImages.animation[0];
  this.imageNumber = 1;
  this.animation = 0;
  this.posX = getRandomNumber(canvas.width - this.image.width);
  this.posY = -50;
  this.life = life ? life : evilLife;
  this.speed = evilSpeed;
  this.shots = shots ? shots : evilShots;
  this.dead = false;

  var desplazamientoHorizontal = minHorizontalOffset +
    getRandomNumber(maxHorizontalOffset - minHorizontalOffset);
  this.minX = getRandomNumber(canvas.width - desplazamientoHorizontal);
  this.maxX = this.minX + desplazamientoHorizontal - 40;
  this.direction = 'D';


  this.kill = function () {
    this.dead = true;
    totalEvils--;
    this.image = enemyImages.killed;
    verifyToCreateNewEvil();
  };

  this.update = function () {
    this.posY += this.goDownSpeed;
    if (this.direction === 'D') {
      if (this.posX <= this.maxX) {
        this.posX += this.speed;
      } else {
        this.direction = 'I';
        this.posX -= this.speed;
      }
    } else {
      if (this.posX >= this.minX) {
        this.posX -= this.speed;
      } else {
        this.direction = 'D';
        this.posX += this.speed;
      }
    }
    this.animation++;
    if (this.animation > 5) {
      this.animation = 0;
      this.imageNumber++;
      if (this.imageNumber > 8) {
        this.imageNumber = 1;
      }
      this.image = enemyImages.animation[this.imageNumber - 1];
    }
  };

  this.isOutOfScreen = function () {
    return this.posY > (canvas.height + 15);
  };

  function shoot() {
    if (evil.shots > 0 && !evil.dead) {
      var disparo = new EvilShot(evil.posX + (evil.image.width / 2) - 5, evil.posY + evil.image.height);
      disparo.add();
      evil.shots--;
      setTimeout(function () {
        shoot();
      }, getRandomNumber(3000));
    }
  }
  setTimeout(function () {
    shoot();
  }, 1000 + getRandomNumber(2500));

  this.toString = function () {
    return 'Enemigo con vidas:' + this.life + 'shotss: ' + this.shots + ' puntos por matar: ' + this.pointsToKill;
  }

}

function Evil(vidas, disparos) {
  Object.getPrototypeOf(Evil.prototype).constructor.call(this, vidas, disparos, evilImages);
  this.goDownSpeed = evilSpeed;
  this.pointsToKill = 5 + evilCounter;
}

Evil.prototype = Object.create(Enemy.prototype);
Evil.prototype.constructor = Evil;

function FinalBoss() {
  Object.getPrototypeOf(FinalBoss.prototype).constructor.call(this, finalBossLife, finalBossShots, bossImages);
  this.goDownSpeed = evilSpeed / 2;
  this.pointsToKill = 20;
}

FinalBoss.prototype = Object.create(Enemy.prototype);
FinalBoss.prototype.constructor = FinalBoss;
/******************************* FIN ENEMIGOS *******************************/

function verifyToCreateNewEvil() {
  if (totalEvils > 0) {
    setTimeout(function () {
      createNewEvil();
      evilCounter++;
    }, getRandomNumber(3000));

  } else {
    setTimeout(function () {
      saveFinalScore();
      congratulations = true;
    }, 2000);

  }
}

function createNewEvil() {
  if (totalEvils != 1) {
    evil = new Evil(evilLife + evilCounter - 1, evilShots + evilCounter - 1);
  } else {
    evil = new FinalBoss();
  }
}

function isEvilHittingPlayer() {
  return (((evil.posY + evil.image.height) > player.posY && (player.posY + player.height) >= evil.posY) &&
    ((player.posX >= evil.posX && player.posX <= (evil.posX + evil.image.width)) ||
      (player.posX + player.width >= evil.posX && (player.posX + player.width) <= (evil.posX + evil.image.width))));
}

function checkCollisions(shot) {
  if (shot.isHittingEvil()) {
    if (evil.life > 1) {
      evil.life--;
    } else {
      evil.kill();
      player.score += evil.pointsToKill;
    }
    shot.deleteShot(parseInt(shot.identifier));
    return false;
  }
  return true;
}

function playerAction() {
  player.doAnything();
}

function addListener(element, type, expression, bubbling) {
  bubbling = bubbling || false;

  if (window.addEventListener) { // Standard
    element.addEventListener(type, expression, bubbling);
  } else if (window.attachEvent) { // IE
    element.attachEvent('on' + type, expression);
  }
}

function keyDown(e) {
  var key = (window.event ? e.keyCode : e.which);
  for (var inkey in keyMap) {
    if (key === keyMap[inkey]) {
      e.preventDefault();
      keyPressed[inkey] = true;
    }
  }
}

function keyUp(e) {
  var key = (window.event ? e.keyCode : e.which);
  for (var inkey in keyMap) {
    if (key === keyMap[inkey]) {
      e.preventDefault();
      keyPressed[inkey] = false;
    }
  }
}

function draw() {
  ctx.drawImage(buffer, 0, 0);
}

function showGameOver() {
  bufferctx.fillStyle = "rgb(255,0,0)";
  bufferctx.font = "bold 35px Arial";
  bufferctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
}

function showCongratulations() {
  bufferctx.fillStyle = "rgb(204,50,153)";
  bufferctx.font = "bold 22px Arial";
  bufferctx.fillText("Enhorabuena, te has pasado el juego!", canvas.width / 2 - 200, canvas.height / 2 - 30);
  bufferctx.fillText("PUNTOS: " + player.score, canvas.width / 2 - 200, canvas.height / 2);
  bufferctx.fillText("VIDAS: " + player.life + " x 5", canvas.width / 2 - 200, canvas.height / 2 + 30);
  bufferctx.fillText("PUNTUACION TOTAL: " + getTotalScore(), canvas.width / 2 - 200, canvas.height / 2 + 60);
}

function getTotalScore() {
  return player.score + player.life * 5;
}

function update() {

  drawBackground();

  if (congratulations) {
    showCongratulations();
    return;
  }

  if (youLoose) {
    showGameOver();
    return;
  }

  bufferctx.drawImage(player, player.posX, player.posY);
  bufferctx.drawImage(evil.image, evil.posX, evil.posY);

  updateEvil();

  for (var j = 0; j < playerShotsBuffer.length; j++) {
    var disparoBueno = playerShotsBuffer[j];
    updatePlayerShot(disparoBueno, j);
  }

  if (isEvilHittingPlayer()) {
    player.killPlayer();
  } else {
    for (var i = 0; i < evilShotsBuffer.length; i++) {
      var evilShot = evilShotsBuffer[i];
      updateEvilShot(evilShot, i);
    }
  }

  showLifeAndScore();

  playerAction();
}

function updatePlayerShot(playerShot, id) {
  if (playerShot) {
    playerShot.identifier = id;
    if (checkCollisions(playerShot)) {
      if (playerShot.posY > 0) {
        playerShot.posY -= playerShot.speed;
        bufferctx.drawImage(playerShot.image, playerShot.posX, playerShot.posY);
      } else {
        playerShot.deleteShot(parseInt(playerShot.identifier));
      }
    }
  }
}

function updateEvilShot(evilShot, id) {
  if (evilShot) {
    evilShot.identifier = id;
    if (!evilShot.isHittingPlayer()) {
      if (evilShot.posY <= canvas.height) {
        evilShot.posY += evilShot.speed;
        bufferctx.drawImage(evilShot.image, evilShot.posX, evilShot.posY);
      } else {
        evilShot.deleteShot(parseInt(evilShot.identifier));
      }
    } else {
      player.killPlayer();
    }
  }
}

function drawBackground() {
  var background;
  if (evil instanceof FinalBoss) {
    background = bgBoss;
  } else {
    background = bgMain;
  }
  bufferctx.drawImage(background, 0, 0);
}

function updateEvil() {
  if (!evil.dead) {
    evil.update();
    if (evil.isOutOfScreen()) {
      evil.kill();
    }
  }
}

/******************************* MEJORES PUNTUACIONES (LOCALSTORAGE) *******************************/
function saveFinalScore() {
  localStorage.setItem(getFinalScoreDate(), getTotalScore());
  showBestScores();
  removeNoBestScores();
}

function getFinalScoreDate() {
  var date = new Date();
  return fillZero(date.getDay() + 1) + '/' +
    fillZero(date.getMonth() + 1) + '/' +
    date.getFullYear() + ' ' +
    fillZero(date.getHours()) + ':' +
    fillZero(date.getMinutes()) + ':' +
    fillZero(date.getSeconds());
}

function fillZero(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

function getBestScoreKeys() {
  var bestScores = getAllScores();
  bestScores.sort(function (a, b) {
    return b - a;
  });
  bestScores = bestScores.slice(0, totalBestScoresToShow);
  var bestScoreKeys = [];
  for (var j = 0; j < bestScores.length; j++) {
    var score = bestScores[j];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (parseInt(localStorage.getItem(key)) == score) {
        bestScoreKeys.push(key);
      }
    }
  }
  return bestScoreKeys.slice(0, totalBestScoresToShow);
}

function getAllScores() {
  var all = [];
  for (var i = 0; i < localStorage.length; i++) {
    all[i] = (localStorage.getItem(localStorage.key(i)));
  }
  return all;
}

function showBestScores() {
  var bestScores = getBestScoreKeys();
  var bestScoresList = document.getElementById('puntuaciones');
  if (bestScoresList) {
    clearList(bestScoresList);
    for (var i = 0; i < bestScores.length; i++) {
      addListElement(bestScoresList, bestScores[i], i == 0 ? 'negrita' : null);
      addListElement(bestScoresList, localStorage.getItem(bestScores[i]), i == 0 ? 'negrita' : null);
    }
  }
}

function clearList(list) {
  list.innerHTML = '';
  addListElement(list, "Fecha");
  addListElement(list, "Puntos");
}

function addListElement(list, content, className) {
  var element = document.createElement('li');
  if (className) {
    element.setAttribute("class", className);
  }
  element.innerHTML = content;
  list.appendChild(element);
}

// extendemos el objeto array con un metodo "containsElement"
Array.prototype.containsElement = function (element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) {
      return true;
    }
  }
  return false;
};

function removeNoBestScores() {
  var scoresToRemove = [];
  var bestScoreKeys = getBestScoreKeys();
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (!bestScoreKeys.containsElement(key)) {
      scoresToRemove.push(key);
    }
  }
  for (var j = 0; j < scoresToRemove.length; j++) {
    var scoreToRemoveKey = scoresToRemove[j];
    localStorage.removeItem(scoreToRemoveKey);
  }
}
/******************************* FIN MEJORES PUNTUACIONES *******************************/