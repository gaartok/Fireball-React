import Globals from './Globals';
import AliveObject from './AliveObject';
import Emitter from './Emitter';
import Point from './Point';

let rockImgs = new Array(Globals.MAX_ACTIONS);


class Rock extends AliveObject {
  constructor(globals, widthScale, heightScale, startLocXMin, startLocXMax, startLocY) {
    // Call AliveObject's constructor
    super(globals, globals.itemTypes.TYPE_ROCK);

  var leftOrRight = this.globals.p5.random(0, 1);

  this.name = "Rock";

  this.action = this.globals.actions.ACTION_WALK_UP;
  this.drawLocation = new Point();
  this.bounceCount = 0;
  this.nextAccelTime = 0;

  this.minVelocity.x = 1 * widthScale;
  this.minVelocity.y = 1 * heightScale;
  this.maxVelocity.x = 1.2 * widthScale;
  this.maxVelocity.y = 8 * heightScale;

  this.acceleration = new Point();
  this.acceleration.x = 1 * widthScale;
  this.acceleration.y = 1 * heightScale;

  this.setLocation(Math.floor(this.globals.p5.random(startLocXMin, startLocXMax)), Math.floor(startLocY));

  if (leftOrRight < 0.5) {
//    this.setDestination(Math.floor(this.globals.p5.random(124, 214) * widthScale), this.globals.bounceYCoord);
    this.setDestination(0, this.globals.bounceYCoord);
  }
  else {
//    this.setDestination(Math.floor(this.globals.p5.random(426, 516) * widthScale), this.globals.bounceYCoord);
    this.setDestination(this.globals.screenWidth, this.globals.bounceYCoord);
  }

  this.velocity.y = (-1 * this.globals.p5.random(3, 5)) * this.globals.heightScale;


  if (this.objCenter.x < this.destination.x) {
    this.velocity.x = 4 * this.globals.widthScale;
  }
  else if (this.objCenter.x > this.destination.x) {
    this.velocity.x = -4 * this.globals.widthScale;
  }
  else {
    this.velocity.x = 0;
  }


  this.tail = new Emitter(this.globals, 10, this.globals.widthScale, this.globals.heightScale);
  this.tail.setSpeed(0.50, 0.2);
  this.tail.setEmits(1, 1);
  this.tail.setLife(10, 3);
  this.tail.setColors(34, 3, 37, 2);
  this.aimTail();

  this.numFrames[this.globals.actions.ACTION_WALK_UP]    = 3;
  this.size[this.globals.actions.ACTION_WALK_UP].x       = 8  * this.globals.widthScale;
  this.size[this.globals.actions.ACTION_WALK_UP].y       = 16 * this.globals.heightScale;

  this.numFrames[this.globals.actions.ACTION_WALK_DOWN]  = 3;
  this.size[this.globals.actions.ACTION_WALK_DOWN].x     = 8  * this.globals.widthScale;
  this.size[this.globals.actions.ACTION_WALK_DOWN].y     = 16 * this.globals.heightScale;

  this.numFrames[this.globals.actions.ACTION_WALK_LEFT]  = 3;
  this.size[this.globals.actions.ACTION_WALK_LEFT].x     = 16 * this.globals.widthScale;
  this.size[this.globals.actions.ACTION_WALK_LEFT].y     = 8  * this.globals.heightScale;

  this.numFrames[this.globals.actions.ACTION_WALK_RIGHT] = 3;
  this.size[this.globals.actions.ACTION_WALK_RIGHT].x    = 16 * this.globals.widthScale;
  this.size[this.globals.actions.ACTION_WALK_RIGHT].y    = 8  * this.globals.heightScale;

  rockImgs[this.globals.actions.ACTION_WALK_UP]    = [this.globals.images.RockUp1, this.globals.images.RockUp2, this.globals.images.RockUp3];
  rockImgs[this.globals.actions.ACTION_WALK_DOWN]  = [this.globals.images.RockDown1, this.globals.images.RockDown2, this.globals.images.RockDown3];
  rockImgs[this.globals.actions.ACTION_WALK_LEFT]  = [this.globals.images.RockLeft1, this.globals.images.RockLeft2, this.globals.images.RockLeft3];
  rockImgs[this.globals.actions.ACTION_WALK_RIGHT] = [this.globals.images.RockRight1, this.globals.images.RockRight2, this.globals.images.RockRight3];

  this.initialize();
}



aimTail() {
  let tailPos = new Array(4);

  switch (this.action) {
    case this.globals.actions.ACTION_WALK_RIGHT: {
      this.tail.setAngles(90, 5, 0, 5);     // left
      tailPos[this.globals.rectSides.LEFT] = this.objRect[this.globals.rectSides.LEFT] + 5;
      tailPos[this.globals.rectSides.RIGHT] = tailPos[this.globals.rectSides.LEFT];
      tailPos[this.globals.rectSides.TOP] = this.objRect[this.globals.rectSides.TOP];
      tailPos[this.globals.rectSides.BOTTOM] = this.objRect[this.globals.rectSides.BOTTOM];
      this.tail.setForce(-0.10, 0.0);
      break;
    }

    case this.globals.actions.ACTION_WALK_LEFT: {
      this.tail.setAngles(270, 10, 0, 0);   // right
      tailPos[this.globals.rectSides.LEFT] = this.objRect[this.globals.rectSides.RIGHT] - 5;
      tailPos[this.globals.rectSides.RIGHT] = tailPos[this.globals.rectSides.LEFT];
      tailPos[this.globals.rectSides.TOP] = this.objRect[this.globals.rectSides.TOP];
      tailPos[this.globals.rectSides.BOTTOM] = this.objRect[this.globals.rectSides.BOTTOM];
      this.tail.setForce(0.10, 0.0);
      break;
    }

    case this.globals.actions.ACTION_WALK_UP: {
      this.tail.setAngles(0, 5, 90, 5);     // down
      tailPos[this.globals.rectSides.LEFT] = this.objRect[this.globals.rectSides.LEFT];
      tailPos[this.globals.rectSides.RIGHT] = this.objRect[this.globals.rectSides.RIGHT];
      tailPos[this.globals.rectSides.TOP] = this.objRect[this.globals.rectSides.BOTTOM] - 5;
      tailPos[this.globals.rectSides.BOTTOM] = tailPos[this.globals.rectSides.TOP];
      this.tail.setForce(0.0, 0.10);
      break;
    }

    case this.globals.actions.ACTION_WALK_DOWN: {
      this.tail.setAngles(0, 5, 270, 5);    // up
      tailPos[this.globals.rectSides.LEFT] = this.objRect[this.globals.rectSides.LEFT];
      tailPos[this.globals.rectSides.RIGHT] = this.objRect[this.globals.rectSides.RIGHT];
      tailPos[this.globals.rectSides.TOP] = this.objRect[this.globals.rectSides.TOP] + 5;
      tailPos[this.globals.rectSides.BOTTOM] = tailPos[this.globals.rectSides.TOP];
      this.tail.setForce(0.0, -0.10);
      break;
    }

    default: {
      break;
    }

  }

  this.tail.setPosByRect(tailPos);
}




getNextFrame() {
  if (this.velocity.x === 0) {
    if (this.velocity.y > 0) {
      this.action = this.globals.actions.ACTION_WALK_DOWN;
    }
    else {
      this.action = this.globals.actions.ACTION_WALK_UP;
    }
  }
  else if (this.velocity.x > 0) {
    if (this.velocity.y >= 3) {
      this.action = this.globals.actions.ACTION_WALK_DOWN;
    }
    else if (this.velocity.y <= -3) {
      this.action = this.globals.actions.ACTION_WALK_UP;
    }
    else {
      this.action = this.globals.actions.ACTION_WALK_RIGHT;
    }
  }
  else {
    if (this.velocity.y >= 3) {
      this.action = this.globals.actions.ACTION_WALK_DOWN;
    }
    else if (this.velocity.y <= -3) {
      this.action = this.globals.actions.ACTION_WALK_UP;
    }
    else {
      this.action = this.globals.actions.ACTION_WALK_LEFT;
    }
  }

  this.imgIndex += 1;
  if (this.imgIndex >= this.numFrames[this.action]) {
    this.imgIndex = 0;
  }

//  debugTextOut(color('black'), "new action = " + this.action);
  this.aimTail();
}



getDirectionMoving() {
  var direction = new Point();

  if (this.objCenter.x < this.destination.x) {
    direction.x = 1;         // moving to the right
  }
  else if (this.objCenter.x > this.destination.x) {
    direction.x = -1;        // moving to the left
  }
  else {
    direction.x = 0;         // at destination X location
  }

  if (this.objCenter.y < this.destination.y) {
    direction.y = 1;         // moving down
  }
  else if (this.objCenter.y > this.destination.y) {
    direction.y = -1;        // moving up
  }
  else {
    direction.y = 0;         // at destination Y location
  }

  return direction;
}



update(collideableList) {
  let overlappedObj;
  let timeNow = Date.now();

  if (this.action === this.globals.actions.ACTION_DEAD) {
    return;
  }

  this.tail.update();

  if (timeNow < this.nextMoveTime) {
    return;   // not time to move yet
  }

  this.nextMoveTime = timeNow + 20;

  if (++this.imgIndex >= this.numFrames[this.action]) {
    this.getNextFrame();
    this.imgIndex = 0;
  }

  var direction = this.getDirectionMoving();

  if (timeNow > this.nextAccelTime) {
    if (direction.x === 1) {
      this.velocity.x += this.acceleration.x;
    }
    else if (direction.x === -1) {
      this.velocity.x -= this.acceleration.x;
    }
    else {
      this.velocity.x = 0;
    }

    if (direction.y === 1) {
      this.velocity.y += this.acceleration.y;
    }
    else if (direction.y === -1) {
      this.velocity.y -= this.acceleration.y;
    }

    if (this.velocity.x > this.maxVelocity.x) {
      this.velocity.x = this.maxVelocity.x;
    }
    else if (this.velocity.x < -this.maxVelocity.x) {
      this.velocity.x = -this.maxVelocity.x;
    }

    if (this.velocity.y > this.maxVelocity.y) {
      this.velocity.y = this.maxVelocity.y;
    }
    else if (this.velocity.y < -this.maxVelocity.y) {
      this.velocity.y = -this.maxVelocity.y;
    }

    this.nextAccelTime = timeNow + 200;
  }

  // move the object to its new position
  this.objCenter.x += this.velocity.x;
  this.objCenter.y += this.velocity.y;

  // have we arrived at our destination?
  // (Bouncing off the ground)
  if (this.objCenter.y >= this.destination.y) {
    this.objCenter.y = this.destination.y - 1;
    if (this.bounceCount === 0) {
      if (this.velocity.x < 0) {
        this.setDestination(0, this.globals.bounceYCoord);
      }
      else if (this.velocity.x > 0) {
        this.setDestination(this.globals.screenWidth, this.globals.bounceYCoord);
      }
      else {
        if (this.objCenter.x < this.globals.screenWidth / 2) {
          this.setDestination(0, this.globals.bounceYCoord);
        }
        else {
          this.setDestination(this.globals.screenWidth, this.globals.bounceYCoord);
        }
      }
    }

    this.bounceCount++;

    this.velocity.y = -(this.velocity.y / 8);
    this.maxVelocity.y = (6 - this.bounceCount) * this.globals.heightScale;

    if (this.velocity.y > -this.maxVelocity.y) {
      this.velocity.y = -this.maxVelocity.y;
    }
  }

  if (this.objCenter.x > this.moveBounds[this.globals.rectSides.RIGHT]) {
    this.objCenter.x = this.moveBounds[this.globals.rectSides.RIGHT];
  }
  else if (this.objCenter.x < this.moveBounds[this.globals.rectSides.LEFT]) {
    this.objCenter.x = this.moveBounds[this.globals.rectSides.LEFT];
  }

  this.calcObjRect();

  // check for collisions
  overlappedObj = this.checkOverlapped(collideableList);
  if (overlappedObj) {
    switch (overlappedObj.getType()) {
      case this.globals.itemTypes.TYPE_HOUSE: {
        if (overlappedObj.getHealth() > 0) {
          this.globals.playerScore -= 10;
          overlappedObj.hit(25);
        }

//        console.log("Hit HOUSE");
        this.action = this.globals.actions.ACTION_DEAD;
        break;
      }

      case this.globals.itemTypes.TYPE_BASKET: {
        if (overlappedObj.getWaterLevel() > 0) {
          overlappedObj.hit(10);
          this.globals.playerScore += 25;
          this.action = this.globals.actions.ACTION_DEAD;
        }
//        console.log("Hit BASKET");
        break;
      }

      case this.globals.itemTypes.TYPE_HERO: {
        overlappedObj.hit(10);
        this.globals.playerScore -= 15;
//        console.log("Hit HERO");
        this.action = this.globals.actions.ACTION_DEAD;
        break;
      }

      default: {
        break;
      }
    }
  }

}


render() {
/*
  debugTextOut(color('red'), "Rock:");
  debugTextOut(color('black'), "action = " + this.action);
  debugTextOut(color('black'), "bounceCount = " + this.bounceCount);
  debugTextOut(color('black'), "maxVelocity = " + this.maxVelocity.x + ", " + this.maxVelocity.y);
  debugTextOut(color('black'), "acceleration= " + this.acceleration.x + ", " + this.acceleration.y);
//  debugTextOut(color('black'), "objRect     = " + this.objRect[this.globals.rectSides.LEFT] + ", " + this.objRect[this.globals.rectSides.TOP]);
//  debugTextOut(color('black'), "objCenter   = " + this.objCenter.x + ", " + this.objCenter.y);
//  debugTextOut(color('black'), "destination = " + this.destination.x + ", " + this.destination.y);
  debugTextOut(color('black'), "velocity    = " + this.velocity.x + ", " + this.velocity.y);
//  debugTextOut(color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
//  debugTextOut(color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
//  debugTextOut(color('black'), "moveBounds = " + this.moveBounds[this.globals.rectSides.LEFT] + ", " + this.moveBounds[this.globals.rectSides.RIGHT] + ", " + this.moveBounds[this.globals.rectSides.TOP] + ", " + this.moveBounds[this.globals.rectSides.BOTTOM]);
*/


/*
  // Display the collision box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(3);
  rect(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.RIGHT] - this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.BOTTOM] - this.objRect[this.globals.rectSides.TOP]);
*/

/*
  // Display the destination marker
  fill(255, 204, 100);
  noStroke();
  circle(this.destination.x, this.destination.y, 30);
*/

  if (this.action !== this.globals.actions.ACTION_DEAD) {
    this.globals.p5.image(rockImgs[this.action][this.imgIndex], this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.TOP], this.size[this.action].x, this.size[this.action].y);
    this.tail.render();
  }
}


}

export default Rock;
