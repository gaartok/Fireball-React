import Globals from './Globals';
import Basket from './Basket';
import Hero from './Hero';
import House from './House';
import Emitter from './Emitter';
import Rock from './Rock';
require("p5/lib/addons/p5.sound");


class Fireball {
  constructor() {
    this.globals = new Globals();
    this.canvas = null;
    this.originalScreenWidth = 640;
    this.originalScreenHeight = 480;
    this.imgSplash = null;
    this.imgBackground = null;
    this.gameState = null;
    this.timeToSwitchState = null;
    this.debrisEmitter = null;
    this.playerLevel = null;
    this.nextSpewTime = null;       // when we should spew another rock out the volcano
    this.spewRateMin = 1000; // rate at which to spew rocks in milliseconds (min time between)
    this.spewRateMax = 3000; // rate at which to spew rocks in milliseconds (max time between)
    this.rockCount = 0;
    this.rockInstance = 0;
    this.alreadyAlerted = false;
    this.debugTextY = 5;
    this.debugHeight = null;
    this.rockStartLocXMin = null;
    this.rockStartLocXMax = null;
    this.rockStartLocY = null;
    this.highScores = [];
    this.aliveList = [];
    this.theXMLObject = null;
    this.userInitials = "DAD";
    //this.baseURL = "http://localhost/greygames/public_html/thoughtwaves/demos/Fireball/";
    //this.baseURL = "http://192.168.254.69/greygames/public_html/thoughtwaves/src/Fireball/";
    this.baseURL = "localhost/GreyGames/public_html/thoughtwaves/src/Fireball/";

    this.programStates =
    {
      PS_INIT:              0,
      PS_SPLASH:            1,
      PS_GET_HIGH_SCORES:   2,
      PS_SHOW_HIGH_SCORES:  3,
      PS_INSTRUCTIONS:      4,
      PS_BEGIN_LEVEL:       5,
      PS_ACTIVE:            6,
      PS_ENDGAME:           7,
      PS_SHOW_SCORE:        8,
      PS_ENTER_NAME:        9,
      PS_FINISHED:          10,
      PS_IDLE:              11
    };


    this.instructions = [
      "You were in your house when it happened.",
      "The volcano started to erupt!!",
      "You grab your bucket, run outside, and fill",
      "the bucket with water.  Try to catch all the",
      "fireballs, but make sure you don't get hit",
      "on the head by one.  You must keep your bucket",
      "full of water to exterminate the flames.",
      "It's up to you to save the town.",
      "GOOD LUCK!",
      "How To Play",
      "To move the person, push the left and right arrow keys.",
      "Keep the bucket full of water by standing under the",
      "faucets on the house.",
      "If you let the houses burn down, you will have not water",
      "to full your bucket, so protect the houses!",
      " ",
      "Hit ENTER to begin"
    ];

    this.sketch = this.sketch.bind(this);
  }


  preload() {
    this.globals.images.HeroRight1 = this.globals.p5.loadImage("FireballArt/HeroRight1.png");
    this.globals.images.HeroRight2 = this.globals.p5.loadImage("FireballArt/HeroRight2.png");
    this.globals.images.HeroRight3 = this.globals.p5.loadImage("FireballArt/HeroRight3.png");
    this.globals.images.HeroRight4 = this.globals.p5.loadImage("FireballArt/HeroRight4.png");
    this.globals.images.HeroLeft1 = this.globals.p5.loadImage("FireballArt/HeroLeft1.png");
    this.globals.images.HeroLeft2 = this.globals.p5.loadImage("FireballArt/HeroLeft2.png");
    this.globals.images.HeroLeft3 = this.globals.p5.loadImage("FireballArt/HeroLeft3.png");
    this.globals.images.HeroLeft4 = this.globals.p5.loadImage("FireballArt/HeroLeft4.png");
    this.globals.images.Basket1 = this.globals.p5.loadImage("FireballArt/Basket1.png");
    this.globals.images.Basket2 = this.globals.p5.loadImage("FireballArt/Basket2.png");
    this.globals.images.Basket3 = this.globals.p5.loadImage("FireballArt/Basket3.png");
    this.globals.images.HouseLeft1 = this.globals.p5.loadImage("FireballArt/HouseLeft1.png");
    this.globals.images.HouseLeft2 = this.globals.p5.loadImage("FireballArt/HouseLeft2.png");
    this.globals.images.HouseLeft3 = this.globals.p5.loadImage("FireballArt/HouseLeft3.png");
    this.globals.images.HouseLeft4 = this.globals.p5.loadImage("FireballArt/HouseLeft4.png");
    this.globals.images.HouseLeft5 = this.globals.p5.loadImage("FireballArt/HouseLeft5.png");
    this.globals.images.HouseLeft6 = this.globals.p5.loadImage("FireballArt/HouseLeft6.bmp");
    this.globals.images.HouseRight1 = this.globals.p5.loadImage("FireballArt/HouseRight1.png");
    this.globals.images.HouseRight2 = this.globals.p5.loadImage("FireballArt/HouseRight2.png");
    this.globals.images.HouseRight3 = this.globals.p5.loadImage("FireballArt/HouseRight3.png");
    this.globals.images.HouseRight4 = this.globals.p5.loadImage("FireballArt/HouseRight4.png");
    this.globals.images.HouseRight5 = this.globals.p5.loadImage("FireballArt/HouseRight5.png");
    this.globals.images.HouseRight6 = this.globals.p5.loadImage("FireballArt/HouseRight6.bmp");
    this.globals.images.RockUp1 = this.globals.p5.loadImage("FireballArt/RockUp1.png");
    this.globals.images.RockUp2 = this.globals.p5.loadImage("FireballArt/RockUp2.png");
    this.globals.images.RockUp3 = this.globals.p5.loadImage("FireballArt/RockUp3.png");
    this.globals.images.RockDown1 = this.globals.p5.loadImage("FireballArt/RockDown1.png");
    this.globals.images.RockDown2 = this.globals.p5.loadImage("FireballArt/RockDown2.png");
    this.globals.images.RockDown3 = this.globals.p5.loadImage("FireballArt/RockDown3.png");
    this.globals.images.RockLeft1 = this.globals.p5.loadImage("FireballArt/RockLeft1.png");
    this.globals.images.RockLeft2 = this.globals.p5.loadImage("FireballArt/RockLeft2.png");
    this.globals.images.RockLeft3 = this.globals.p5.loadImage("FireballArt/RockLeft3.png");
    this.globals.images.RockRight1 = this.globals.p5.loadImage("FireballArt/RockRight1.png");
    this.globals.images.RockRight2 = this.globals.p5.loadImage("FireballArt/RockRight2.png");
    this.globals.images.RockRight3 = this.globals.p5.loadImage("FireballArt/RockRight3.png");
    this.globals.images.Splash = this.globals.p5.loadImage("FireballArt/Splash.bmp");
    this.globals.images.Volcano = this.globals.p5.loadImage("FireballArt/VolcanoCentered.bmp");

    // setup sounds

    this.globals.p5.soundFormats('mp3', 'ogg', 'wav');

    this.globals.sounds.GREATBALLS = this.globals.p5.loadSound("FireballArt/grtballs.wav");
    this.globals.sounds.AAAH = this.globals.p5.loadSound("FireballArt/aaah.wav");
    this.globals.sounds.ARGH = this.globals.p5.loadSound("FireballArt/089_argh.wav");
    this.globals.sounds.AGONY = this.globals.p5.loadSound("FireballArt/agony.wav");
    this.globals.sounds.AHHHHHHH = this.globals.p5.loadSound("FireballArt/ahhhhh.wav");
    this.globals.sounds.BONK = this.globals.p5.loadSound("FireballArt/aaah.wav");
    this.globals.sounds.JIBBERISH = this.globals.p5.loadSound("FireballArt/jiberish.wav");
    this.globals.sounds.KINISON = this.globals.p5.loadSound("FireballArt/kinison.wav");
    this.globals.sounds.KOOK = this.globals.p5.loadSound("FireballArt/kook.wav");
    this.globals.sounds.MWPUNCH = this.globals.p5.loadSound("FireballArt/mwpunch.wav");
    this.globals.sounds.NI = this.globals.p5.loadSound("FireballArt/ni.wav");
    this.globals.sounds.OUCH = this.globals.p5.loadSound("FireballArt/ouch.wav");
    this.globals.sounds.POP = this.globals.p5.loadSound("FireballArt/pop.wav");
    this.globals.sounds.POP1 = this.globals.p5.loadSound("FireballArt/pop1.wav");
    this.globals.sounds.POP2 = this.globals.p5.loadSound("FireballArt/pop2.wav");
    this.globals.sounds.SCREAM = this.globals.p5.loadSound("FireballArt/scream.wav");
    this.globals.sounds.WOOW1 = this.globals.p5.loadSound("FireballArt/woow1.wav");
    this.globals.sounds.YELLING = this.globals.p5.loadSound("FireballArt/yelling.wav");
    this.globals.sounds.SPLASH = this.globals.p5.loadSound("FireballArt/splash.wav");
    this.globals.sounds.WATER = this.globals.p5.loadSound("FireballArt/water.wav");
    this.globals.sounds.BANG = this.globals.p5.loadSound("FireballArt/b_bang_2.wav");
    this.globals.sounds.BOOM = this.globals.p5.loadSound("FireballArt/boom.wav");
    this.globals.sounds.EXPLOSION = this.globals.p5.loadSound("FireballArt/exploson.wav");
    this.globals.sounds.GLASS = this.globals.p5.loadSound("FireballArt/glass.wav");
    this.globals.sounds.GLASSBRK = this.globals.p5.loadSound("FireballArt/glassbrk.wav");
  }


  initialize(divWidth, divHeight) {
    let screenRatio = (divHeight / 480.0) / (divWidth / 640.0);

    // Taller, skinnier screens will have larger screenRatios
    // This is based on the original artwork of 640 x 480, which would have a screenRatio of 1
    if (screenRatio > 1) {
      // Skinny area.  Lock width and scale height.
      this.globals.screenWidth = divWidth;
      this.globals.screenHeight = divHeight / screenRatio;
    }
    else {
      // Fat area. Lock height and scale width.
      this.globals.screenHeight = divHeight;
      this.globals.screenWidth = divWidth * screenRatio;
    }

//    this.globals.screenWidth = divWidth;
//    this.globals.screenHeight = divHeight;

    this.screenRatio = (this.globals.screenHeight / 480.0) / (this.globals.screenWidth / 640.0);

    // 640x480 = 307200
    this.globals.screenAreaRatio = (this.globals.screenWidth * this.globals.screenHeight) / 307200;

    this.globals.widthScale = this.globals.screenWidth / this.originalScreenWidth;
    this.globals.heightScale = this.globals.screenHeight / this.originalScreenHeight;
    this.globals.bounceYCoord = this.globals.BOUNCE_Y_COORD * this.globals.heightScale;
    this.debugHeight = this.globals.screenHeight / 40;

    let volcanoLeft = 272 * this.globals.widthScale;
    let volcanoWidth = 80 * this.globals.widthScale;

    let left = volcanoLeft;
    let right = left + volcanoWidth;
    let top = 124 * this.globals.heightScale;
    let bottom = top;

    this.rockStartLocXMin = left;
    this.rockStartLocXMax = right;
    this.rockStartLocY = top;

    this.globals.basket = new Basket(this.globals);
    this.globals.theHero = new Hero(this.globals);

    this.debrisEmitter = new Emitter(this.globals, 2000 * this.globals.screenAreaRatio, this.globals.widthScale, this.globals.heightScale);
    this.debrisEmitter.setForce(0.0, 0.04);
    this.debrisEmitter.setEmits(0.5, 0.2);
    this.debrisEmitter.setLife(300, 50);
    this.debrisEmitter.setPosBySides(left, right, top, bottom);
    this.debrisEmitter.setSpeed(3.0 * this.globals.heightScale, 0.5);
    this.debrisEmitter.setColors(this.globals.colors.debrisStartColor, 255, this.globals.colors.debrisEndColor, 255);

    this.globals.houseLeft  = new House(this.globals, this.globals.actions.ACTION_IDLE_LEFT, this.globals.widthScale, this.globals.heightScale);
    this.globals.houseRight = new House(this.globals, this.globals.actions.ACTION_IDLE_RIGHT, this.globals.widthScale, this.globals.heightScale);

    this.aliveList.push(this.globals.basket);
    this.aliveList.push(this.globals.theHero);
    this.aliveList.push(this.debrisEmitter);
    this.aliveList.push(this.globals.houseLeft);
    this.aliveList.push(this.globals.houseRight);

    this.imgSplash = this.globals.images.Splash;
    this.imgBackground = this.globals.images.Volcano;

    this.timeToSwitchState = 0;

//    this.gameState = this.programStates.PS_INIT;
    this.gameState = this.programStates.PS_INSTRUCTIONS;  // Skip the splash screen
  }



  // stuff to be done once per game
  newGame() {
    this.globals.playerScore = 0;
    this.playerLevel = this.globals.levels.LEVEL1;
  }



  // stuff to be done at the beginning of each level
  initLevel() {
    this.globals.playerScore = 0;

    if (this.globals.playerScore > this.globals.LEVEL3_MIN_SCORE) {
      this.playerLevel = this.globals.levels.LEVEL3;
    }
    else if (this.globals.playerScore > this.globals.LEVEL2_MIN_SCORE) {
      this.playerLevel = this.globals.levels.LEVEL2;
    }
    else {
      this.playerLevel = this.globals.levels.LEVEL1;
    }

    // remove any rocks that may be left in the list from the previous level
    let count1 = 0;
    while (count1 < this.aliveList.length) {
      if (this.aliveList[count1].getType() === this.globals.itemTypes.TYPE_ROCK) {
        this.aliveList.splice(count1, 1);
      }
      else {
        count1 += 1;
      }
    }

    this.globals.houseLeft.newLevel(this.playerLevel);
    this.globals.houseRight.newLevel(this.playerLevel);
    this.globals.theHero.newLevel(this.playerLevel);
    this.globals.basket.newLevel(this.playerLevel);

    this.nextSpewTime = Date.now();
  }


  // Calculate the luminance of a hex color (string)
  hexToLuma = (colour) => {
    const hex   = colour.replace(/#/, '');
    const r     = parseInt(hex.substr(0, 2), 16);
    const g     = parseInt(hex.substr(2, 2), 16);
    const b     = parseInt(hex.substr(4, 2), 16);

    return [
        0.299 * r,
        0.587 * g,
        0.114 * b
    ].reduce((a, b) => a + b) / 255;
  };


/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
  getContrast = function (hexcolor){
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === '#') {
      hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
      hexcolor = hexcolor.split('').map(function (hex) {
        return hex + hex;
      }).join('');
    }

    // Convert to RGB value
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);

    // Get YIQ ratio
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';
  };



  showInstructions() {
    let textHeight = this.globals.screenHeight / 40;

    this.globals.p5.image(this.imgBackground, 0, 0, this.globals.screenWidth, this.globals.screenHeight);
    this.globals.houseLeft.render();
    this.globals.houseRight.render();

    this.globals.p5.noStroke();
    this.globals.p5.textSize(textHeight);
    this.globals.p5.fill(this.globals.colors.instructionsColor);
    this.globals.p5.textAlign(this.globals.p5.CENTER, this.globals.p5.TOP);

    // Top section of text
    let textLocation = 5;
    for (let count1 = 0; count1 < 9; count1++) {
      this.globals.p5.text(this.instructions[count1], this.globals.screenWidth / 2, textLocation);
      textLocation += textHeight + 2;
    }

    // Bottom section of text
    textLocation = this.globals.screenHeight * 0.75;
    for (let count1 = 9; count1 < this.instructions.length; count1++) {
      this.globals.p5.text(this.instructions[count1], this.globals.screenWidth / 2, textLocation);
      textLocation += textHeight + 2;
    }
  }


  showHighScores() {
    let textLocation = 20;
    let textHeight = this.globals.screenHeight / 20;
    let nextStrOut;

    this.globals.p5.image(this.imgBackground, 0, 0, this.globals.screenWidth, this.globals.screenHeight);
    this.globals.houseLeft.render();
    this.globals.houseRight.render();

    this.globals.p5.noStroke();
    this.globals.p5.textSize(textHeight);
    this.globals.p5.fill(this.globals.colors.instructionsColor);
    this.globals.p5.textAlign(this.globals.p5.CENTER, this.globals.p5.TOP);

    this.globals.p5.text("High Scores", this.globals.screenWidth / 2, textLocation);
    textLocation += (textHeight + 2) * 2;

    for (let count1 = 0; count1 < this.highScores.length; count1++) {
      nextStrOut = this.highScores[count1][0] + " : " + this.highScores[count1][1];
      this.globals.p5.text(nextStrOut, this.globals.screenWidth / 2, textLocation);
      textLocation += textHeight + 2;
    }
  }


  draw() {
    let count1;
    let timeNow = Date.now();

    switch(this.gameState) {
      case this.programStates.PS_INIT: {
        this.timeToSwitchState = timeNow + this.globals.SPLASH_SCREEN_TIME;
  //      this.globals.sounds.GREATBALLS.play();
        this.gameState = this.programStates.PS_SPLASH;
        break;      
      }

      case this.programStates.PS_SPLASH: {
        this.globals.p5.image(this.imgSplash, 0, 0, this.globals.screenWidth, this.globals.screenHeight);

        if (timeNow > this.timeToSwitchState) {
          this.newGame();
          this.initLevel();
          this.getHighScores();
          this.timeToSwitchState = 0;
          this.gameState = this.programStates.PS_GET_HIGH_SCORES;
        }
        break;
      }

      case this.programStates.PS_GET_HIGH_SCORES: {
        if (this.timeToSwitchState === 0) {
          this.timeToSwitchState = timeNow + this.globals.SPLASH_SCREEN_TIME;
        }
        else if (timeNow > this.timeToSwitchState) {
          this.timeToSwitchState = timeNow + this.globals.SPLASH_SCREEN_TIME;
          this.gameState = this.programStates.PS_SHOW_HIGH_SCORES;
        }
        break;
      }

      case this.programStates.PS_SHOW_HIGH_SCORES: {
        this.showHighScores();
        if (timeNow > this.timeToSwitchState) {
          this.timeToSwitchState = timeNow + this.globals.SPLASH_SCREEN_TIME;
          this.gameState = this.programStates.PS_INSTRUCTIONS;
        }
        break;
      }

      case this.programStates.PS_INSTRUCTIONS: {
        // redraw the damaged houses
        for (count1 = 0; count1 < this.aliveList.length; count1++) {
          this.aliveList[count1].render();
        }

        this.showInstructions();
        break;
      }

      case this.programStates.PS_BEGIN_LEVEL: {
        this.gameState = this.programStates.PS_ACTIVE;
        break;
      }

      case this.programStates.PS_ACTIVE: {
        if (this.gameTick()) {
          this.gameState = this.programStates.PS_ENDGAME;
        }
        break;
      }

      case this.programStates.PS_ENDGAME: {
        this.gameTick();
        let textLocation = this.globals.screenHeight / 2;
        let textHeight = this.globals.screenHeight / 20;

        this.globals.p5.noStroke();
        this.globals.p5.textSize(textHeight);
        this.globals.p5.fill(this.globals.colors.instructionsColor);
        this.globals.p5.textAlign(this.globals.p5.CENTER, this.globals.p5.TOP);
        this.globals.p5.text("Game Over", this.globals.screenWidth / 2, textLocation);

        this.submitScore();
        this.timeToSwitchState = timeNow + this.globals.INSTRUCTIONS_TIME;
        this.gameState = this.programStates.PS_SHOW_SCORE;
        break;
      }

      case this.programStates.PS_SHOW_SCORE: {
        if (timeNow > this.timeToSwitchState)
        {
          this.gameState = this.programStates.PS_SHOW_HIGH_SCORES;
        }
        break;
      }

      default: {
        console.log("Error: unknown gameState");
        this.gameState = this.programStates.PS_SPLASH;
        break;
      }
    }
  }


  displayScore() {
    let textLocation = 10;
    let textHeight = this.globals.screenHeight / 20;
    let theText = "Score: " + this.globals.playerScore;

    this.globals.p5.noStroke();
    this.globals.p5.textSize(textHeight);
    this.globals.p5.fill(this.globals.colors.instructionsColor);
    this.globals.p5.textAlign(this.globals.p5.CENTER, this.globals.p5.TOP);
    this.globals.p5.text(theText, this.globals.screenWidth / 2, textLocation);
  }



  keyPressed() {
    if (this.gameState === this.programStates.PS_INSTRUCTIONS) {
      this.gameState = this.programStates.PS_BEGIN_LEVEL;
    }
  }


  keyReleased() {
  }


  touchStarted() {
    if (this.gameState === this.programStates.PS_INSTRUCTIONS) {
      this.gameState = this.programStates.PS_BEGIN_LEVEL;
    }
  }


  debugTextOut(theColor, textOut) {
    this.globals.p5.textSize(this.debugHeight);
    this.globals.p5.noStroke();
    this.globals.p5.fill(theColor);
    this.globals.p5.text(textOut, 5, this.debugTextY);
    this.debugTextY += this.debugHeight;
  }


  gameTick() {
    let count1;
    let gameEnded = false;
    let timeNow = Date.now();

    this.globals.p5.textAlign(this.globals.p5.LEFT, this.globals.p5.TOP);
    this.debugTextY = 5;

    this.globals.p5.image(this.imgBackground, 0, 0, this.globals.screenWidth, this.globals.screenHeight);

//if (rockCount == 0) // For debugging: only one rock at a time {
    if (timeNow > this.nextSpewTime) {
      let newRock = new Rock(this.globals, this.globals.widthScale, this.globals.heightScale, this.rockStartLocXMin, this.rockStartLocXMax, this.rockStartLocY);
      this.aliveList.push(newRock);
      this.nextSpewTime = timeNow + this.globals.p5.random(this.spewRateMin, this.spewRateMax);
      this.rockInstance += 1;
    }
//  }

    this.rockCount = 0;

    for (count1 = 0; count1 < this.aliveList.length; count1++) {
      this.aliveList[count1].update(this.aliveList);
      this.aliveList[count1].render();
      if (!this.aliveList[count1].isAlive()) {
        this.aliveList.splice(count1, 1);
        count1 -= 1;
      }
      else if (this.aliveList[count1].getType() === this.globals.itemTypes.TYPE_ROCK) {
        this.rockCount += 1;
      }
    }

    // check for end-game situation (hero dead or both houses dead)
    if ((this.globals.theHero.getHealth() === 0) || ((this.globals.houseLeft.getHealth() === 0) && (this.globals.houseRight.getHealth() === 0))) {
      gameEnded = true;
    }

  //  debugTextOut(color('red'), "gameState = " + this.gameState);

  /*
    debugTextOut(color('red'), "System:");
  //  debugTextOut(color('black'), "playerScore = " + this.globals.playerScore);
  //  debugTextOut(color('black'), "rockCount = " + this.rockCount + "  rockInstance = " + this.rockInstance);
    debugTextOut(color('black'), "screenWidth = " + this.globals.screenWidth + "  screenHeight = " + this.globals.screenHeight);
    debugTextOut(color('black'), "widthScale = " + this.globals.widthScale + "  heightScale = " + this.globals.heightScale);
    debugTextOut(color('black'), "screenRatio = " + this.globals.screenRatio);
    debugTextOut(color('black'), "screenAreaRatio = " + this.globals.screenAreaRatio);
  */

    this.displayScore();
    return gameEnded;
  }


  submitScore() {
//      let updateScoreURL = this.baseURL + "SubmitScore.php?initials=" + this.userInitials + "&score=" + this.globals.playerScore;
  //    alert("updateScoreURL = " + updateScoreURL);
//      let xmlData = new xmlObject();
//      xmlData.fromURL(updateScoreURL);
  }


  getHighScores() {
//      let getHighScoresURL = baseURL + "GetHighScores.php";
  //    alert("getHighScoresURL = " + getHighScoresURL);
//      let xmlData = new xmlObject();
//      xmlData.urlCallback = highScoresCallback;
//      xmlData.fromURL(getHighScoresURL);
  }
    
    
  /*
  highScoresCallback(xmlObjectIn) {
    let nextInitials;
    let nextScore;
    let result = xmlObjectIn.getFirstObject("Result").value;

    if (result == "Success") {
      highScores = new Array();
      let nextHighScore = xmlObjectIn.getFirstObject("NextScore");
      while (nextHighScore) {
        nextInitials = nextHighScore.getFirstObject("initials");
        nextScore = nextHighScore.getFirstObject("score");
        highScores[highScores.length] = [ nextInitials.value, nextScore.value ];
        nextHighScore = xmlObjectIn.getNextObject("NextScore");
      }
      console.log(highScores);
    }
  }
*/


  sketch(p) {
    let canvas = null;

    p.preload = () => {
//      console.log("sketch.preload");
      this.globals.p5 = p;
      this.preload();
    }

    p.setup = (props) => {
//      console.log("sketch.setup");
    }

    p.draw = () => {
      if (canvas) {
        this.draw();
      }
      else {
        canvas = p.createCanvas(this.globals.screenWidth, this.globals.screenHeight);
        p.noStroke();
      }
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
//      console.log("sketch.myCustomRedrawAccordingToNewPropsHandler");

      if (newProps.divWidth && (newProps.divWidth > 0)) {
//        console.log("divWidth = ", newProps.divWidth, " divHeight = ", newProps.divHeight);
        this.initialize(newProps.divWidth, newProps.divHeight); 
//        console.log("screenWidth = ", this.globals.screenWidth, " screenHeight = ", this.globals.screenHeight);
      }
    }

    p.keyPressed = () => {
      if (canvas) {
        this.keyPressed();
      }
    }
  
    p.keyReleased = () => {
      if (canvas) {
        this.keyReleased();
      }
    }
  
    p.touchStarted = () => {
      if (canvas) {
        this.touchStarted();
      }
    }
  
  }


}


export default Fireball;
