//Width and height of window
var width = window.innerWidth
var height = window.innerHeight

//First pass, used in some of the ability and enemy functions
var first_pass = true

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

//Abilites for buttons at bottom of screen
class Ability {
    constructor(x, y, rheight, rwidth, number, color = 'red'){
        this.state = state
        this.height = rheight
        this.width = rwidth
        this.x = x
        this.y = y
        this.number = number
        this.transitioning = false
        this.pressed = false
        this.normal_color = color
        this.damage = 10
    }
    //Draws the ability on the canvas
    drawAbl() {
        if(this.pressed){
            ctx.beginPath()
            ctx.fillStyle = fadeColor(this.percent)
            ctx.fillRect(this.x, this.y, this.height, this.width)
            this.damage = 0
        } else {
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y, this.height, this.width)
            this.damage = 10
        }
        if(this.percent <= 99){
            this.percent += 2
        }
        if(!state.pressedKeys['one'] && this.percent > 99){
            this.pressed = false
        }
    }

    //Starts the animation which fades the color back to red from blue
    click(key){
        if(!this.pressed){
            this.percent = 0
            this.pressed = true
            this.key = key
        }
    }
}

class Grunt{
    constructor(x, y, rheight, rwidth, level){
        this.x = x
        this.y = y
        this.height = rheight
        this.width = rwidth
        this.level = level
        this.health = 100
        this.normal_color = 'red'
        this.dead = false
        this.damaged = false
    }
    drawGrunt(){
        if(!this.damaged){
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        } else {
            ctx.beginPath()
            ctx.fillStyle = 'green'
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
    getHealth(){
        return this.health
    }
    dmgGrunt(damage){
        this.health -= damage
        console.log(this.health)
        if(this.health <= 0){
            this.damaged = true
        }
    }
}

//Buffer Spaces
var xbuff = 10
var ybuff = 100

//Variables surrounding the creation of abilities
var amount_of_abilities = 10
var x_change = (window.innerWidth - xbuff) / 10
var abl_array = []
var enemy_array = []


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
        abl_array[0].click('one')
        enemy_array[0].dmgGrunt(abl_array[0].damage)
    }
    if(state.pressedKeys.two){
        abl_array[1].click('two')
    }
    if(state.pressedKeys.three){
        abl_array[2].click('three')
    }
    if(state.pressedKeys.four){
        abl_array[3].click()
    }
    if(state.pressedKeys.five){
        abl_array[4].click()
    }
    if(state.pressedKeys.six){
        abl_array[5].click()
    }
    if(state.pressedKeys.seven){
        abl_array[6].click()
    }
    if(state.pressedKeys.eight){
        abl_array[7].click()
    }
    if(state.pressedKeys.nine){
        abl_array[8].click()
    }
    if(state.pressedKeys.zero){
        abl_array[9].click()
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

//Fills the abilities once with red
ctx.fillStyle = 'red'

//Creates num_abl number of ability classes and stores them in abl_array
//If first pass true, uses variables
//Else does not use variables
function draw_abls(x, y, a, b, num_abl){
    if(first_pass){
        for(i = 0; i < num_abl; i++){
            let r = new Ability(x + (x_change * i), y, a, b, i)
            r.drawAbl()
            abl_array.push(r)
        }
    } else {
        for(i = 0; i < abl_array.length; i++){
            abl_array[i].drawAbl()
        }
    }
}

//Draws enemy(ies) on canvas
function draw_enemies(x, y, a, b, num_enemies){
    if(first_pass){
        for(i = 0; i < num_enemies; i++){
            let grnt = new Grunt(x, y, a, b, 1)
            grnt.drawGrunt()
            enemy_array.push(grnt)
        }
    } else {
        for(i = 0; i < enemy_array.length; i++){
            enemy_array[i].drawGrunt()
        }
    }
}

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)
    draw_abls()
    draw_enemies()
}

function init(){
    //Draws important stuff on screen
    draw_abls(xbuff, window.innerHeight - ybuff, 50, 50, amount_of_abilities)
    draw_enemies(canvas.width / 2, canvas.height / 3, 50, 50, 1)

    //All first pass logic should be above this variable
    first_pass = false
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