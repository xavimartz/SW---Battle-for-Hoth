const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let frames = 0
let interval

//flag to track the shooting key
let space = false

// Is a bullet already on the canvas?
let shooting = false

class Gameboard {
  constructor() {
    this.width = canvas.width
    this.height = canvas.height
    this.x = 0
    this.y = 0
    this.img = new Image()
    this.img.src = './assets/img/fondo.png'
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
    this.speedy = 0
    this.status = status
    this.life = life
    this.dead = false
  }
  draw() {
    if (this.y >= canvas.height - 300) {
      this.y = canvas.height - 300
    }
    this.y += 2
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }

  newPos() {
    this.x += this.speedX
  }

  updateStatus(status) {
    this.status = status
  }

  jump() {
    this.y -= 40
  }
}

const player1 = new Player('./assets/img/at-at_P1.png', 180, 130, 0, 450, true)
const player2 = new Player('./assets/img/at-at_P2.png', 180, 130, 820, 450, false)

class Gun {
  constructor(x, y, width, height, speed) {
    this.x = x
    this.y = y
    this.w = width
    this.h = height
    this.s = speed
    this.imgpow = new Image()
    this.imgpow.src = './assets/img/laser.png'
  }
  draw() {
    ctx.drawImage(this.imgpow, this.x, this.y, this.w, this.h)
  }
}

const bullet = new Gun(0, 0, 80, 10, 0.15)

const startButton = document.querySelector('#start')
startButton.onclick = () => {
  console.log('Mi juego esta VIVOOO')
  startGame()
}

const startGame = () => {
  if (interval) return
  interval = setInterval(updateCanvas, 20)
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  player1.newPos()
  player2.newPos()
  board.draw()
  player1.draw()
  player2.draw()
  draw()
}

// Check if number a is in the range b to c (exclusive)
function isWithin(a, b, c) {
  return a > b && a < c
}

// Return true if two squares a and b are colliding, false otherwise
function isColliding(a, b) {
  console.log('bullet', a)
  console.log('enemy', b)
  let result = false
  if (isWithin(a.x, b.x, b.x + b.width) || isWithin(a.x + a.w, b.x, b.x + b.width)) {
    if (isWithin(a.y, b.y, b.y + b.height) || isWithin(a.y + a.h, b.y, b.y + b.height)) {
      result = true
    }
  }
  return result
}

function shoot() {
  if (player1.status == true) {
    if (!shooting) {
      shooting = true

      bullet.x = player1.x + player1.width
      bullet.y = player1.y + player1.height / 2
    }
  }
  if (player2.status == true) {
    if (!shooting) {
      console.log('coñoooo micky')
      shooting = true
      console.log(player2.x)
      bullet.x = player2.x
      bullet.y = player2.y + player2.height / 2
    }
  }
}

function draw() {
  let gameOver = false

  // Move and draw the bullet
  if (player1.status == true) {
    if (shooting) {
      // Move the bullet
      bullet.x += bullet.s
      // Collide the bullet with enemies

      if (isColliding(bullet, player2)) {
        player1.status = false
        player2.status = true
        shooting = false
      }
      // Collide with the wall
      if (bullet.x > canvas.width) {
        shooting = false
      }
      bullet.draw()
    }
  }
  if (player2.status == true) {
    if (shooting) {
      // Move the bullet
      bullet.x -= bullet.s
      // Collide the bullet with enemies

      if (isColliding(bullet, player1)) {
        console.log('la bala choca con P2')
        player1.status = true
        player2.status = false
        shooting = false
      }
      // Collide with the wall
      if (bullet.x < 0) {
        console.log('la bala choca con muro')
        shooting = false
      }
      bullet.draw()
    }
  }
  if (gameOver) {
    endGame()
  } else {
    window.requestAnimationFrame(draw)
  }
}

document.onkeydown = e => {
  if (player1.status == true) {
    switch (e.keyCode) {
      case 65:
        if (player1.x <= 0) player1.x = 0
        else player1.speedX -= 1
        break
      case 68:
        if (player1.x >= (4 * canvas.width) / 9 - player1.width) player1.x = (4 * canvas.width) / 9 - player1.width
        else player1.speedX += 1
        break
      case 87:
        player1.jump()
        break
      case 83:
        shoot()
        break
      default:
        break
    }
  }
  if (player2.status == true) {
    switch (e.keyCode) {
      case 74:
        if (player2.x <= (5 * canvas.width) / 9) player2.x = (5 * canvas.width) / 9
        else player2.speedX -= 1
        break
      case 76:
        if (player2.x + player2.width >= canvas.width) player2.x = canvas.width - player2.width
        else player2.speedX += 1
        break
      case 73:
        player2.jump()
      case 75:
        shoot()
        break
      default:
        break
    }
  }
}

document.onkeyup = e => {
  switch (e.keyCode) {
    case 87:
      player1.y += 40
      break
    case 73:
      player2.y += 40
      break
  }
}

document.onkeyup = e => {
  player1.speedX = 0
  player2.speedX = 0
}
