/*
**   TODO:
**  -Add more abilities
**  -Implement incremental system
**  -Make 'Buttons', decide what they do with a javascript object like pressed keys
**  -Be able to change systems with the click of a button (Incremental to DPS)
**  -Visuals?
**  -Fix bug where when holding down key, time keeps going into negatives
**  -
**
*/

//Width and height of window
var width = window.innerWidth
var height = window.innerHeight

//First pass, used in some of the ability and enemy functions
var first_pass = true
var clicker_mode = true
var dps_mode = false

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

//Abilities

var abilities = {
    names: {
        zero: '',
        one: 'frostbolt',
        two: 'ice lance',
        three: 'fireball',
        four: '',
        five: '',
        six: '',
        seven: '',
        eight: '',
        nine: ''
    },
    critical_hit: {
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
    return 'rgb(' + (255 * percentage) + ',' + (reverse_percentage * 157) + ',' + (255 * reverse_percentage) + ')'
}

function numberToName(number){
    switch(number){
        case 1:
            return "one"
            break
        case 2:
            return "two"
            break
        case 3:
            return "three"
            break
        case 4:
            return "four"
            break
        case 5:
            return "five"
            break
        case 6:
            return "six"
            break
        case 7:
            return "seven"
            break
        case 8:
            return "eight"
            break
        case 9:
            return "nine"
            break
        case 0:
            return "zero"
            break
    }
}

//Abilites for buttons at bottom of screen
class Ability {
    constructor(x, y, rwidth, rheight, number, name, color = 'red'){
        this.height = rheight
        this.width = rwidth
        this.x = x
        this.y = y
        this.number = number
        if(this.number == 10){
            this.number = 0
        }
        this.getThisKey()
        this.transitioning = false
        this.pressed = false
        this.normal_color = color
        this.damage = 10
        this.cooldown = 2
        this.last_clicked = Date.now()
        this.fade_percent = (Date.now() - this.last_clicked) / 10
        this.name = name
        this.crit_chance = .1
        this.getStats()
        this.normal_damage = this.damage
    }
    //Draws the ability on the canvas
    drawAbl() {
        this.fade_percent = (Date.now() - this.last_clicked) / (10 * this.cooldown)
        
        if(!state.pressedKeys[this.number] && (Date.now() - this.last_clicked > this.cooldown * 1000)){
            this.pressed = false
        }
        if(this.pressed){
            ctx.beginPath()
            ctx.fillStyle = fadeColor(this.fade_percent)
            ctx.fillRect(this.x, this.y, this.height, this.width)
            this.damage = 0
            ctx.beginPath()
            ctx.font = "20px Arial"
            ctx.fillText(this.name, this.x, this.y - 10, this.width)
            ctx.beginPath()
            ctx.fillStyle = 'black'
            ctx.font = "20px Arial"
            if(this.fade_percent <= 99){
                ctx.fillText((Math.round(((((this.fade_percent/100) * this.cooldown) - this.cooldown)*-1)*10)/10).toFixed(1), this.x, this.y + 20)
            }
        } else {
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y, this.height, this.width)
            this.damage = this.normal_damage
            ctx.beginPath()
            ctx.font = "20px Arial"
            ctx.fillText(this.name, this.x, this.y - 10, this.width)
            abilities.critical_hit[this.number] = false
            if(this.ability_just_used){
                this.damage /= 2
                this.cooldown += 1
                this.ability_just_used = false
            }
        }
    }

    //Starts the animation which fades the color back to red from blue
    use(){
        if(!this.pressed){
            this.pressed = true
            this.abilityUsedAfterCrit()
            this.percent = 0
            this.last_clicked = Date.now()
            if(Math.random() < this.crit_chance){
                this.damage *= 2
                abilities.critical_hit[this.number] = true
            }
        }
    }

    getThisKey(){
        this.number = numberToName(this.number)
    }

    //Get stats for ability
    getStats(){
        switch (this.name){
            case 'frostbolt':
                this.damage = 10
                this.crit_chance = 1
                this.cooldown = 1.3
                break;
            case 'ice lance':
                this.damage = 30
                this.crit_chance = 1
                this.cooldown = 6
                break;

        }
    }

    abilityUsedAfterCrit(){
        if(abilities.critical_hit['one'] && !this.ability_just_used){
            this.damage *= 2
            this.cooldown -= 1
            this.ability_just_used = true
        }
    }
}

class Grunt{
    constructor(x, y, rwidth, rheight, level){
        this.x = x
        this.y = y
        this.height = rheight
        this.width = rwidth
        this.level = level
        this.health = 1000
        this.normal_color = 'red'
        this.dead = false
        this.damaged = false
        this.origHealth = this.health
        this.frozen = false
        this.damage_log = []
    }

    //Draws 'Grunt' on canvas
    drawGrunt(){
        if(!this.dead){
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y, this.height, this.width, this.width)
            this.drawHealthBar()
            ctx.beginPath()
            ctx.font = "30px Arial"
            ctx.fillText(this.health, this.x, this.y - 50, this.width)
        } else {
            ctx.beginPath()
            ctx.fillStyle = 'green'
            ctx.fillRect(this.x, this.y, this.height, this.width)
            ctx.beginPath()
            ctx.font = "20px Arial"
            ctx.fillText('Deaded', this.x, this.y - 50, this.width)
        }
    }

    //Health getter
    getHealth(){
        return this.health
    }

    //Damage dealer
    dmgGrunt(damage){
        this.health -= damage
        if(this.health <= 0){
            this.dead = true
        } else if (damage != 0) {
            this.damage_log.push(damage)
            console.log(this.damage_log)
        }
    }

    //Health bar drawer
    drawHealthBar(){
        var barLength = this.width * (this.health/this.origHealth)
        if(this.health >= 0){
            ctx.beginPath()
            ctx.fillStyle = this.normal_color
            ctx.fillRect(this.x, this.y + this.height + 10, barLength, (this.height / 5))
        }
    }
}

//Switch to change from clicker to dps mode
class Switch{
    constuctor(){
        this.pressed = false
        this.x = window.innerWidth - 50
        this.y = 0
        this.width = 50
        this.height = 50
    }
    
    change(){
        clicker_mode = !clicker_mode
        dps_mode = !dps_mode
    }

    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    checkIfPressed(){

    }
}

//Buffer Spaces
var xbuff = 0
var ybuff = 100

//Variables surrounding the creation of abilities
var amount_of_abilities = 10
var amount_of_enemies = 1
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
        abl_array[0].use()
        enemy_array[0].dmgGrunt(abl_array[0].damage)
    }
    if(state.pressedKeys.two){
        abl_array[1].use()
        enemy_array[0].dmgGrunt(abl_array[1].damage)
    }
    if(state.pressedKeys.three){
        abl_array[2].use()
    }
    if(state.pressedKeys.four){
        abl_array[3].use()
    }
    if(state.pressedKeys.five){
        abl_array[4].use()
    }
    if(state.pressedKeys.six){
        abl_array[5].use()
    }
    if(state.pressedKeys.seven){
        abl_array[6].use()
    }
    if(state.pressedKeys.eight){
        abl_array[7].use()
    }
    if(state.pressedKeys.nine){
        abl_array[8].use()
    }
    if(state.pressedKeys.zero){
        abl_array[9].use()
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
            let r = new Ability(x + (x_change * i), y, a, b, i + 1, abilities.names[numberToName(i + 1)])
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

function draw_switch(){
    if(first_pass){
        switch1 = new Switch()
        switch1.draw()
    }
}

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)
    if(dps_mode){
        draw_abls()
        draw_enemies()
    } else {
        draw_switch()
    }
}

function init(){
    //Draws important stuff on screen
    draw_abls(xbuff, window.innerHeight - ybuff, 50, 50, amount_of_abilities)
    draw_enemies((canvas.width / 2), canvas.height / 3, 50, 50, amount_of_enemies)

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