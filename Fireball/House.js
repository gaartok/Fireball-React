import Point from './Point';
import AliveObject from './AliveObject';
import Emitter from './Emitter';


class House extends AliveObject {
  constructor(globals, action, widthScale, heightScale) {
    // Call AliveObject's constructor
    super(globals, globals.itemTypes.TYPE_HOUSE);

  this.faucetPos = new Array(4);

  this.name = "House";

  this.action = action;
  this.imgIndex = 0;

  this.flameList = [];

  this.img = new Array(6);
  this.imgSize = new Point();
  this.drawLocation = new Point();

  this.faucet = new Emitter(this.globals, 100, widthScale, heightScale);
  this.faucet.setAngles(100, 1, 90, 1);    // down
  this.faucet.setSpeed(1.5, 0.1);
  this.faucet.setForce(0.0, 0.0);
  this.faucet.setEmits(1, 1);
  this.faucet.setLife(50, 0);
  this.faucet.setColors(this.globals.p5.color('blue'), 0, this.globals.p5.color('blue'), 0);

  this.crashSounds =
  [
    this.globals.sounds.BANG,
    this.globals.sounds.BOOM,
    this.globals.sounds.EXPLOSION,
    this.globals.sounds.GLASS,
    this.globals.sounds.GLASSBRK
  ];

  this.numFrames[this.globals.actions.ACTION_IDLE_RIGHT] = 5;
  this.size[this.globals.actions.ACTION_IDLE_RIGHT].x    = 32;
  this.size[this.globals.actions.ACTION_IDLE_RIGHT].y    = 128;

  this.numFrames[this.globals.actions.ACTION_IDLE_LEFT]  = 5;
  this.size[this.globals.actions.ACTION_IDLE_LEFT].x     = 32;
  this.size[this.globals.actions.ACTION_IDLE_LEFT].y     = 128;

  this.init(this.globals.widthScale, this.globals.heightScale);
  this.initialize();

  this.objRect[this.globals.rectSides.LEFT]   = this.drawLocation.x;
  this.objRect[this.globals.rectSides.TOP]    = this.drawLocation.y;
  this.objRect[this.globals.rectSides.RIGHT]  = this.drawLocation.x + this.imgSize.x;
  this.objRect[this.globals.rectSides.BOTTOM] = this.drawLocation.y + this.imgSize.y;

  if (this.action === this.globals.actions.ACTION_IDLE_LEFT)
  {
    this.faucetPos[this.globals.rectSides.LEFT]   = this.objRect[this.globals.rectSides.RIGHT] + (4 * this.globals.widthScale);
    this.faucetPos[this.globals.rectSides.RIGHT]  = this.objRect[this.globals.rectSides.RIGHT] + (7 * this.globals.widthScale);
  }
   else
   {
    this.faucetPos[this.globals.rectSides.LEFT]   = this.objRect[this.globals.rectSides.LEFT] - (7 * this.globals.widthScale);
    this.faucetPos[this.globals.rectSides.RIGHT]  = this.objRect[this.globals.rectSides.LEFT] - (4 * this.globals.widthScale);
   }

   this.faucetPos[this.globals.rectSides.TOP]    = this.objRect[this.globals.rectSides.BOTTOM] - (30 * this.globals.heightScale);
   this.faucetPos[this.globals.rectSides.BOTTOM] = this.faucetPos[this.globals.rectSides.TOP];

  this.faucet.setPosByRect(this.faucetPos);
}


// inherit from AliveObject
//House.prototype = new AliveObject(itemTypes.TYPE_House);


  init(widthScale, heightScale)
{
  this.imgSize.x = 32 * widthScale;
  this.imgSize.y = 128 * heightScale;
  this.drawLocation.y = this.globals.screenHeight - this.imgSize.y;

  if (this.action === this.globals.actions.ACTION_IDLE_LEFT)
  {
    this.img[0] = this.globals.images.HouseLeft1;
    this.img[1] = this.globals.images.HouseLeft2;
    this.img[2] = this.globals.images.HouseLeft3;
    this.img[3] = this.globals.images.HouseLeft4;
    this.img[4] = this.globals.images.HouseLeft5;
    this.img[5] = this.globals.images.HouseLeft6;
    this.drawLocation.x = 0;
  }
  else
  {
    this.img[0] = this.globals.images.HouseRight1;
    this.img[1] = this.globals.images.HouseRight2;
    this.img[2] = this.globals.images.HouseRight3;
    this.img[3] = this.globals.images.HouseRight4;
    this.img[4] = this.globals.images.HouseRight5;
    this.img[5] = this.globals.images.HouseRight6;
//    this.drawLocation.x = 608 * widthScale;
    this.drawLocation.x = this.globals.screenWidth - this.imgSize.x;
  }

  this.setLocation(this.drawLocation.x, this.drawLocation.y);
}



  newLevel(theLevel)
  {
    AliveObject.prototype.newLevel.call(this, theLevel);
    this.turnOnFaucet();
    this.putOutFires();
    this.imgIndex = 0;
  }




  putOutFires()
{
  this.flameList.length = 0;
}


  playRandomCrashSound()
  {
    var randCrash = Math.floor(this.globals.p5.random(0, this.crashSounds.length));
//    debugTextOut(this.globals.p5.color('black'), "randCrash = " + randCrash);
    this.crashSounds[randCrash].play();
  }


  turnOnFaucet()
{
  if (this.health > 0)
    this.faucet.setLife(30, 3);
}


  turnOffFaucet()
{
  this.faucet.setLife(0, 0);
}


  blockFaucet()
{
  if (this.health > 0)
    this.faucet.setLife(5, 0);
}


  createNewFlame()
{
  var flame = new Emitter(this.globals, 20, this.globals.widthScale, this.globals.heightScale);
  var flamePos = new Array(4);

  flame.setAngles(0, 10, 10, 3);
  flame.setSpeed(0.50, 0.1);
  flame.setForce(0.0, -0.10);
  flame.setEmits(1, 1);
  flame.setLife(20, 10);
  flame.setColors(this.globals.p5.color('red'), 2, this.globals.p5.color('red'), 2);

  if (this.action === this.globals.actions.ACTION_IDLE_LEFT)
  {
    flamePos[this.globals.rectSides.LEFT]   = this.objRect[this.globals.rectSides.RIGHT] - this.globals.p5.random(5, this.imgSize.x - 5);
    flamePos[this.globals.rectSides.RIGHT]  = flamePos[this.globals.rectSides.LEFT] + (this.globals.p5.random(3, 5) * this.globals.widthScale);
    flamePos[this.globals.rectSides.TOP]    = this.objRect[this.globals.rectSides.TOP] + this.globals.p5.random(10, this.imgSize.y);
    flamePos[this.globals.rectSides.BOTTOM] = flamePos[this.globals.rectSides.TOP];
  }
  else
  {
    flamePos[this.globals.rectSides.LEFT]   = this.objRect[this.globals.rectSides.LEFT] + this.globals.p5.random(5, this.imgSize.x - 5);
    flamePos[this.globals.rectSides.RIGHT]  = flamePos[this.globals.rectSides.LEFT] + (this.globals.p5.random(3, 5) * this.globals.widthScale);
    flamePos[this.globals.rectSides.TOP]    = this.objRect[this.globals.rectSides.TOP] + this.globals.p5.random(10, this.imgSize.y);
    flamePos[this.globals.rectSides.BOTTOM] = flamePos[this.globals.rectSides.TOP];
  }

  flame.setPosByRect(flamePos);
  this.flameList.push(flame);
}


  hit(damage)
{
  if (this.health > 0)
  {
    this.playRandomCrashSound();
    this.createNewFlame();
  }

  AliveObject.prototype.hit.call(this, damage);

  if (this.health === 0)
  {
    this.turnOffFaucet();
  }

  this.imgIndex = 4 - (this.health / 25);
}



  update()
{
  this.faucet.update();

  for (var count1 = 0; count1 < this.flameList.length; count1++)
  {
    this.flameList[count1].update();
  }
}


  render()
{
/*
  debugTextOut(this.globals.p5.color('red'), "House:");
  debugTextOut(this.globals.p5.color('black'), "health = " + this.health);
  debugTextOut(this.globals.p5.color('black'), "imgIndex = " + this.imgIndex);
*/

/*
  // Display the collision box
  stroke(255, 204, 100);
  noFill();
  strokeWeight(3);
  rect(this.objRect[rectSides.LEFT], this.objRect[rectSides.TOP], this.objRect[rectSides.RIGHT] - this.objRect[rectSides.LEFT], this.objRect[rectSides.BOTTOM] - this.objRect[rectSides.TOP]);
*/

  this.globals.p5.image(this.img[this.imgIndex], this.drawLocation.x, this.drawLocation.y, this.imgSize.x, this.imgSize.y);
  this.faucet.render();

  for (var count1 = 0; count1 < this.flameList.length; count1++)
  {
    this.flameList[count1].render();
  }
}

}

export default House;
