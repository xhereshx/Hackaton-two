'use strict';

const TILE_SIZE = 85;

class Entity {
    constructor(positionX, positionY, type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.type = type;
    }

    render() {
        const entity = document.createElement('div');
        entity.className = `entity entity--${this.type}`;
        return entity
    }

    mount(parent) {
        this.element = this.render();
        parent.appendChild(this.element);
        this.update();
    }

    unmount() {
        this.element.remove();
    }

    update() {
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
        this.stage = stage;
        this.isAlive = true;
    }

    mouthSwitch() {
        this.mouth = !this.mouth;
    }

    move(direction) {
        if (this.isAlive) {

            this.face = direction;
            let x = this.left;
            let y = this.top
            if (this.face === "up") {
                if (this.top !== 0) {
                    y -= 1;
                }
            } else if (this.face === "down") {
                if (this.top !== this.maxTop) {
                    y += 1;
                }
            } else if (this.face === "left") {
                if (this.left !== 0) {
                    x -= 1;
                }
            } else if (this.face === "right") {
                if (this.left !== this.maxLeft) {
                    x += 1;
                }
            }

            let collision = this.stage.collisionDetection(x, y);
            if (!collision || collision.type !== "wall") {
                this.left = x;
                this.top = y;
                if (collision?.type === "apple") {
                    this.stage.score += 1;
                    this.stage.removeEntity(collision);
                    this.stage.update();
                    
                } else if (collision?.type === "bomb") {
                    let chanceToDie = Math.floor(Math.random() * 2);
                    if (chanceToDie) {
                        this.isAlive = false;
                    }
                    this.stage.removeEntity(collision);
                }
            }
            this.mouthSwitch();
            this.update();
        }
    }

    render() {
        const pac = document.createElement('div');

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

        this.element.className = this.isAlive ?
            "entity entity--pac pacboy-active-light" :
            "entity entity--tomb";
    }
}

const app = document.querySelector('#app')

class Stage {
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.entities = [];
        this.score = 0;
        this.data = data;
    }
    
    removeEntity(entity) {
        const idx = this.entities.indexOf(entity);
        this.entities.splice(idx, 1);
        entity.unmount();
    }

    appendPacman() {
        let pac = new Pacman(0, 0, this);
        pac.mount(this.element)

    }
    appendEntity(x, y, type) {
        let entity = new Entity(x, y, type);
        entity.mount(this.element)
        this.entities.push(entity);
    }

    render() {
        const stage = document.createElement('div');
        stage.className = "container";
        stage.innerHTML = `<div class="score-Container">Score: <span class="score">0</span></div>`
        return stage;
    }

    createEntities() {
        this.data?.apples?.forEach(apple => {
            this.appendEntity(apple.x, apple.y, "apple");
        })
        this.data?.bombs?.forEach(bomb => {
            this.appendEntity(bomb.x, bomb.y, "bomb");
        })
        this.data?.walls?.forEach(wall => {
            this.appendEntity(wall.x, wall.y, "wall");
        })
    }

    mount(parent) {
        this.element = this.render();
        parent.appendChild(this.element);
        this.appendPacman();
        this.createEntities();
    }
    collisionDetection(x, y) {
        let StorageItemElm = null;
        this.entities.forEach((item) => {
            if (x === item.positionX && y === item.positionY) {
                StorageItemElm = item;
            }
        })
        return StorageItemElm;
    }

    update(){
        let score = this.element.querySelector('.score');
        score.textContent = this.score;
        console.log();
    }
}

let stageWidth = 11;
let stageHeight = 6;

fetch(`http://bootcamp.podlomar.org/api/pacman?width=${stageWidth +1}&height=${stageHeight +1}`)
    .then((res) => res.json())
    .then((json) => {
        console.log(json)
        let stage = new Stage(stageWidth, stageHeight, json);
        stage.mount(app);

    })
