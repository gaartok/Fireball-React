import Point from './Point';

let deadParticles = [];



function degreesToRadians(degrees)
{
  return degrees * (Math.PI / 180);
}


class Particle {
  constructor(globals) {
    this.globals = globals;
    this.pos = new Point(); // current position
    this.dir = new Point(); // current direction with speed
    this.life = 2000;       // how long it will last
    this.colorR = 0;        // current color of particle
    this.colorG = 0;        // current color of particle
    this.colorB = 0;        // current color of particle
    this.deltaColorR = 0;   // change of color
    this.deltaColorG = 0;   // change of color
    this.deltaColorB = 0;   // change of color
  }

  update(force) {
    this.pos.x += this.dir.x;
    this.pos.y += this.dir.y;

    this.dir.x += force.x;
    this.dir.y += force.y;

//    this.color += this.deltaColor;

    if (this.life > 0)
    {
      this.life = Math.floor(this.life - 1);
    }
  }

  render() {
    this.globals.p5.fill(this.colorR, this.colorG, this.colorB);
    this.globals.p5.circle(this.pos.x, this.pos.y, 3 * this.globals.heightScale);
  }
}




class Emitter {
  constructor(globals, maxParticles, widthScale, heightScale) {
    this.globals = globals;
    this.name = "Emitter";

    this.maxParticles = maxParticles; // maximum emitted at any time
    this.widthScale = widthScale;
    this.heightScale = heightScale;

    this.aliveParticles = [];   // active particles
    this.posUL = new Point();            // XYZ position Upper Left
    this.posLR = new Point();            // XYZ position Lower Right
    this.yaw = 0;              // yaw and variation
    this.yawVar = 0;           // yaw and variation
    this.pitch = 0;            // pitch and variation
    this.pitchVar = 0;         // pitch and variation
    this.speed = 0;
    this.speedVar = 0;
    this.particleCount = 0;           // total emitted right now
    this.emitsPerFrame = 0;               // emits per frame and variation
    this.emitVar = 0;                     // emits per frame and variation
    this.life = 0;
    this.lifeVar = 0;

    this.startColorR = 0;
    this.startColorG = 0;
    this.startColorB = 0;
    this.startColorVar = 255;

    this.endColorR = 0;
    this.endColorG = 0;
    this.endColorB = 0;
    this.endColorVar = 0;
    this.force = new Point();

    this.objRect = new Array(4);         // the object's position RECT

    this.setDefault();
  }


  getType() {
    return this.globals.itemTypes.TYPE_EMITTER;
  }


  isAlive() {
    return true;
  }


  // Convert a Yaw and Pitch to a direction vector
  rotationToDirection(pitch, yaw) {
    let direction = new Point();

    direction.x = -Math.sin(yaw) * Math.cos(pitch);
    direction.y = Math.sin(pitch);

   return direction;
  }

  setPosByRect(posRect) {
    this.posUL.x = posRect[this.globals.rectSides.LEFT];
    this.posUL.y = posRect[this.globals.rectSides.TOP];
    this.posLR.x = posRect[this.globals.rectSides.RIGHT];
    this.posLR.y = posRect[this.globals.rectSides.BOTTOM];
  }


  setPosBySides(left, right, top, bottom) {
    this.posUL.x = left;
    this.posUL.y = top;
    this.posLR.x = right;
    this.posLR.y = bottom;
  }


  setAngles(yawAngle, yawVarAngle, pitchAngle, pitchVarAngle) {
    this.yaw      = degreesToRadians(yawAngle);
    this.yawVar   = degreesToRadians(yawVarAngle);
    this.pitch    = degreesToRadians(pitchAngle);
    this.pitchVar = degreesToRadians(pitchVarAngle);
  }


  setSpeed(newSpeed, newSpeedVar) {
    this.speed    = newSpeed;
    this.speedVar = newSpeedVar;
  }


  setForce(forceX, forceY) {
    this.force.x  = forceX * this.widthScale;
    this.force.y  = forceY * this.heightScale;
  }


  setEmits(newEmits, newEmitsVar) {
    this.emitsPerFrame  = newEmits;
    this.emitVar        = newEmitsVar;
  }


  setLife(newLife, newLifeVar) {
    this.life     = newLife;
    this.lifeVar  = newLifeVar;

    if (this.life === 0)
    {
      for (var count1 = 0; count1 < this.aliveParticles.length; count1++)
      {
        deadParticles.push(this.aliveParticles[count1]);
      }

      this.aliveParticles.length = 0;
      this.particleCount = 0;
    }

  }


  setColors(newStartColorIn, newStartColorVar, newEndColorIn, newEndColorVar) {
    let newStartColor = this.globals.p5.color(newStartColorIn);
    let newEndColor = this.globals.p5.color(newEndColorIn);

    this.startColorR    = this.globals.p5.red(newStartColor);
    this.startColorG    = this.globals.p5.green(newStartColor);
    this.startColorB    = this.globals.p5.blue(newStartColor);
    this.startColorVar  = newStartColorVar;
    this.endColorR      = this.globals.p5.red(newEndColor);
    this.endColorG      = this.globals.p5.green(newEndColor);
    this.endColorB      = this.globals.p5.blue(newEndColor);
    this.endColorVar    = newEndColorVar;
  }


  setDefault() {
    this.particleCount = 0;

    this.posUL.x = 225.0;
    this.posUL.y = 120.0;
    this.posLR.x = 320.0;
    this.posLR.y = 120.0;

    this.yaw      = degreesToRadians(0.0);
    this.yawVar   = degreesToRadians(360.0);
    this.pitch    = degreesToRadians(270.0);
    this.pitchVar = degreesToRadians(40.0);

    this.speed    = 3.0;
    this.speedVar = 0.5;

    this.force.x        = 0.000;
    this.force.y        = 0.04;

    this.emitsPerFrame  = 2;
    this.emitVar        = 3;

    this.life           = 200;
    this.lifeVar        = 15;

    this.endColorR      = 0;
    this.endColorG      = 0;
    this.endColorB      = 0;
    this.startColorVar  = 255;
    this.endColorR      = 0;
    this.endColorG      = 0;
    this.endColorB      = 0;
    this.endColorVar    = 255;
  }


  addParticle() {
    let theParticle;
    let theYaw;
    let thePitch;
    let theSpeed;
    let returnVal;

    if ((this.particleCount < this.maxParticles) && (this.life > 0))
    {
      if (deadParticles.length > 0)
      {
        theParticle  = deadParticles.pop();
      }
      else
      {
        theParticle = new Particle(this.globals);
      }

      theParticle.life = this.life + (this.lifeVar * this.globals.p5.random(0, 1));

      theParticle.pos.x = this.globals.p5.random(this.posUL.x, this.posLR.x);
      theParticle.pos.y = this.globals.p5.random(this.posUL.y, this.posLR.y);

      // calculate the starting direction vector
      theYaw = this.yaw + (this.yawVar * this.globals.p5.random(0, 1));
      thePitch = this.pitch + (this.pitchVar * this.globals.p5.random(0, 1));

      // convert the rotations to a vector
      theParticle.dir = this.rotationToDirection(thePitch, theYaw);

      // multiply in the speed factor
      theSpeed = this.speed + (this.speedVar * this.globals.p5.random(0, 1));
      theParticle.dir.x *= theSpeed;
      theParticle.dir.y *= theSpeed;

      theParticle.colorR = this.startColorR + (this.startColorVar * this.globals.p5.random(0, 1));
      theParticle.colorG = this.startColorG + (this.startColorVar * this.globals.p5.random(0, 1));
      theParticle.colorB = this.startColorB + (this.startColorVar * this.globals.p5.random(0, 1));

      // a new particle is born
      this.aliveParticles.push(theParticle);
      this.particleCount++;

      returnVal = true;
    }

    returnVal = false;

    return returnVal;
  }


  update(collideableList) {
    this.globals.p5.textAlign(this.globals.p5.LEFT, this.globals.p5.TOP);
    var count1;

    for (count1 = 0; count1 < this.aliveParticles.length; count1++)
    {
      this.aliveParticles[count1].update(this.force);

      if (this.aliveParticles[count1].life === 0)
      {
        deadParticles.push(this.aliveParticles[count1]);
        this.aliveParticles.splice(count1, 1);
        count1 -= 1;

        if (this.particleCount > 0)
        {
          this.particleCount--;
        }
      }
    }

    // don't add new particles if Emitter's life == 0
    if ((this.particleCount < this.maxParticles) && (this.life > 0))
    {
      var emitCount = this.emitsPerFrame + (this.emitVar * this.globals.p5.random(0, 1));
      for (count1 = 0; count1 < emitCount; count1++)
      {
        this.addParticle();
      }
    }

  }



  render() {
    this.globals.p5.noStroke();
    this.globals.p5.colorMode(this.globals.p5.RGB);

    for (var count1 = 0; count1 < this.aliveParticles.length; count1++)
    {
      this.aliveParticles[count1].render();
    }
  }


};

export default Emitter;
