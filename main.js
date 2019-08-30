const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const lifeP1 = document.querySelector('#p1_life')
const lifeP2 = document.querySelector('#p2_life')

let frames = 0
let interval

// Is a bullet already on the canvas?

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
    constructor(img, width, height, x, y, life) {
        this.img = new Image()
        this.img.src = img
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.speedX = 0
        this.speedy = 0
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
    jump() {
        this.y -= 40
    }
    isTouching(bullet) {
        return this.x < bullet.x + bullet.w &&
            this.x + this.width > bullet.x &&
            this.y < bullet.y + bullet.h &&
            this.y + this.height > bullet.y;
    }
}

const player1 = new Player('./assets/img/millenium_falcon.png', 180, 130, 0, 450, 100)
const player2 = new Player('./assets/img/starfighter_vader.png', 180, 130, 820, 450, 100)

class Gun {
    constructor(x, y, width, height, img) {
        this.x = x
        this.y = y
        this.w = width
        this.h = height
        this.img = new Image()
        this.img.src = img
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}

let shooting = []
let shooting2 = []

function generateGun1() {
   // if (shooting.length <= 3) {
        shooting.push(
            new Gun(player1.x + player1.width, player1.y + player1.height / 2, 80, 10, './assets/img/laser.png')
        )
    //}
}

function generateGun2() {
    //if (shooting.length <= 3) {
        shooting2.push(new Gun(player2.x, player2.y + player2.height / 2, 80, 10, './assets/img/laser2.png'))
    //}
}


function drawGun1() {
    shooting.forEach(laser1 => {
        laser1.x += 10
        laser1.draw()
    })
}

function drawGun2() {
    shooting2.forEach(laser2 => {
        laser2.x -= 10
        laser2.draw()
    })
}

function inCollision() {
    shooting.forEach(laser => {
        if (player2.isTouching(laser)) {
            shooting.pop()
            player2.life -= 1
            console.log(player2.life)
            if (player2.life == 0) {
                player2.dead = true
            }
        }
    })
    shooting2.forEach(laser => {
        if (player1.isTouching(laser)) {
            shooting2.pop()
            player1.life -= 1
            if (player1.life == 0) {
                player1.dead = true
            }
        }
    })
}

function printLife(){
    lifeP1.innerHTML = `Player 1 life ${player1.life}`
    lifeP2.innerHTML = `Player 2 life ${player2.life}`
}

function endgame() {
    if (player1.dead == true || player2.dead == true) {
        clearInterval(interval)
        setTimeout(() => {
            location.reload()
        }, 3000)

    }
}

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
    drawGun1()
    drawGun2()
    inCollision()
    printLife()
    endgame()
}

document.onkeydown = e => {
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
            generateGun1()
            break
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
            break
        case 75:
            generateGun2()
            break
        default:
            break
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