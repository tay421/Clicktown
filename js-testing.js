var canvas = document.getElementById('canvas')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

var ctx = canvas.getContext('2d')

// ctx.fillStyle = 'red'
// ctx.fillRect(100, 100, 100, 100)
// ctx.fillStyle = 'blue'
// ctx.fillRect(200, 200, 100, 100)
// ctx.fillStyle = 'green'
// ctx.fillRect(500, 100, 100, 100)

class Rectangle {
    constructor(x, y, rheight, rwidth, number, color = 'red'){
        //this.state = state
        this.height = rheight
        this.width = rwidth
        this.x = x
        this.y = y
        this.number = number
        this.color = color
        this.transitioning = false
        this.pressed_color = 'blue'
        this.pressed = false
    }
    drawRec() {
        if(this.pressed){
            ctx.fillStyle = 'blue'
            ctx.fillRect(this.x, this.y, this.height, this.width)
        } else {
            ctx.fillStyle = 'red'
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
}

var rect_array = new Array()

for(i = 0; i < 2; i++){
    var r = new Rectangle(50 + (10 * i),  100, 50, 50, i, 'red')
    rect_array.push(r)
    r.drawRec()
}

rect_array[0].pressed = true

for(i = 0; i < rect_array.length; i++){
    rect_array[i].drawRec()
}

ctx.fillStyle = 'blue'
ctx.fillRect(200, 200, 100, 100)