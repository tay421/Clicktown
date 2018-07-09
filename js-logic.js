/*
**   TODO:
**  -Add more abilities/classes
**  -Critical hit shake
**  -Tooltips
**  -Store
**
*/

//Keeps the mouse position
var mouseXPosition = 0
var mouseYPosition = 0
var mouse_move_x_position = 0
var mouse_move_y_position = 0

//Width and height of window
var width = window.innerWidth
var height = window.innerHeight

//First pass, used in some of the ability and enemy functions
var first_pass = true

//Variables to differentiate between clicker and dps modes of play
var clicker_mode = true
var dps_mode = false
var dps_upgrades_menu = false
var store_mode = false

//User values regarding clicker
var click_value = 1
var num_upgrades = 10
var total_clicks = 0
var clicks = 0

//Setting up images
var frame = new Image()
frame.src = 'images/frame2.png'
var click_button = new Image()
click_button.src = 'images/button.png'
var to_battlefield = new Image()
to_battlefield.src = 'images/to_battlefield.png'
var to_odd_stone = new Image()
to_odd_stone.src = 'images/to_odd_stone.png'
var to_store = new Image()
to_store.src = 'images/to_store.png'

//Buffer Spaces
var xbuff = 30
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
        0: 'Worker Mouse',
        1: 'Twinkling Pixie',
        2: 'Withering Click Wizard',

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
        //Height and width of ability
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

        //Dealing with displaying critical hit text
        this.display_crit_text = false
        this.removing_crit_text = false
        this.critical_hit_opacity = 1
        this.time_started_to_remove_crit_text = 0
        this.crit_multiplier = 2
        this.random_range = 45
        this.randomx = 0
        this.randomy = 0
    }

    

    //Draws the ability on the canvas
    drawAbl() {
        this.fade_percent = (Date.now() - this.last_clicked) / (10 * this.cooldown)
        ctx.drawImage(frame, this.x - 10, this.y - 10)
        ctx.closePath()
        
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
        this.drawCritText()
    }

    //Starts the animation which fades the color back to red from blue
    use(){
        if(!this.pressed){
            this.pressed = true
            this.abilityUsedAfterCrit()
            this.percent = 0
            this.last_clicked = Date.now()
            this.critical_hit_opacity = 1
            this.checkCrit()
            this.drawCritText()
        }
    }

    checkCrit(){
        //Checks for critial hit
        if(Math.random() <= this.crit_chance){
            this.damage *= this.crit_multiplier
            abilities.critical_hit[this.number] = true
            this.display_crit_text = true
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
            case 'fireball':
                this.damage = 1000
                break

        }
    }

    abilityUsedAfterCrit(){
        if(abilities.critical_hit['one'] && !this.ability_just_used){
            this.damage *= 2
            this.cooldown -= 1
            this.ability_just_used = true
        }
    }

    drawCritText(){
        if(this.display_crit_text){
            this.display_crit_text = false
            this.randomx = Math.floor(Math.random() * this.random_range) - (this.random_range / 2)
            this.randomy = Math.floor(Math.random() * this.random_range) - (this.random_range / 2)
            ctx.beginPath()
            ctx.font = "20px Arial"
            ctx.fillStyle = 'rgba(255, 197, 50, ' + this.critical_hit_opacity + ')'
            ctx.fillText('Critical Hit!', (window.innerWidth / 2) - this.randomx - 45, 325 - this.randomy)
            this.removing_crit_text = true
            this.time_started_to_remove_crit_text = Date.now()
        }
        if (this.removing_crit_text){
            let placeholder = (Date.now() - this.time_started_to_remove_crit_text) / 1000
            ctx.beginPath()
            ctx.font = "20px Arial"
            ctx.fillStyle = 'rgba(255, 197, 50, ' + this.critical_hit_opacity + ')'
            ctx.fillText('Critical Hit!', (width / 2) - this.randomx - 45, 325 - 100*placeholder - this.randomy)
            this.critical_hit_opacity *= 1 - (placeholder / 2)
            if(placeholder / 2 >= 1){
                this.removing_crit_text = false
                this.time_started_to_remove_crit_text = 0
                this.critical_hit_opacity = 1
            }
        }
    }
}

class Grunt{
    constructor(x, y, rwidth, rheight, level){
        this.x = (width - rwidth) / 2
        this.y = (height - rheight - 200) / 2
        this.height = rheight
        this.width = rwidth
        this.level = level
        this.health = 1000
        this.normal_color = 'rgba(255, 0, 0, 1)'
        this.dead = false
        this.damaged = false
        this.origHealth = this.health
        this.frozen = false
        this.damage_log = []
        this.time_of_death = 0
        this.death_move_down_pixels = 50
        this.death_time = 0
        this.dying = false
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
        } else if (!this.dying){
            this.time_of_death = Date.now()
            this.dying = true
            ctx.beginPath()
            ctx.fillStyle = 'rgb(0, 255, 0)'
            ctx.fillRect(this.x, this.y, this.height, this.width)
        } else {
            this.y += (50 * (Date.now() - this.time_of_death) / 30000)
        }
        if((Date.now() - this.time_of_death) / 3000 < 1){
            this.opacity = 1 - (Date.now() - this.time_of_death) / 2000
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0, 255, 0, ' + this.opacity + ')'
            ctx.fillRect(this.x, this.y, this.height, this.width)
        } else if (this.dying) {
            this.dead = false
            this.y = (height - this.height - 200) / 2
            this.health = 1000
            this.opacity = 1
            this.dying = false
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
    constructor(x, y, id){
        this.pressed = false
        this.x = x
        this.y = y
        this.width = 300
        this.height = 20
        this.id = id
    }
    
    change(){
        if(this.id == 'clicker-dps' && (clicker_mode || store_mode)){
            dps_mode = true
            clicker_mode = false
            store_mode = false
        } else if (this.id == 'clicker-store' && (clicker_mode || dps_mode)){
            store_mode = true
            clicker_mode = false
            dps_mode = false
        } else {
            clicker_mode = true
            store_mode = false
            dps_mode = false
        }
    }

    draw(){
        if(clicker_mode && this.id == 'clicker-dps'){
            ctx.drawImage(to_battlefield, this.x, this.y)
        }
        if(store_mode && this.id == 'clicker-dps'){
            ctx.drawImage(to_battlefield, this.x, this.y)
        }
        if (dps_mode && this.id == 'clicker-dps'){
            ctx.drawImage(to_odd_stone, this.x, this.y)
        } 
        if (clicker_mode && this.id == 'clicker-store'){
            ctx.drawImage(to_store, this.x, this.y)
        } 
        if (store_mode && this.id == 'clicker-store'){
            ctx.drawImage(to_odd_stone, this.x, this.y)
        }
        if (dps_mode && this.id == 'clicker-store'){
            ctx.drawImage(to_store, this.x, this.y)
        } 
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
        if((mouseXPosition >= this.x && mouseXPosition <= this.x + this.width) && (mouseYPosition >= this.y && mouseYPosition < this.y + this.height)){
            return true
        }
        return false
    }
}

class Clicker{
    constructor(){
        this.width = 300
        this.height = 300
        this.x = ((window.innerWidth - this.width) / 2)
        this.y = (window.innerHeight - 300) / 2
        this.text = 'Click Me'
        this.pressed = false
        this.opacity = 0
        this.time_constructed = Date.now()
        this.down_scaled = false
        this.time_clicked = 0
        this.expanding = false
    }

    draw(){
        ctx.beginPath()
        if(this.down_scaled){
            this.down_scaled = false
            ctx.drawImage(click_button, this.x + 25, this.y + 25, 250, 250)
            this.expanding = true
        } else if (this.expanding){
            let time_change = (Date.now() - this.time_clicked) / 250
            ctx.drawImage(click_button, 
                (this.x + 25) - (25 * time_change), 
                (this.y + 25) - (25 * time_change),
                250 + (50 * time_change),
                250 + (50 * time_change)
                )
            if(time_change >= 1){
                this.expanding = false
            }
        } else {
            ctx.drawImage(click_button, this.x, this.y)
        }
        ctx.beginPath()
        ctx.font = "38px Arial"
        ctx.fillStyle = 'blue'
        this.plus_val = 140
        if(clicks >= 10){
            this.plus_val = 130
        } else if (clicks >= 100){
            this.plus_val = 120
        } else if (clicks >= 1000){
            this.plus_val = 110
        }
        ctx.fillText(clicks, this.x + this.plus_val, this.y - 60)
    }

    press(){
        if(!this.pressed && this.mouseOver() && !state.pressedMouse['zero']){
            this.pressed = true
            clicks += click_value
            total_clicks += click_value
            this.down_scaled = true
            this.time_clicked = Date.now()
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
        this.width = 300
        this.height = 30
        this.purchased = 0
        this.last_added_to_clicks = Date.now()
        this.pressed = false
        this.opacity = 0
    }

    show(){
        if(!this.shown && clicks >= upgrades.show_value[this.number]){
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
            ctx.fillText(upgrades.names[this.number] + ": " + upgrades.cost[this.number] + "              " + this.purchased * upgrades.click_value[this.number] + " clicks / second", this.x, this.y + 20, this.width)
            this.addClicks()
        }
        this.show()
        this.showDescriptionBox()
    }

    addClicks(){
        if(Date.now() - this.last_added_to_clicks > 1000 && this.purchased > 0){
            this.last_added_to_clicks = Date.now()
            clicks += upgrades.click_value[this.number] * this.purchased
        }
    }

    press(){
        if(!this.pressed && this.mouseOver() && !state.pressedMouse['zero'] && this.shown && clicks >= upgrades.cost[this.number]){
            this.pressed = true
            this.purchased += 1
            clicks -= upgrades.cost[this.number]
            upgrades.cost[this.number] += Math.floor(Math.pow(1.4, this.purchased))
        }
        if(state.pressedMouse['zero']){
            this.pressed = false
        }
    }

    showDescriptionBox(){
        if((mouse_move_x_position >= this.x && mouse_move_x_position <= this.x + this.width)
            && (mouse_move_y_position >= this.y && mouse_move_y_position < this.y + this.height)
            && this.shown){
            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.fillRect(mouse_move_x_position, mouse_move_y_position, 100, 100)
        }
    }

    mouseOver(){
        if((mouseXPosition >= this.x && mouseXPosition <= this.x + this.width) && (mouseYPosition >= this.y && mouseYPosition < this.y + this.height)){
            return true
        }
        return false
    }
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

//Detected mouse down
function onDown(event) {
    if(event.button == 0){
        state.pressedMouse['zero']= true
        mouseXPosition = event.clientX
        mouseYPosition = event.clientY
    }
}

//Detects mouse up
function onUp(event){
    if(event.button == 0){
        state.pressedMouse['zero']= false
    }
}

//Detects mouse move
function onMove(event){
    mouse_move_x_position = event.clientX
    mouse_move_y_position = event.clientY
}

//Adds event listener to detect key presses
window.addEventListener('keydown', keydown, false)
window.addEventListener('keyup', keyup, false)
window.addEventListener('mousedown', onDown, false)
window.addEventListener('mouseup', onUp, false)
window.addEventListener('mousemove', onMove, false)

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
        switch_array[1].press()
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
    switch_array[1].press()
    clicker_array[0].press()
    for(i = 0; i < upgrade_array.length; i++){
        upgrade_array[i].press()
        upgrade_array[i].addClicks()
    }
}

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
        let switch1 = new Switcher(canvas.width - 230, 20, 'clicker-dps')
        switch_array.push(switch1)
        switch1.draw()
        let switch2 = new Switcher(canvas.width - 230, 50, 'clicker-store')
        switch_array.push(switch2)
        switch2.draw()
    } else {
        switch_array[0].draw()
        switch_array[1].draw()
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

function draw_store(){
    console.log('Attempted to draw the store')
}

//Draw the state of the world
function draw(){
    ctx.fillStyle = '#5f5f5f'
    ctx.fillRect(0,0,width,height)
    if(dps_mode){
        draw_abls()
        draw_enemies()
    } else if (clicker_mode){
        draw_clicker()
        draw_upgrades()
    } else if (store_mode){
        draw_store()
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