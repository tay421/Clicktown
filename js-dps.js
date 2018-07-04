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

//Hard coded to make the squares always be red and blue, watch out!
function fadeColor(fraction){
    var percentage = fraction / 100
    var reverse_percentage = 1 - percentage
    return 'rgb(' + 255 * percentage + ', 0,' + 255 * reverse_percentage + ')'
}

//Rectangles for buttons at bottom of screen
class Rectangle {
    constructor(x, y, rheight, rwidth, number, color = 'red'){
        this.state = state
        this.height = rheight
        this.width = rwidth
        this.x = x
        this.y = y
        this.number = number
        this.transitioning = false
        this.pressed = false
        this.normal_color = 'red'
    }
    //Draws the rectangle on the canvas
    drawRec() {
        if(this.pressed){
            ctx.beginPath()
            ctx.fillStyle = fadeColor(this.percent)
            ctx.fillRect(this.x, this.y, this.height, this.width)
        } else {
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
        if(this.percent <= 99){
            this.percent += 2
        } else {
            this.pressed = false
        }
    }

    //Starts the animation which fades the color back to red from blue
    click(){
        this.percent = 0
        this.pressed = true
    }
}

//Buffer Spaces
var xbuff = 10
var ybuff = 100

//Variables surrounding the creation of rectangles
var amount_of_rectangles = 10
var x_change = (window.innerWidth - xbuff) / 10
var rect_array = []


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
function update(progress){
    //Detects keypresses
    if(state.pressedKeys.one){
        rect_array[0].click()
    }
    if(state.pressedKeys.two){
        rect_array[1].click()
    }
    if(state.pressedKeys.three){
        rect_array[2].click()
    }
    if(state.pressedKeys.four){
        rect_array[3].click()
    }
    if(state.pressedKeys.five){
        rect_array[4].click()
    }
    if(state.pressedKeys.six){
        rect_array[5].click()
    }
    if(state.pressedKeys.seven){
        rect_array[6].click()
    }
    if(state.pressedKeys.eight){
        rect_array[7].click()
    }
    if(state.pressedKeys.nine){
        rect_array[8].click()
    }
    if(state.pressedKeys.zero){
        rect_array[9].click()
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
        let r = new Rectangle(x + (x_change * i), y, a, b, i)
        r.drawRec()
        rect_array.push(r)
    }
}

function redraw_rectangles(){
    for(i = 0; i < rect_array.length; i++){
        rect_array[i].drawRec()
    }
}

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)
    redraw_rectangles()
}

function init(){
    draw_recs(xbuff, window.innerHeight - ybuff, 50, 50, amount_of_rectangles)
    loop()
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

init()