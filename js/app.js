/*********************************************************************************
* Front Web Developer Nanodegree Project 3 Arcade Frogger Fame
* app.js 
* contains object definitions and methods for the game
* @author Siska Ko
* 25-Jan-2015
**********************************************************************************/

"use strict";

//Constants that are used in this app
var CANVAS_WIDTH = 505,
    CANVAS_HEIGHT = 606,
    CELL_HEIGHT = 83,
    CELL_WIDTH = 101,
    CELL_PADDING = 19, //the character has some padding so it doesn't touch the grid's line
    BUG_START_Y = 3 * CELL_HEIGHT, //the Y value where the bug starts to appear
    WATER_START_Y = 1 * CELL_HEIGHT; //the Y value where the water appears


//********ENEMY***************************************************************************************/

/**
 * Creates an instance of Enemy
 *
 * @constructor
 * @param {number} bugNumber The identifier of each bug because a game have multiple bugs
 */
var Enemy = function(bugNumber) {
    this.sprite = 'images/enemy-bug.png';
    this.initialX = -100; //start at negative x value so when it animates it appears head first on the screen when it starts
    this.initialY = BUG_START_Y-CELL_PADDING; //based on different bug number, different bug appears on different row
    this.speed = bugNumber*150; //so different bug has different speed
    this.x = this.initialX;
    this.y = this.initialY;
};

/**
 * Update the enemy's position
 *
 * @param {number} dt time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for all computers.
    
    var speed = this.speed*dt,
        currentX = this.x,
        currentY = this.y;

    //when the bug reaches at  the end of the canvas
    //restarts from the beginning of the row
    if (currentX < CANVAS_WIDTH) {
      var newX = currentX + speed;
      this.x = newX;
    } else {
      this.x = this.initialX;

      //move the bug one row up until it reaches the water
      //then just starts over from bug's starting point
      if (currentY > WATER_START_Y-CELL_PADDING) {
        this.y = currentY-CELL_HEIGHT;
      } else {
        this.y = this.initialY;
      }
    }
};

/**
 * Draw the enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//************PLAYER*************************************************************************************************/
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * Creates an instance of Player
 *
 * @constructor
 */
var Player = function() {
    this.playerImg = 'images/char-princess-girl.png';
    this.initialX = 2*CELL_WIDTH; //put in the middle of the screen
    this.initialY = (5*CELL_HEIGHT)-CELL_PADDING; //put in the bottom of the screen with some padding
    this.x = this.initialX;
    this.y = this.initialY;
};

/**
 * Updates player's instance as the screen refreshes
 *
 */
Player.prototype.update = function(dt) {
    //console.log("calling player update function currentX: " + this.x);
    //at this point there is nothing to update
};

/**
 * Draw player on the screen
 *
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.playerImg), this.x, this.y);
};

/**
 * Handle the keyboard input of the player
 *
 * @param {string} what kinds of key the user pushes: up, down, right, or left
 */
Player.prototype.handleInput = function(key) {
    
    var currentX = this.x,
        currentY = this.y,
        newX = currentX,
        newY = currentY,
        error = false;

    if (key=='up') {
        newY = currentY-CELL_HEIGHT;
    } else if (key == 'down') {
        newY = currentY+CELL_HEIGHT;
    } else if (key == 'left') { 
        newX = currentX-CELL_WIDTH;
    } else if (key == 'right') {
        newX = currentX+CELL_WIDTH;
    }

    //restrict the guy so he cannot go outside canvas
    if (newX < 0) {
        alertify.error('You have gone too far left. You die!');
        error=true;
    }

    //restrict the guy so he cannot go outside canvas' width
    if (newX >= CANVAS_WIDTH) {
        alertify.error('You have gone too far right. You die!');
        error=true;
    }

    if (newY < (WATER_START_Y-CELL_PADDING)) {
        alertify.error('You drown! And you die.');
        error=true;
    }

    //restrict the guy so he cannot go lower than his lowest position
    if (newY > this.initialY) {
        alertify.error('You have gone too low. You die!');
        error=true;

    }

    if (error===true) {
        this.x = this.initialX;
        this.y = this.initialY;
    } else {
        this.x = newX;
        this.y = newY;
    }
};

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


/*************GOAL ITEM *************************************************************************************/

/**
 * Creates an instance of Goal item 
 *
 * @constructor
 */
var Goal = function() {
    this.goalImg = 'images/Star.png';
    this.reset();
};

/**
 * Draw goal on the screen 
 *
 */
Goal.prototype.render = function() {
    //console.log("calling enemy render function x position: "+ this.x + " y position: "+ this.y);
    ctx.drawImage(Resources.get(this.goalImg), this.x, this.y);
};

/**
 * Restore goal to an initial random position
 *
 */
Goal.prototype.reset = function() {
    var randomXMultiplier = Math.floor((Math.random() * 5)),//random generator for number between 0 - 5 for the amount of columns
        randomYMultiplier = Math.floor((Math.random() * 3)+1); //random generator for number between 1 - 3 for the amount of rows
    this.x = randomXMultiplier*CELL_WIDTH; //assign random initial x 
    this.y = (randomYMultiplier*CELL_HEIGHT) - CELL_PADDING; //assign random initial y
};


// Instantiate objects
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//create 3 enemies
for (var i=1; i<4; i++) {
    allEnemies.push(new Enemy(i));
}


// Place the player object in a variable called player
var player = new Player();

// Player the goal object in a variable called goal
var goal = new Goal();
