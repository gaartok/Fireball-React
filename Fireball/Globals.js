
class Globals {
  constructor() {
    this.p5 = null;
    this.basket = null;
    this.theHero = null;
    this.houseLeft = null;
    this.houseRight = null;
    this.playerScore = 0;
    this.screenWidth = null;
    this.screenHeight = null;
    this.widthScale = null;
    this.heightScale = null;
    this.screenRatio = null;
    this.screenAreaRatio = null;
    this.bounceYCoord = null;
    
    this.MAX_HEALTH = 100;
    
    this.levels =
       {
       LEVEL1:  1,
       LEVEL2:  2,
       LEVEL3:  3
       };
    
    
    this.LEVEL1_MIN_SCORE = 0;
    this.LEVEL2_MIN_SCORE = 100;
    this.LEVEL3_MIN_SCORE = 300;
    
    this.SPLASH_SCREEN_TIME = 4000;
    this.INSTRUCTIONS_TIME  = 10000;
    
    // Original artwork size
    this.SCREEN_WIDTH  = 640;
    this.SCREEN_HEIGHT = 480;
    
    // Location on screen where the rocks bounce.  Based on original artwork size.
    this.BOUNCE_Y_COORD = 460;
    
    this.rectSides =
       {
       LEFT:   0,
       RIGHT:  1,
       TOP:    2,
       BOTTOM: 3
       };
    
    
    this.actions =
    {
      ACTION_UNKNOWN:    0,
      ACTION_IDLE_LEFT:  1,
      ACTION_IDLE_RIGHT: 2,
      ACTION_WALK_LEFT:  3,
      ACTION_WALK_RIGHT: 4,
      ACTION_WALK_UP:    5,
      ACTION_WALK_DOWN:  6,
      ACTION_FIDGET1:    7,
      ACTION_FIDGET2:    8,
      ACTION_FIDGET3:    9,
      ACTION_DEAD:       10,
      ACTION_LAST:       11
    };
    
    this.MAX_ACTIONS = this.actions.ACTION_LAST;
    
    
    this.itemTypes =
    {
      TYPE_UNKNOWN: 0,
      TYPE_HERO:    1,
      TYPE_BASKET:  2,
      TYPE_ROCK:    3,
      TYPE_HOUSE:   4,
      TYPE_EMITTER: 5,
      TYPE_LAST:    6
    };
    
    this.colors = {
      backgroundColor   : "#3f62ae",
      textColor         : "#ffffff",
      instructionsColor : "#000039",
      debrisStartColor  : 0xee1010,
      debrisEndColor    : 0x2f2f3e
    };


    this.images = { };
    this.sounds = { };

  };
};


export default Globals;
