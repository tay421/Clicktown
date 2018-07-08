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
var click_value = 1
var num_upgrades = 3
var total_clicks = 0
var clicks = 0


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
    },
    pressedMouse: {
        zero: false,
        one: false,
        two: false
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

var upgrades = {
    names: {
        0: 'mouse',
        1: 'orc',
        2: 'hammond'
    },
    cost: {
        0: 50,
        1: 150,
        2: 500
    },
    show_value:{
        0: 10,
        1: 50,
        2: 100
    },
    click_value: {
        0: 1,
        1: 10,
        2: 100
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
class Switcher{
    constructor(x1, y1, width, height){
        this.pressed = false
        this.xPos = x1
        this.yPos = y1
        this.width = width
        this.height = height
        if(clicker_mode){
            this.text = 'DPS Mode'
        } else {
            this.text = 'Clicker Mode'
        }
    }
    
    change(){
        clicker_mode = !clicker_mode
        dps_mode = !dps_mode
        if(clicker_mode){
            this.text = 'DPS Mode'
        } else {
            this.text = 'Clicker Mode'
        }
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height)
        ctx.beginPath()
        ctx.font = "20px Arial"
        ctx.fillStyle = 'blue'
        ctx.fillText(this.text, this.xPos, this.yPos + 20, this.width)
    }

    press(){
        if(!this.pressed && this.mouseOver() && !state.pressedMouse['zero']){
            this.pressed = true
            this.change()
        }
        if(state.pressedMouse['zero']){
            this.pressed = false
        }
    }

    mouseOver(){
        if((mouseXPosition >= this.xPos && mouseXPosition <= this.xPos + this.width) && (mouseYPosition >= this.yPos && mouseYPosition < this.yPos + this.height)){
            return true
        }
        return false
    }
}

class Clicker{
    constructor(){
        this.width = 150
        this.height = 150
        this.x = (window.innerWidth - 300) / 2
        this.y = (window.innerHeight - 300) / 2
        this.text = 'Click Me'
        this.pressed = false
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.beginPath()
        ctx.font = "38px Arial"
        ctx.fillStyle = 'blue'
        ctx.fillText('Click Me', this.x, this.y + 80)
        ctx.beginPath()
        ctx.font = "38px Arial"
        ctx.fillStyle = 'blue'
        ctx.fillText('Clicks: ' + clicks, this.x, this.y - 80)
    }

    press(){
        if(!this.pressed && this.mouseOver() && !state.pressedMouse['zero']){
            this.pressed = true
            clicks += click_value
            total_clicks += click_value
        }
        if(state.pressedMouse['zero']){
            this.pressed = false
        }
    }

    mouseOver(){
        if((mouseXPosition >= this.x && mouseXPosition <= this.x + this.width) && (mouseYPosition >= this.y && mouseYPosition < this.y + this.height)){
            return true
        }
        return false
    }
}

class ClickerUpgrade{
    constructor(x, y, number){
        this.x = x
        this.y = y
        this.shown = false
        this.number = number
        this.width = 100
        this.height = 30
        this.purchased = 0
        this.last_added_to_clicks = Date.now()
        this.pressed = false
    }

    show(){
        if(!this.shown && total_clicks >= upgrades.show_value[this.number]){
            this.shown = true
        }
    }

    draw(){
        if(this.shown){
            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.beginPath()
            ctx.fillStyle = 'blue'
            ctx.font = '20px Arial'
            ctx.fillText(upgrades.names[this.number] + ": " + upgrades.cost[this.number] + "    x" + this.purchased, this.x, this.y + 20, 100)
            if(Date.now() - this.last_added_to_clicks > 1000 && this.purchased > 0){
                this.last_added_to_clicks = Date.now()
                clicks += upgrades.click_value[this.number] * this.purchased
            }
        }
        this.show()
    }

    press(){
        if(!this.pressed && this.mouseOver() && !state.pressedMouse['zero'] && this.shown && clicks >= upgrades.cost[this.number]){
            this.pressed = true
            this.purchased += 1
            clicks -= upgrades.cost[this.number]
        }
        if(state.pressedMouse['zero']){
            this.pressed = false
        }
    }

    mouseOver(){
        if((mouseXPosition >= this.x && mouseXPosition <= this.x + this.width) && (mouseYPosition >= this.y && mouseYPosition < this.y + this.height)){
            return true
        }
        return false
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
var switch_array = []
var clicker_array = []
var upgrade_array = []


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

var mouseXPosition = 0
var mouseYPosition = 0

function onDown(event) {
    if(event.button == 0){
        state.pressedMouse['zero']= true
        mouseXPosition = event.clientX
        mouseYPosition = event.clientY
    }
}

function onUp(event){
    if(event.button == 0){
        state.pressedMouse['zero']= false
    }
}

//Adds event listener to detect key presses
window.addEventListener('keydown', keydown, false)
window.addEventListener('keyup', keyup, false)
window.addEventListener('mousedown', onDown, false)
window.addEventListener('mouseup', onUp, false)

//Update the state of the world for the elapsed time since last render
function update(progress){
    //Detects keypresses
    if(dps_mode){
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
    }

    //Detects mouse press
    if(state.pressedMouse.zero){
        switch_array[0].press()
        clicker_array[0].press()
        for(i = 0; i < upgrade_array.length; i++){
            upgrade_array[i].press()
        }
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

    
    switch_array[0].press()
    clicker_array[0].press()
    for(i = 0; i < upgrade_array.length; i++){
        upgrade_array[i].press()
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
        let switch1 = new Switcher(canvas.width - 100, 20, 50, 50)
        switch_array.push(switch1)
        switch1.draw()
    } else {
        switch_array[0].draw()
    }
}

function draw_clicker(){
    if(first_pass){
        let clicker1 = new Clicker()
        clicker_array.push(clicker1)
        clicker_array[0].draw()
    } else {
        clicker_array[0].draw()
    }
}

function draw_upgrades(){
    if(first_pass){
        for(i = 0; i < num_upgrades; i++){
            let upgrade = new ClickerUpgrade(10, 50 + (50 * i), i)
            upgrade_array.push(upgrade)
            upgrade_array[i].draw()
        }
    } else {
        for(i = 0; i < upgrade_array.length; i++){
            upgrade_array[i].draw()
        }
    }
}

//Draw the state of the world
function draw(){
    ctx.clearRect(0,0,width,height)
    if(dps_mode){
        draw_abls()
        draw_enemies()
    } else {
        draw_clicker()
        draw_upgrades()
    }
    draw_switch()
}

function init(){
    //Draws important stuff on screen
    draw_abls(xbuff, window.innerHeight - ybuff, 50, 50, amount_of_abilities)
    draw_enemies((canvas.width / 2), canvas.height / 3, 50, 50, amount_of_enemies)
    draw_switch()
    draw_clicker()
    draw_upgrades()

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