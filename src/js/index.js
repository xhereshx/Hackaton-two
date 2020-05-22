'use strict';

const TILE_SIZE = 85;

class Pacman {
    constructor(left, top, stage) {
        this.left = left;
        this.top = top;
        this.maxLeft = stage.width;
        this.maxTop = stage.height;
        this.mouth = false;
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
    }

    appendPacman() {
        let pac = new Pacman(0, 0, this);
        pac.mount(this.element)
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
    }
}

let stage = new Stage(4, 5);
stage.mount(app);
