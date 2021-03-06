//Simple moving square script

//Width and height of square
var width = window.innerWidth
var height = window.innerHeight

//Square position
var state = {
    x: (width / 2),
    y: (height / 2),
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down'
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
    
    if(state.pressedKeys.left){
        state.x -= progress
    }
    if(state.pressedKeys.right){
        state.x += progress
    }
    if(state.pressedKeys.down){
        state.y += progress
    }
    if(state.pressedKeys.up){
        state.y -= progress
    }

    //Flip pos at boundries
    if(state.x > width){
        state.x -= width
    } 
    else if (state.x < 0){
        state.x += width
    }
    if(state.y > height){
        state.y -= height
    } 
    else if (state.y < 0){
        state.y += height
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

    ctx.fillRect(state.x - 5, state.y - 5, 10, 10)
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
