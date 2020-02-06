import Globals from './Globals';
import AliveObject from './AliveObject';
import Point from './Point';
import Emitter from './Emitter';

let basketImgs = new Array(Globals.MAX_ACTIONS);


class Basket extends AliveObject {
  constructor(globals) {
    // Call AliveObject's constructor
    super(globals, globals.itemTypes.TYPE_BASKET);

    this.name = "Basket";

    this.action = this.globals.levels.LEVEL1;
    this.underFaucet = false;

    this.waterIndicatorLocation = new Array(4);
    this.waterIndicatorLocation[this.globals.rectSides.LEFT]   = 25 * this.globals.widthScale;
    this.waterIndicatorLocation[this.globals.rectSides.RIGHT]  = 74 * this.globals.widthScale;
    this.waterIndicatorLocation[this.globals.rectSides.TOP]    = 50 * this.globals.heightScale;
    this.waterIndicatorLocation[this.globals.rectSides.BOTTOM] = 99 * this.globals.heightScale;

    this.waterIndicatorSize = new Point();
    this.waterIndicatorSize.x = this.waterIndicatorLocation[this.globals.rectSides.RIGHT]  - this.waterIndicatorLocation[this.globals.rectSides.LEFT];
    this.waterIndicatorSize.y = this.waterIndicatorLocation[this.globals.rectSides.BOTTOM] - this.waterIndicatorLocation[this.globals.rectSides.TOP];

    basketImgs[this.globals.levels.LEVEL1] = this.globals.images.Basket1;
    basketImgs[this.globals.levels.LEVEL2] = this.globals.images.Basket2;
    basketImgs[this.globals.levels.LEVEL3] = this.globals.images.Basket3;

    this.velocity.x        = 0;
    this.velocity.y        = 0;
    this.minVelocity.x     = 0;
    this.minVelocity.y     = 0;
    this.maxVelocity.x     = 0;
    this.maxVelocity.y     = 0;

    this.numFrames[this.globals.levels.LEVEL1] = 1;
    this.size[this.globals.levels.LEVEL1].x    = 24 * this.globals.widthScale;
    this.size[this.globals.levels.LEVEL1].y    = 16 * this.globals.heightScale;

    this.numFrames[this.globals.levels.LEVEL2] = 1;
    this.size[this.globals.levels.LEVEL2].x    = 20 * this.globals.widthScale;
    this.size[this.globals.levels.LEVEL2].y    = 16 * this.globals.heightScale;

    this.numFrames[this.globals.levels.LEVEL3] = 1;
    this.size[this.globals.levels.LEVEL3].x    = 16 * this.globals.widthScale;
    this.size[this.globals.levels.LEVEL3].y    = 16 * this.globals.heightScale;

    this.setLocation(this.globals.screenWidth / 2, this.globals.screenHeight - (this.size[this.action].y / 2));
    this.initialize();

    this.waterOverflow = new Emitter(this.globals, 200 * this.globals.widthScale, this.globals.widthScale, this.globals.heightScale);
    this.waterOverflow.setAngles(90, 1, 90, 1);    // down
    this.waterOverflow.setSpeed(1.0 * this.globals.heightScale, 0.1);
    this.waterOverflow.setForce(0.0, 0.0);
    this.waterOverflow.setEmits(1, 1);
    this.waterOverflow.setLife(0, 0);
    this.waterOverflow.setColors(this.globals.p5.color('blue'), 0, this.globals.p5.color('blue'), 0);
    this.waterOverflow.setPosBySides(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.RIGHT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.TOP]);

    this.splashEndTime = Date.now() - 2;
    this.waterSplash = new Emitter(this.globals, 500, this.globals.widthScale, this.globals.heightScale);
    this.waterSplash.setAngles(0, 360, 270, 40);
    this.waterSplash.setSpeed(2.0 * this.globals.heightScale, 2.0 * this.globals.widthScale);
    this.waterSplash.setForce(0.0, 0.4 * this.globals.heightScale);
    this.waterSplash.setEmits(5 * this.globals.widthScale, 1);
    this.waterSplash.setLife(0, 0);
    this.waterSplash.setColors(this.globals.p5.color('blue'), 0, this.globals.p5.color('blue'), 0);
    this.waterSplash.setPosBySides(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.RIGHT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.TOP]);

    this.waterLevel = 50;

    this.splashSound = this.globals.sounds.SPLASH;
    this.fillSound   = this.globals.sounds.WATER;
    this.hitSound    = this.globals.sounds.WATER;

    // inherit from AliveObject
    //Basket.prototype = new AliveObject(itemTypes.TYPE_BASKET);
  }


  hit(damage) {
    if (this.waterLevel <= 0)
    {
      AliveObject.prototype.hit.call(this, damage);
      return;
    }

    this.waterLevel -= damage;
    if (this.waterLevel < 0)
      this.waterLevel = 0;
    if (this.waterLevel > 100)
      this.waterLevel = 100;

    this.splashSound.play();

    this.waterSplash.setPosBySides(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.RIGHT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.TOP]);
    this.waterSplash.setLife(750, 30);
    this.splashEndTime = Date.now() + 500;
  }



  newLevel(level) {
    AliveObject.prototype.newLevel.call(this, level);
    this.waterLevel = 50;

    this.action = level;
  }



  drawWaterLevel() {
    let waterHeight = this.waterIndicatorSize.y * (this.waterLevel / 100);

    this.globals.p5.noStroke();

    // Drop the top area brown
    this.globals.p5.fill(this.globals.p5.color('brown'));
    this.globals.p5.rect(this.waterIndicatorLocation[this.globals.rectSides.LEFT],
                    this.waterIndicatorLocation[this.globals.rectSides.TOP],
                    this.waterIndicatorSize.x,
                    this.waterIndicatorSize.y - waterHeight);

    // Drop the bottom area blue
    this.globals.p5.fill(this.globals.p5.color('blue'));
    this.globals.p5.rect(this.waterIndicatorLocation[this.globals.rectSides.LEFT],
                    this.waterIndicatorLocation[this.globals.rectSides.BOTTOM] - waterHeight,
                    this.waterIndicatorSize.x,
                    waterHeight);
  }



  update() {
    let timeNow = Date.now();

    // are we under the left faucet?
    this.underFaucet = false;
    if ((this.objRect[this.globals.rectSides.LEFT] <= ((32 + 4) * this.globals.widthScale)) && (this.globals.houseLeft.getHealth() > 0))     // 32 = width of house  4 = distance faucet is from house
    {
      this.globals.houseLeft.blockFaucet();
      this.underFaucet = true;
    }
    else
    {
      this.globals.houseLeft.turnOnFaucet();
    }

    // are we under the right faucet?
    if ((this.objRect[this.globals.rectSides.RIGHT] >= this.globals.screenWidth - ((32 - 4) * this.globals.widthScale)) && (this.globals.houseRight.getHealth() > 0))
    {
      this.globals.houseRight.blockFaucet();
      this.underFaucet = true;
    }
    else
    {
      this.globals.houseRight.turnOnFaucet();
    }

    if (this.underFaucet)
    {
      if (!this.fillSound.isPlaying())
      {
        this.fillSound.play();
      }

      if (this.waterLevel === 100)
      {
        this.waterOverflow.setLife(50, 3);
      }

      if (this.underFaucetTime === 0)  // if we just got here, start the timer
      {
        this.underFaucetTime = timeNow;
      }
      else     // we've been here a while already
      {
        if (timeNow > this.underFaucetTime + 200)
        {
          this.waterLevel += 10;
          if (this.waterLevel > 100)
            this.waterLevel = 100;

          this.underFaucetTime = timeNow; // restart the timer for another gulp
        }
      }
    }
    else
    {
      this.fillSound.stop();
      this.underFaucetTime = 0;
      this.waterOverflow.setLife(0, 0);
    }

    if (timeNow > this.splashEndTime)
      this.waterSplash.setLife(0, 0);

    this.waterOverflow.setPosBySides(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.RIGHT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.TOP]);
    this.waterOverflow.update();

    this.waterSplash.setPosBySides(this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.RIGHT], this.objRect[this.globals.rectSides.TOP], this.objRect[this.globals.rectSides.TOP]);
    this.waterSplash.update();
  }


  render() {
  /*
    debugTextOut(color('red'), "Basket:");
  //  debugTextOut(color('black'), "action = " + this.action);
    debugTextOut(color('black'), "health = " + this.health);
    debugTextOut(color('black'), "waterLevel = " + this.waterLevel);
  //  debugTextOut(color('black'), "underFaucet = " + this.underFaucet);
  //  debugTextOut(color('black'), "objRect   = " + this.objRect[this.globals.rectSides.LEFT] + ", " + this.objRect[this.globals.rectSides.TOP]);
  //  debugTextOut(color('black'), "objCenter = " + this.objCenter.x + ", " + this.objCenter.y);
  //  debugTextOut(color('black'), "size = " + this.size[this.action].x + ", " + this.size[this.action].x);
  //  debugTextOut(color('black'), "halfSize = " + this.halfSize[this.action].x + ", " + this.halfSize[this.action].x);
  */

    this.globals.p5.image(basketImgs[this.action], this.objRect[this.globals.rectSides.LEFT], this.objRect[this.globals.rectSides.TOP], this.size[this.globals.levels.LEVEL1].x, this.size[this.globals.levels.LEVEL1].y);
    this.waterOverflow.render();
    this.waterSplash.render();
    this.drawWaterLevel();
  }



  getWaterLevel() {
    return this.waterLevel;
  }

}

export default Basket;
