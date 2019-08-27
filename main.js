const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let frames = 0
let interval


function gameboard () {
    this.width = canvas.width;
    this.heigth = canvas.heigth;
    this.x = 0;
    this.y = 0;
    this.img = new Image();
    this.img.src = './img/landing_game.png';
    this.img.onload = () => {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    this.draw = () => {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

const board = new gameboard()


const startButton = document.querySelector('#start')
startButton.onclick = () => {
    console.log('game started')
    startGame()
}

const startGame = () => {
    interval = setInterval(updateCanvas, 20)
}

function updateCanvas() {
    frames += 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.draw()
}


// class player {
//     constructor(width, heigth, x, y) {
//         this.width = width
//         this.heigth = heigth
//         this.x = x
//         this.y = y
//         this.posX = 0
//         this.posY = 0
//         this.img = Image()
//         this.img.src = './img/at-atP1.png'
//         this.img.onload = () => {
//             ctx.drawImage(this.img, this.width, this.height, this.x, this.y)
//         }
//     }