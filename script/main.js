'use strict';

class Obstacle {
  constructor(x, height, rotated, width) {
    this.x = x;
    this.height = height;
    this.rotated = rotated;
    //this.width = width;
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
    }

    init() {
      const gameContainer = document.querySelector('.game-container');

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

    animateGame() {
      this.scrollLeftOffset += 10;
      const screenContainer = document.querySelector('.screen-container'),
            player = document.querySelector('.player');

      screenContainer.scrollLeft = this.scrollLeftOffset;
      player.style.left = `${this.scrollLeftOffset}px`;

      if (this.scrollLeftOffset !== this.length) {
        this.animationFrame = requestAnimationFrame(this.animateGame.bind(this));
      }
    }
  }

  const level = new Level();
  level.init();
});