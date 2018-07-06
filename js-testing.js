var locked = false

function animateSomething(){
    if(!locked){
        locked = true
        setTimeout(unlock, 1000)
    }
}

function unlock(){
    locked = false
}

function loop(){
    animateSomething()
    console.log(locked)
    window.requestAnimationFrame(loop)
}

loop()