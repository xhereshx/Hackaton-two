'use strict';


let pacman = document.querySelector('.entity--pac'); 
let xpos = 0;
let left = 0;
const TILE_SIZE = 85;
document.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowRight'){
        xpos += TILE_SIZE;
        left += TILE_SIZE;
    }
    console.log(pacman.style);
    pacman.style.backgroundPositionX = `${xpos}px`;
    pacman.style.left = `${left}px`;
});



class Pacman {
    constructor(xpos,mouth){
        this.xpos = xpos;
        this.mouth = mouth;
    }

    moveRight(){
    xpos += TILE_SIZE;
    }

    update(){
        pacman.style.left = `${left}px`;
    }
}