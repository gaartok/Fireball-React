

class Point {
	constructor(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	}

	add(v) {
	return new Point(this.x + v.x, this.y + v.y);
	}

  clone(){
	return new Point(this.x, this.y);
	}

  degreesTo(v){
	var dx = this.x - v.x;
	var dy = this.y - v.y;
	var angle = Math.atan2(dy, dx); // radians
	return angle * (180 / Math.PI); // degrees
	}

/*
  distance(v){
	var x = this.x - v.x;
	var y = this.y - v.y;
	return Math.sqrt(x * x + y * y);
	}
*/

  equals(toCompare){
	return (this.x === toCompare.x) && (this.y === toCompare.y);
	}


  length(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
	}

  normalize(thickness){
	var l = this.length();
	this.x = this.x / l * thickness;
	this.y = this.y / l * thickness;
	}

  orbit(origin, arcWidth, arcHeight, degrees){
	var radians = degrees * (Math.PI / 180);
	this.x = origin.x + arcWidth * Math.cos(radians);
	this.y = origin.y + arcHeight * Math.sin(radians);
	}

  offset(dx, dy){
	this.x += dx;
	this.y += dy;
	}

  subtract(v){
	return new Point(this.x - v.x, this.y - v.y);
	}

  toString(){
	return "(x=" + this.x + ", y=" + this.y + ")";
	}
 
	polar(len, angle){
	return new Point(len * Math.cos(angle), len * Math.sin(angle));
	}

/*
	distance(pt1, pt2){
	var x = pt1.x - pt2.x;
	var y = pt1.y - pt2.y;
	return Math.sqrt(x * x + y * y);
	}
*/
}

export default Point;
