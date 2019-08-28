const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let frames = 0
let interval

class Gameboard {
    constructor() {
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.y = 0;
        this.img = new Image();
        this.img.src = './img/fondo.png';
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    style() {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle
    }
}

const board = new Gameboard()

class Player {
    constructor(img, width, height, x, y, status) {
        this.img = new Image()
        this.img.src = img
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.speedX = 0
        this.status = status
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    newPos() {
        this.x += this.speedX
    }

    updateStatus(status) {
        this.status = status
    }
}

let player1 = new Player('./img/at-at_P1.png', 200, 160, 0, 420, true)
let player2 = new Player('./img/at-at_P2.png', 200, 160, 1100, 420, false)


const startButton = document.querySelector('#start')
startButton.onclick = () => {
    console.log('Mi juego esta VIVOOO')
    startGame()
}

const startGame = () => {
    interval = setInterval(updateCanvas, 20)
}

function updateCanvas() {
    frames += 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player1.newPos()
    player2.newPos()
    board.draw()
    player1.draw()
    player2.draw()
}


document.onkeydown = e => {
    if (player1.status == true) {
        switch (e.keyCode) {
            case 65:
                if (player1.x <= 0)
                    player1.x = 0
                else
                    player1.speedX -= 1
                break
            case 68:
                if (player1.x >= 4 * (canvas.width) / 9 - (player1.width))
                    player1.x = 4 * (canvas.width) / 9 - (player1.width)
                else
                    player1.speedX += 1
                break
            default:
                break
        }
    }
    if (player2.status == true) {
        switch (e.keyCode) {
            case 74:
                if(player2.x <= 5 * (canvas.width) / 9)
                player2.x = 5 * (canvas.width) / 9
                else
                player2.speedX -= 1
                break

            case 76:
                if ((player2.x + player2.width) >= canvas.width)
                    player2.x = canvas.width - player2.width
                else
                    player2.speedX += 1
            default:
                break

        }
    }
}

document.onkeyup = e => {
    player1.speedX = 0
    player2.speedX = 0
}