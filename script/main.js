'use strict';

class Obstacle {
  constructor(x, height, rotated, width) {
    this.x = +x;
    this.height = +height;
    this.rotated = rotated;
    this.width = +width;
    this.y = this.rotated !== "false" ? 0 : window.innerHeight - +this.height - 77;
  }
}

class Player {
  constructor() {
    this.x = 0;
    this.y = 500;
    this.width = 50;
    this.height = 50;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  class Level {
    constructor(lyrics, obstacles, speed, length) {
      this.lyrics = [];
      this.obstacles = [];
      this.speed = 1;
      this.animationFrame = null;
      this.scrollLeftOffset = 0;
      this.length = 10000;
      this.player = new Player();
    }

    async init() {
      const gameContainer = document.querySelector('.game-container');

      let data = await this.getData('./db/test.json');

      data.forEach((item) => {
        this.obstacles.push(new Obstacle(item.x, item.height, item.rotated, item.width));
      });

      this.renderObstacles();

      document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          if (this.animationFrame === null) {
            this.animationFrame = requestAnimationFrame(this.animateGame.bind(this));
          } else {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
          }
        }
      });
    }

    renderObstacles() {
      this.obstacles.forEach((item) => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${item.x}px`;
        div.style.width = `${item.width}px`;
        div.style.height = `${item.height}px`;
        div.style.backgroundColor = 'red';
        div.style.top = `${item.y}px`;

        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(div);
      });
    }

    async getData(url) {
  
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error (`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
      }
    
      return await response.json();    
    };
    

    animateGame() {
      this.scrollLeftOffset += 10;
      const screenContainer = document.querySelector('.screen-container'),
            playerDiv = document.querySelector('.player');

      screenContainer.scrollLeft = this.scrollLeftOffset;
      playerDiv.style.left = `${this.scrollLeftOffset}px`;

      this.player.x = this.scrollLeftOffset + this.player.width; 

      const filteredArray = this.obstacles.filter((item) => +item.x 
      + +item.width> this.player.x + this.player.width);

      let collision = false;
      for (let item of filteredArray) {
        if (this.isCollide(item, this.player)) {
          collision = true;
          break;
        }
      }

      if (collision) {
        console.log("БУХ!");
      }

      if (this.scrollLeftOffset !== this.length) {
        this.animationFrame = requestAnimationFrame(this.animateGame.bind(this));
      }
    }

    isCollide(a, b) {
      return !(
          ((a.y + a.height) < (b.y)) ||
          (a.y > (b.y + b.height)) ||
          ((a.x + a.width) < b.x) ||
          (a.x > (b.x + b.width))
      );
    }
  }

  const level = new Level();
  level.init();
});