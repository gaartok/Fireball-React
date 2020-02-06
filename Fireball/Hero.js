import Globals from './Globals';
import AliveObject from './AliveObject';

let heroImgs = new Array(Globals.MAX_ACTIONS);


class Hero extends AliveObject {
  constructor(globals) {
    // Call AliveObject's constructor
    super(globals, globals.itemTypes.TYPE_HERO);

    this.name = "Hero";

    this.movementSpeed = 3 * this.globals.widthScale;

    heroImgs[this.globals.actions.ACTION_IDLE_LEFT]  = [this.globals.images.HeroLeft1];
    heroImgs[this.globals.actions.ACTION_IDLE_RIGHT] = [this.globals.images.HeroRight1];
    heroImgs[this.globals.actions.ACTION_WALK_LEFT]  = [this.globals.images.HeroLeft1, this.globals.images.HeroLeft2, this.globals.images.HeroLeft3, this.globals.images.HeroLeft4];
    heroImgs[this.globals.actions.ACTION_WALK_RIGHT] = [this.globals.images.HeroRight1, this.globals.images.HeroRight2, this.globals.images.HeroRight3, this.globals.images.HeroRight4];

    this.action = this.globals.actions.ACTION_IDLE_RIGHT;

    this.ouchSounds =
    [
      this.globals.sounds.AAAH,
      this.globals.sounds.ARGH,
      this.globals.sounds.AGONY,
      this.globals.sounds.AHHHHHHH,
      this.globals.sounds.BONK,
      this.globals.sounds.JIBBERISH,
      this.globals.sounds.KINISON,
      this.globals.sounds.KOOK,
      this.globals.sounds.MWPUNCH,
      this.globals.sounds.NI,
      this.globals.sounds.OUCH,
      this.globals.sounds.POP,
      this.globals.sounds.POP1,
      this.globals.sounds.POP2,
      this.globals.sounds.SCREAM,
      this.globals.sounds.WOOW1,
      this.globals.sounds.YELLING
    ];

    this.numFrames[this.globals.actions.ACTION_IDLE_LEFT]  = 1;
    this.size[this.globals.actions.ACTION_IDLE_LEFT].x     = 16 * this.globals.widthScale;
    this.size[this.globals.actions.ACTION_IDLE_LEFT].y     = 32 * this.globals.heightScale;

    this.numFrames[this.globals.actions.ACTION_IDLE_RIGHT] = 1;
    this.size[this.globals.actions.ACTION_IDLE_RIGHT].x    = 16 * this.globals.widthScale;
    this.size[this.globals.actions.ACTION_IDLE_RIGHT].y    = 32 * this.globals.heightScale;

    this.numFrames[this.globals.actions.ACTION_WALK_LEFT]  = 4;
    this.size[this.globals.actions.ACTION_WALK_LEFT].x     = 16 * this.globals.widthScale;
    this.size[this.globals.actions.ACTION_WALK_LEFT].y     = 32 * this.globals.heightScale;

    this.numFrames[this.globals.actions.ACTION_WALK_RIGHT] = 4;
    this.size[this.globals.actions.ACTION_WALK_RIGHT].x    = 16 * this.globals.widthScale;
    this.size[this.globals.actions.ACTION_WALK_RIGHT].y    = 32 * this.globals.heightScale;

    this.setLocation(this.globals.screenWidth / 2, this.globals.screenHeight - (this.size[this.action].y / 2));
    this.initialize();

    this.moveBasket();

    this.moveBounds[this.globals.rectSides.LEFT]  = (32 * this.globals.widthScale) + this.globals.basket.getXSize();                // 32 = width of house
    this.moveBounds[this.globals.rectSides.RIGHT] = this.globals.screenWidth - (32 * this.globals.widthScale) - this.globals.basket.getXSize();
  }

// inherit from AliveObject
//Hero.prototype = new AliveObject(itemTypes.TYPE_HERO);



  newLevel(theLevel) {
      AliveObject.prototype.newLevel.call(this, theLevel);
      this.setLocation(this.globals.screenWidth / 2, this.globals.screenHeight - (this.size[this.action].y / 2));
      this.moveBasket();
    }


  playRandomOuchSound() {
      var randOuch = Math.floor(this.globals.p5.random(0, this.ouchSounds.length));
      this.ouchSounds[randOuch].play();
    }



  hit(damage) {
    AliveObject.prototype.hit.call(this, damage);
    this.playRandomOuchSound();
    }



  keyPressed(keyCode) {
    if (keyCode === this.globals.p5.RIGHT_ARROW)
    {
    }

    if (keyCode === this.globals.p5.LEFT_ARROW)
    {
    }
  }


  keyReleased(keyCode) {
    if (keyCode === this.globals.p5.RIGHT_ARROW)
    {
    }

    if (keyCode === this.globals.p5.LEFT_ARROW)
    {
    }
  }


  drawHealthLevel() {
    let healthHeight = this.size[this.action].y * (this.health / 100);
    let healthWidth = 5 * this.globals.widthScale;

    this.globals.p5.noStroke();

    if ((this.action === this.globals.actions.ACTION_WALK_LEFT) || (this.action === this.globals.actions.ACTION_IDLE_LEFT))
    {
      // Drop the top area red
      this.globals.p5.fill(this.globals.p5.color('red'));
      this.globals.p5.rect(this.objRect[this.globals.rectSides.RIGHT],
          this.objRect[this.globals.rectSides.TOP],
          healthWidth,
          this.size[this.action].y - healthHeight);

      // Drop the bottom area green
      this.globals.p5.fill(this.globals.p5.color('green'));
      this.globals.p5.rect(this.objRect[this.globals.rectSides.RIGHT],
                      this.objRect[this.globals.rectSides.BOTTOM] - healthHeight,
                      healthWidth,
                      healthHeight);
    }
    else if ((this.action === this.globals.actions.ACTION_WALK_RIGHT) || (this.action === this.globals.actions.ACTION_IDLE_RIGHT))
    {
      // Drop the top area red
      this.globals.p5.fill(this.globals.p5.color('red'));
      this.globals.p5.rect(this.objRect[this.globals.rectSides.LEFT] - healthWidth,
                      this.objRect[this.globals.rectSides.TOP],
                      healthWidth,
                      this.size[this.action].y - healthHeight);

      // Drop the bottom area green
      this.globals.p5.fill(this.globals.p5.color('green'));
      this.globals.p5.rect(this.objRect[this.globals.rectSides.LEFT] - healthWidth,
                      this.objRect[this.globals.rectSides.BOTTOM] - healthHeight,
                      healthWidth,
                      healthHeight);
    }

  }



  update() {
    let timeNow = Date.now();

    if (timeNow < this.nextMoveTime)
    {
      return;   // not time to move yet
    }

    if (this.globals.p5.keyIsDown(this.globals.p5.RIGHT_ARROW))
    {
      if (!this.globals.p5.keyIsDown(this.globals.p5.LEFT_ARROW))
      {
        this.objCenter.x += this.movementSpeed;
        this.setDestination(this.objCenter.x + this.movementSpeed, this.objCenter.y);
      }
    }
    else if (this.globals.p5.keyIsDown(this.globals.p5.LEFT_ARROW))
    {
      if (!this.globals.p5.keyIsDown(this.globals.p5.RIGHT_ARROW))
      {
        this.objCenter.x -= this.movementSpeed;
        this.setDestination(this.objCenter.x - this.movementSpeed, this.objCenter.y);
      }
    }
    else
    {
      if (this.action === this.globals.actions.ACTION_WALK_RIGHT)
      {
        this.action = this.globals.actions.ACTION_IDLE_RIGHT;
      }
      else if (this.action === this.globals.actions.ACTION_WALK_LEFT)
      {
        this.action = this.globals.actions.ACTION_IDLE_LEFT;
      }
    }

    if (++this.imgIndex >= this.numFrames[this.action])
    {
      this.getNextFrame();
      this.imgIndex = 0;
    }

    if (this.objCenter.x > this.moveBounds[this.globals.rectSides.RIGHT])
    {
      this.objCenter.x = this.moveBounds[this.globals.rectSides.RIGHT];
    }
    else if (this.objCenter.x < this.moveBounds[this.globals.rectSides.LEFT])
    {
      this.objCenter.x = this.moveBounds[this.globals.rectSides.LEFT];
    }

    this.calcObjRect();

    this.moveBasket();
  }




  moveBasket() {
    if ((this.action === this.globals.actions.ACTION_IDLE_LEFT) || (this.action === this.globals.actions.ACTION_WALK_LEFT))
      this.globals.basket.setLocation(this.objRect[this.globals.rectSides.LEFT] - (this.globals.basket.getXSize() / 2), this.objCenter.y);
    else
      this.globals.basket.setLocation(this.objRect[this.globals.rectSides.RIGHT] + (this.globals.basket.getXSize() / 2), this.objCenter.y);
  }


  render() {
  /*
    debugTextOut(this.globals.p5.color('red'), "Hero:");
    debugTextOut(this.globals.p5.color('black'), "action = " + this.action);
    debugTextOut(this.globals.p5.color('black'), "health = " + this.health);
    debugTextOut(this.globals.p5.color('black'), "objRect   = " + this.objRect[this.globals.rectSides.LEFT] + ", " + this.objRect[this.globals.rectSides.TOP]);
    debugTextOut(this.globals.p5.color('black'), "objCenter = " + this.objCenter.x + ", " + this.objCenter.y);
    debugTextOut(this.globals.p5.color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
    debugTextOut(this.globals.p5.color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
  */

  /*
    // Display the collision box
    this.globals.p5.stroke(255, 204, 100);
    this.globals.p5.noFill();
    this.globals.p5.strokeWeight(5);
    this.globals.p5.rect(this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.objRect[rectSides.RIGHT] - this.objRect[rectSides.LEFT], this.objRect[rectSides.BOTTOM] - this.objRect[rectSides.TOP]);
  */

  /*
    // Display the moveBounds box
    this.globals.p5.stroke(255, 204, 100);
    this.globals.p5.noFill();
    this.globals.p5.strokeWeight(5);
    this.globals.p5.rect(this.moveBounds[rectSides.LEFT], this.moveBounds[rectSides.TOP], this.moveBounds[rectSides.RIGHT] - this.moveBounds[rectSides.LEFT], this.moveBounds[rectSides.BOTTOM] - this.moveBounds[rectSides.TOP]);
  */

    this.globals.p5.image(heroImgs[this.action][this.imgIndex], this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.TOP], this.size[this.action].x, this.size[this.action].y);
    this.drawHealthLevel();
  }

}

export default Hero;
