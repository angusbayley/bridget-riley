document.addEventListener('DOMContentLoaded', function(){
  main();
});

const N_CIRCLES = 9;
let MOUSE_POS = {x: null, y: null};
const INITIAL_RADIUS = 6;
const FINAL_RADIUS = 13;
const INITIAL_OPACITY = 0;
const FINAL_OPACITY = 1;
const INITIAL_ROTATIONAL_VELOCITY = 7;
const FINAL_ROTATIONAL_VELOCITY = 0.5;
const ANGLE_SHIFT = Math.PI/13;
const ANGLE_RESOLUTION = Math.PI/60;
const SPIRAL_SCALE = 10;
const INITIAL_SPIRAL_SPREAD = 0.1;
const FINAL_SPIRAL_SPREAD = 0.55;
const SPIRAL_WARP_RATE = 0.02;
const SPIRAL_WARP_AMOUNT = 0.9;
const CIRCLE_SIZE_RATIO = 2.1;
const INITIAL_DELAY = 500; // ms
let rotationalVelocity = INITIAL_ROTATIONAL_VELOCITY;
let radiusScaleFactor = INITIAL_RADIUS;
let spiralSpread = INITIAL_SPIRAL_SPREAD;
let circles;

main = () => {
  const c = document.getElementById("canvas");
   ctx = c.getContext('2d');
  const canvasDimensions = { x: c.width, y: c.height };
  const centerPoint = {x: canvasDimensions.x/2, y: canvasDimensions.y/2}
  circles = makeInitialCircleData(centerPoint);
  setTimeout(() => {
    draw(ctx, circles, canvasDimensions, centerPoint, 0);  
  }, INITIAL_DELAY);
}

class Circle {
  constructor(spiralAngle, radius, radialShift, centerPoint, inverse, initialOpacity) {
    this.baseRadius = radius;
    this.radius = radius;
    this.radialShift = radialShift;
    this.inverse = inverse;
    this.initialSpiralAngle = spiralAngle;
    this.spiralAngle = spiralAngle;
    this.opacity = INITIAL_OPACITY;
    this.setCoords(centerPoint);
  }

  setCoords = (centerPoint) => {
    this.x = centerPoint.x + SPIRAL_SCALE * Math.cos(this.spiralAngle) * Math.exp(spiralSpread * this.spiralAngle);
    this.y = centerPoint.y + SPIRAL_SCALE * Math.sin(this.spiralAngle) * Math.exp(spiralSpread * this.spiralAngle);
  }

  getEdgeCoordsForAngle = (angle) => {
    angle += this.radialShift;
    return {
      x: Math.sin(angle) * this.radius + this.x,
      y: Math.cos(angle) * this.radius + this.y,
    }
  }

  calculateRadius = () => {
    this.radius = this.baseRadius * radiusScaleFactor;
  }
}

makeInitialCircleData = (centerPoint) => {
  let data = [];
  

  for (let i=1; i<N_CIRCLES; i++) {
    data.push(
      new Circle(
        i * Math.PI * 2/N_CIRCLES,
        Math.pow(i, CIRCLE_SIZE_RATIO),
        i%2 === 0 ? 0 : ANGLE_SHIFT,
        centerPoint,
        i%2 === 0,
        (N_CIRCLES-i)/(2*N_CIRCLES)
      )
    );
  }
  return data;
}

draw = (ctx, circles, canvasDimensions, centerPoint, frameNo) => {
  setTimeout(() => {
    frameNo++;
    circles = updateCircles(circles, centerPoint, frameNo);
    drawFrame(ctx, circles, canvasDimensions);
    draw(ctx, circles, canvasDimensions, centerPoint, frameNo);
  }, 35);
}

updateCircles = (circles, centerPoint, frameNo) => {
  spiralSpread += 0.01 * (FINAL_SPIRAL_SPREAD - spiralSpread);
  circles.forEach((circle, i) => {
    rotationalVelocity += 0.01 * (FINAL_ROTATIONAL_VELOCITY - rotationalVelocity)
    circle.radialShift += 0.01 * rotationalVelocity
    circle.spiralAngle = circle.initialSpiralAngle + SPIRAL_WARP_AMOUNT * Math.cos(SPIRAL_WARP_RATE * frameNo + Math.PI/4);
    radiusScaleFactor = radiusScaleFactor + 0.01 * (FINAL_RADIUS - radiusScaleFactor);
    circle.calculateRadius();
    circle.opacity += 0.05 * (FINAL_OPACITY - circle.opacity);
    circle.setCoords(centerPoint);
  })
  return circles;
}

drawFrame = (ctx, circles, canvasDimensions) => {
  ctx.clearRect(0, 0, canvasDimensions.x, canvasDimensions.y);
  circles.forEach((circle, i) => {
    if (circles.length === i+1) return;
    nextCircle = circles[i+1]
    drawCircleConnectors(ctx, circle, nextCircle);
  });
}

drawCircleConnectors = (ctx, circle, nextCircle) => {
  ctx.fillStyle = `rgb(0, 0, 0, ${circle.opacity})`;

  for (let angle=(circle.inverse ? ANGLE_RESOLUTION : ANGLE_RESOLUTION*2); angle<2*Math.PI; angle+=ANGLE_RESOLUTION*2) {
    ctx.beginPath();
    coords0 = circle.getEdgeCoordsForAngle(angle);
    ctx.moveTo(coords0.x, coords0.y);
    coords1 = circle.getEdgeCoordsForAngle(angle + ANGLE_RESOLUTION);
    ctx.lineTo(coords1.x, coords1.y);
    coords2 = nextCircle.getEdgeCoordsForAngle(angle + ANGLE_RESOLUTION);
    ctx.lineTo(coords2.x, coords2.y);
    coords3 = nextCircle.getEdgeCoordsForAngle(angle);
    ctx.lineTo(coords3.x, coords3.y);
    ctx.closePath();
    ctx.fill();
  }
}