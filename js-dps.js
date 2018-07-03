//Simple moving square script

//Width and height of square
var width = window.innerWidth
var height = window.innerHeight

//Square position
var state = {
    pressedKeys: {
        zero: false,
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false,
        seven: false,
        eight: false,
        nine: false
    }
}

var keyMap = {
    48: 'zero',
    49: 'one',
    50: 'two',
    51: 'three',
    52: 'four',
    53: 'five',
    54: 'six',
    55: 'seven',
    56: 'eight',
    57: 'nine'
}

function keydown(event){
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}

function keyup(event){
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

window.addEventListener('keydown', keydown, false)
window.addEventListener('keyup', keyup, false)

//Update the state of the world for the elapsed time since last render
function update(progress){
    
    if(state.pressedKeys.one){
        ctx.fillStyle = 'blue'
    } else {
        ctx.fillStyle = 'red'
    }

    if(canvas.height != window.innerHeight || height != canvas.height){
        canvas.height = window.innerHeight
        height = canvas.height
        ctx.fillStyle = "red"
    }
    if(canvas.width != window.innerWidth || width != canvas.width){
        canvas.width = window.innerWidth
        width = canvas.width
        ctx.fillStyle = "red"
    }
    
}

var canvas = document.getElementById("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
var width = canvas.width
var height = canvas.height
var ctx = canvas.getContext("2d")
ctx.fillStyle = "red"

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)

    ctx.fillRect(100, 100, 50, 50)
    ctx.fillRect(200, 100, 50, 50)
}

function loop(timestamp){
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

console.log(canvas.width)
console.log(canvas.height)

var lastRender = 0
window.requestAnimationFrame(loop)
