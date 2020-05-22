'use strict';

const TILE_SIZE = 85;

class Entity{
    constructor(positionX,positionY,type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.type = type;
    }

    render(){
        const entity = document.createElement('div');
        entity.className = `entity entity--${this.type}`;  
        return entity 
    }

    mount(parent){
        this.element = this.render();
        parent.appendChild(this.element);
        this.update();
    }
    update(){
        this.element.style.left = `${this.positionX * TILE_SIZE}px`;
        this.element.style.top = `${this.positionY * TILE_SIZE}px`;
    }
}

class Pacman {
    constructor(left, top, stage) {
        this.left = left;
        this.top = top;
        this.maxLeft = stage.width;
        this.maxTop = stage.height;
        this.mouth = false;
        this.collisionDetection = stage.collisionDetection;
    }

    mouthSwitch() {
        this.mouth = !this.mouth;
    }

    move(direction) {
        this.face = direction;
        if (this.face === "up") {
            if (this.top !== 0) {
                this.top -= 1;
            }
        } else if (this.face === "down") {
            if (this.top !== this.maxTop) {
                this.top += 1;
            }
        } else if (this.face === "left") {
            if (this.left !== 0) {
                this.left -= 1;
            }
        } else if (this.face === "right") {
            if (this.left !== this.maxLeft) {
                this.left += 1;
            }
        }
        //this.collisionDetection(this.left,this.top);
        this.mouthSwitch();
        this.update();

    }

    render() {
        const pac = document.createElement('div');
        pac.className = "entity entity--pac pacboy-active-light";

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.move("right")
            } else if (event.key === 'ArrowLeft') {
                this.move("left")
            } else if (event.key === 'ArrowUp') {
                this.move("up")
            } else if (event.key === 'ArrowDown') {
                this.move("down")
            }
        });
        return pac;
    }

    mount(parent) {
        this.element = this.render();
        this.update();
        parent.appendChild(this.element);
    }

    update() {
        this.element.style.left = `${this.left * TILE_SIZE}px`;
        this.element.style.top = `${this.top * TILE_SIZE}px`;
        if (this.face === "right") {
            this.element.style.backgroundPositionY = `0px`;
        } else if (this.face === "left") {
            this.element.style.backgroundPositionY = `${TILE_SIZE * 3}px`;
        } else if (this.face === "down") {
            this.element.style.backgroundPositionY = `${TILE_SIZE * 2}px`;
        } else if (this.face === "up") {
            this.element.style.backgroundPositionY = `${TILE_SIZE}px`;
        }

        if (this.mouth) {
            this.element.style.backgroundPositionX = `0px`;
        } else {
            this.element.style.backgroundPositionX = `${TILE_SIZE}px`;
        }
    }
}

const app = document.querySelector('#app')

class Stage {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.entities = [];
    }

    appendPacman() {
        let pac = new Pacman(0, 0, this);
        pac.mount(this.element)
        
    }
    appendEntity(x,y,type) {
        let entity = new Entity(x, y, type);
        entity.mount(this.element)
        this.entities.push(entity);
        console.log(this.entities);
        
    }

    render() {
        const stage = document.createElement('div');
        stage.className = "container";
        return stage;
    }

    mount(parent) {
        this.element = this.render();
        parent.appendChild(this.element);
        this.appendPacman();
        this.appendEntity(3,2,'wall');

    }
    collisionDetection(x,y){ console.log('here');
                        let StorageItemElm = null;
        this.entities.forEach((item) => {
            if(x === item.positionX && y === item.positionY) {
            StorageItemElm = item.element
        } 

        }
       
        )
        return StorageItemElm
    }

}

let stage = new Stage(4, 5);
stage.mount(app);



