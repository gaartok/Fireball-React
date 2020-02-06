import Point from './Point';
require("p5/lib/p5");
require("p5/lib/addons/p5.sound");


class AliveObject {
  constructor(globals, type) {
    this.globals = globals;
    this.type = type;
    this.name = "AliveObject";
    this.action = this.globals.actions.ACTION_UNKNOWN;
    this.objCenter = new Point(0, 0);   // the object's center Point
    this.numFrames = new Array(this.globals.MAX_ACTIONS);
    this.imgIndex = 0;
    this.velocity = new Point(0, 0);
    this.minVelocity = new Point();
    this.maxVelocity = new Point();
    this.destination = new Point();               // where the unit is headed on the map

    this.moveBounds = new Array(4);
    this.moveBounds[this.globals.rectSides.LEFT]   = 0;
    this.moveBounds[this.globals.rectSides.RIGHT]  = this.globals.screenWidth;
    this.moveBounds[this.globals.rectSides.TOP]    = 0;
    this.moveBounds[this.globals.rectSides.BOTTOM] = this.globals.screenHeight;

    this.nextMoveTime = 0;
    this.health = 100;

    this.objRect = new Array(4);         // the object's position RECT

    this.size = new Array(this.globals.MAX_ACTIONS);
    this.halfSize = new Array(this.globals.MAX_ACTIONS);

    for (var count1 = 0; count1 < this.globals.MAX_ACTIONS; count1++)
    {
      this.size[count1] = new Point();
      this.halfSize[count1] = new Point();
    }

    this.initialize();
  }



  initialize() {
    for (var count1 = 0; count1 < this.globals.MAX_ACTIONS; count1++)
    {
      this.halfSize[count1].x = this.size[count1].x / 2;
      this.halfSize[count1].y = this.size[count1].y / 2;
    }

    this.calcObjRect();
  }


  newLevel(theLevel) {
    this.health = this.globals.MAX_HEALTH;
  }


  getHealth() {
    return this.health;
  }


  hit(damage) {
    if (this.health >= damage)
    {
      this.health = this.health - damage;
    }
    else
    {
      this.health = 0;
    }
  }


  isAlive() {
    if (this.action === this.globals.actions.ACTION_DEAD)
    {
      return false;
    }
    else
    {
      return true;
    }
  }


  getXSize() {
    return this.size[this.action].x;
  }


  getYSize() {
    return this.size[this.action].y;
  }


  getXPosition() {
    return this.objCenter.x;
  }


  getYPosition() {
    return this.objCenter.y;
  }



  checkForHit(xPos, yPos) {
   if ((xPos > this.objRect[this.globals.rectSides.LEFT]) && (xPos < this.objRect[this.globals.rectSides.RIGHT]) && (yPos > this.objRect[this.globals.rectSides.TOP]) && (yPos < this.objRect[this.globals.rectSides.BOTTOM]))
      return true;

   return false;
   }


  getObjCenter() {
    return this.objCenter;
  }


  calcObjRect() {
    this.objRect[this.globals.rectSides.LEFT]   = Math.floor(this.objCenter.x - this.halfSize[this.action].x);
    this.objRect[this.globals.rectSides.RIGHT]  = Math.floor(this.objCenter.x + this.halfSize[this.action].x);
    this.objRect[this.globals.rectSides.TOP]    = Math.floor(this.objCenter.y - this.halfSize[this.action].y);
    this.objRect[this.globals.rectSides.BOTTOM] = Math.floor(this.objCenter.y + this.halfSize[this.action].y);
  }


  setLocation(xDst, yDst) {
    this.objCenter.x = xDst;
    this.objCenter.y = yDst;
    this.calcObjRect();
    this.destination.x = xDst;
    this.destination.y = yDst;
  }



  getRect() {
     return this.objRect;
   }


  getNextFrame(){
    this.imgIndex += 1;
    if (this.imgIndex >= this.numFrames[this.action])
    {
      this.imgIndex = 0;
    }
  }


  move(collideableList) {
  }


  getType() {
    return this.type;
  }


  setDestination(xPos, yPos) {
    // velocity is zero in X and Y when coming from a dead stop
    if ((this.action === this.globals.actions.ACTION_IDLE_LEFT) || (this.action === this.globals.actions.ACTION_IDLE_RIGHT))
    {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

//    console.log("xPos = " + xPos, ", " + yPos);
//    console.log("objCenter 6 = " + this.objCenter.x, ", " + this.objCenter.y);
//    console.log("moveBounds 2 = " + this.moveBounds[this.globals.rectSides.RIGHT], ", " + this.moveBounds[this.globals.rectSides.BOTTOM]);

    if ((xPos <= this.moveBounds[this.globals.rectSides.RIGHT]) && (xPos >= this.moveBounds[this.globals.rectSides.LEFT]))
    {
      this.destination.x = xPos;
    }
    else
    {
//      console.log("destination.x out of bounds");
      if (xPos > this.moveBounds[this.globals.rectSides.RIGHT])
      {
        this.objCenter.x = this.moveBounds[this.globals.rectSides.RIGHT];
      }
      else
      {
        this.objCenter.x = this.moveBounds[this.globals.rectSides.LEFT];
      }
    }

    if ((yPos <= this.moveBounds[this.globals.rectSides.BOTTOM]) && (yPos >= this.moveBounds[this.globals.rectSides.TOP]))
    {
      this.destination.y = yPos;
    }
    else
    {
      if (yPos > this.moveBounds[this.globals.rectSides.BOTTOM])
      {
        this.objCenter.x = this.moveBounds[this.globals.rectSides.BOTTOM];
      }
      else
      {
        this.objCenter.y = this.moveBounds[this.globals.rectSides.TOP];
      }
    }

    if (this.objCenter.x < this.destination.x)
    {
      this.action = this.globals.actions.ACTION_WALK_RIGHT;
    }
    else if (this.objCenter.x > this.destination.x)
    {
      this.action = this.globals.actions.ACTION_WALK_LEFT;
    }

    this.destination.x = xPos;
    this.destination.y = yPos;
  }



  getDestination() {
    return this.destination;
  }


  draw() {
  }



  isOverlapped(testRect) {
    // it's easier to test if their NOT overlapped, and invert it
    return (!(testRect[this.globals.rectSides.RIGHT]  <= this.objRect[this.globals.rectSides.LEFT]   ||
              testRect[this.globals.rectSides.LEFT]   >= this.objRect[this.globals.rectSides.RIGHT]  ||
              testRect[this.globals.rectSides.TOP]    >= this.objRect[this.globals.rectSides.BOTTOM] ||
              testRect[this.globals.rectSides.BOTTOM] <= this.objRect[this.globals.rectSides.TOP]));
  }



  checkOverlapped(aliveList) {
    for (var count1 = 0; count1 < aliveList.length; count1++)
    {
      // skip over this object
      if ((aliveList[count1] !== this) && (aliveList[count1].name !== "Emitter"))
      {
        // if bounding rectangles overlap...
        if (this.isOverlapped(aliveList[count1].objRect))
        {
//          console.log("overlapped");
          return aliveList[count1];
        }

      }
    }

    return false;
  }

};


export default AliveObject;
