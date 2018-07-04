//Width and height of window
var width = window.innerWidth
var height = window.innerHeight

//Tracks if keys are pressed or not
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

//Rectangles for buttons at bottom of screen
class Rectangle {
    constructor(x, y, rheight, rwidth, number, color){
        this.state = state
        this.height = rheight
        this.width = rwidth
        this.x = x
        this.y = y
        this.number = number
        this.color = color
    }
    drawRec() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.height, this.width)
        ctx.fill()
    }
}

//Buffer Spaces
var xbuff = 20
var ybuff = 100

//Variables surrounding the creation of rectangles
var amount_of_rectangles = 10
var x_change = (window.innerWidth - xbuff) / 10
var rect_array = []
var first_pass = true
var redraw = false


//Basic keymap of all top keyboard numbers
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

//Detects keydown events
function keydown(event){
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}

//Detects keyup events
function keyup(event){
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

//Adds event listener to detect key presses
window.addEventListener('keydown', keydown, false)
window.addEventListener('keyup', keyup, false)



//Update the state of the world for the elapsed time since last render
//TODO: Fix this so that only one rectangle actually changes color
function update(progress){
    
    if(state.pressedKeys.one){
        rect_array[0].color = 'blue'
        rect_array[0].drwaRec()
    }

    if(state.pressedKeys.two){
        rect_array[0].color = 'red'
    }

    //Set the canvas height and width to the size of the window
    if(canvas.height != window.innerHeight || height != canvas.height){
        canvas.height = window.innerHeight
        height = canvas.height 
    }
    if(canvas.width != window.innerWidth || width != canvas.width){
        canvas.width = window.innerWidth
        width = canvas.width 
    }
}

//Get HTML canvas object
var canvas = document.getElementById("canvas")

//Set variables for basic drawing to HTML window
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var width = canvas.width
var height = canvas.height
var ctx = canvas.getContext("2d")

//Fills the rectangles once with red
ctx.fillStyle = 'red'

//Creates num_rec number of rectangle classes and stores them in rect_array
function draw_recs(x, y, a, b, num_rec){
    for(i = 0; i < num_rec; i++){
        var r = new Rectangle(x + (x_change * i), y, a, b, i)
        r.drawRec()
        rect_array.push(r)
    }
}

//Redraws rectangles in the array
function redraw_recs(arr){
    for(i = 0; i < arr.length; i++){
        var r = arr[i]
        r.drawRect()
    }
}

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)
    draw_recs(20, window.innerHeight - ybuff, 50, 50, amount_of_rectangles)
}

//Basic game loops
function loop(timestamp){
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

var lastRender = 0
window.requestAnimationFrame(loop)
