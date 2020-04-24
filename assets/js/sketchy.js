class Shape {

  constructor(myX, myY, myWidth, myHeight, myFill, isSelected) {
    this.myX = myX;
    this.myY = myY;
    this.myWidth = myWidth;
    this.myHeight = myHeight;
    this.myFill = myFill;
    this.isSelected = isSelected;
    this.myAngle = 0;
    this.dx = myX;
    this.dy = myY;
  }

  draw() {
    fill(this.myFill);
    translate(this.dx, this.dy);
    rotate(this.myAngle);
    if (this.isSelected) {
      stroke(color(0, 255, 255));
      strokeWeight(2);
    } else {
      noStroke();
    }
    translate(-this.dx, -this.dy);
  }

  resize(prevX, prevY, currX, currY) {
    let dx = abs(currX - prevX);
    let dy = abs(currY - prevY);
    let centerX = this.getCenterX();
    let centerY = this.getCenterY();
    if (prevX - currX < 0) {
      if (prevX <= centerX) {
        this.myWidth = this.myWidth + 2 * -dx;
      } else {
        this.myWidth = this.myWidth + 2 * dx;
      }
    } else {
      if (prevX <= centerX) {
        this.myWidth = this.myWidth + 2 * dx;
      } else {
        this.myWidth = this.myWidth + 2 * -dx;
      }
    }
    if (prevY - currY < 0) {
      if (prevY < centerY) {
        this.myHeight = this.myHeight + 2 * -dy;
      } else {
        this.myHeight = this.myHeight + 2 * dy;
      }
    } else {
      if (prevY < centerY) {
        this.myHeight = this.myHeight + 2 * dy;
      } else {
        this.myHeight = this.myHeight + 2 * -dy;
      }
    }
  }

  translate(prevX, prevY, currX, currY) {
    let dx = currX - prevX;
    let dy = currY - prevY;
    this.dx += dx;
    this.dy += dy;
    this.myX += dx;
    this.myY += dy;
  }
  

  rotate(prevX, prevY, currX, currY) {
    let centerX = this.getCenterX();
    let centerY = this.getCenterY();
    
    this.myAngle -= atan2(prevY - centerY, prevX - centerX) - atan2(currY - centerY, currX - centerX);
  }
  
  changeFill(fill) {
    this.myFill = fill;
  }
  
  contains(x, y) {
    throw new Error("You have to override this method.");
  }
}

class Rectangle extends Shape {

  constructor(myX, myY, myWidth, myHeight, myFill) {
    super(myX, myY, myWidth, myHeight, myFill, true);
  }

  draw() {
    push();
    super.draw();
    rect(this.myX, this.myY, this.myWidth, this.myHeight);
    pop();
  }

  resize(prevX, prevY, currX, currY) {
    let oldWidth = this.myWidth;
    let oldHeight = this.myHeight;
    super.resize(prevX, prevY, currX, currY);
    this.myX += (oldWidth - this.myWidth) / 2;
    this.myY += (oldHeight - this.myHeight) / 2;
  }

  contains(x, y) {
    let myX2 = this.myX + this.myWidth;
    let myY2 = this.myY + this.myHeight;
    if (x >= min(this.myX, myX2) && x <= max(this.myX, myX2)) {
      if (y >= min(this.myY, myY2) && y <= max(this.myY, myY2)) {
        this.isSelected = true;
        return true;
      }
    }
    this.isSelected = false;
    return false;
  }

  getCenterX() {
    return this.myX;
  }

  getCenterY() {
    return this.myY;
  }
}

class Ellipse extends Shape {
  constructor(myX, myY, myWidth, myHeight, myFill) {
    super(myX, myY, myWidth, myHeight, myFill, true);
  }

  draw() {
    push();
    super.draw();
    ellipse(this.myX, this.myY, this.myWidth, this.myHeight);
    pop();
  }

  resize(prevX, prevY, currX, currY) {
    super.resize(prevX, prevY, currX, currY);
  }

  contains(x, y) {
    if (((Math.pow((x - this.getCenterX()), 2) / Math.pow(this.myWidth, 2)) + (Math.pow((y - this.getCenterY()), 2) / Math.pow(this.myHeight, 2))) <= 1) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
    }
    return this.isSelected;
  }

  getCenterX() {
    return this.myX;
  }

  getCenterY() {
    return this.myY;
  }
}

class Line {

  constructor(x1, y1, x2, y2, myColor) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.myColor = myColor;
  }

  draw() {
    stroke(this.myColor);
    line(this.x1, this.y1, this.x2, this.y2);
  }

}

let shapes = [];
let lines = [];
let currShape;

let x = 0;
let y = 0;
let mode = 0; // 0 = pen, 1 = rect, 2 = ellipse
let colorPicker;

let img;
let cnv;

function preload() {
  img = loadImage("assets/greece.jpg");
}

function setup() {
  angleMode(DEGREES);

  cnv = createCanvas((3049/4390) * windowHeight, windowHeight);
  cnv.parent('sketchy-holder');
  
  colorPicker = createColorPicker('#ed225d');
  colorPicker.parent('color-picker-holder');
}

function draw() {
  image(img, 0, 0, (3049/4390) * windowHeight, windowHeight);


  if (mouseIsPressed && mode == 0) {
    lines.push(new Line(pmouseX, pmouseY, mouseX, mouseY, colorPicker.color()));
  }

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].draw();
  }

  for (let j = 0; j < lines.length; j++) {
    lines[j].draw();
  }
}

function keyTyped() {
  if (key === 'r') {
    mode = 1;
  } else if (key === 'e') {
    mode = 2;
  } else if (key === 'l') {
    mode = 0;
  } else if (key === 's') {
    mode = 3;
  } else if (key === 'c') {
    currShape.changeFill(colorPicker.color());
  }
}

function keyPressed() {
  if (keyCode === DELETE) {
    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i] === currShape) {
        shapes.splice(i, i + 1);
      }
    }  
  } else if (keyCode === ESCAPE) {
    shapes.splice(0);
    lines.splice(0);
  } else if (keyCode === ENTER) {
    saveCanvas(cnv, 'my_canvas', 'jpg');
  }
}


function mousePressed() {
  if (currShape != null) {
    currShape.isSelected = false;
  }
  if (mode == 1) {
    currShape = new Rectangle(mouseX, mouseY, 0, 0, colorPicker.color());
    shapes.push(currShape);
  } else if (mode == 2) {
    currShape = new Ellipse(mouseX, mouseY, 0, 0, colorPicker.color());
    shapes.push(currShape);
  } else if (mode == 3) {
    currShape = null;
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].contains(mouseX, mouseY)) {
        currShape = shapes[i];
        break;
      }
    }
  }
}

function mouseDragged() {
  if (mode > 0) {
    if (mode < 3 || keyIsDown(CONTROL)) {
      if (currShape) {
        currShape.resize(pmouseX, pmouseY, mouseX, mouseY);
      }
    } else if (mode == 3 && keyIsDown(SHIFT)) {
        if (currShape) {
          currShape.rotate(pmouseX, pmouseY, mouseX, mouseY);
        }
    } else {
        if (currShape) {
          currShape.translate(pmouseX, pmouseY, mouseX, mouseY);
        }
    }
  }
}