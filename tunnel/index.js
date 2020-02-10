document.addEventListener('DOMContentLoaded', function(){
  main();
});

const N_CIRCLES = 10;
let MOUSE_POS = {x: null, y: null};
const INITIAL_RADIUS = 90;
const DESIRED_RADIUS = 11;
const INITIAL_OPACITY = 0;
const DESIRED_OPACITY = 1;
const INITIAL_ROTATIONAL_VELOCITY = 5;
const DESIRED_ROTATIONAL_VELOCITY = 0.5;
const ANGLE_SHIFT = Math.PI/13;
const ANGLE_RESOLUTION = Math.PI/60;
const SPIRAL_SCALE = 10;
const INITIAL_SPIRAL_SPREAD = 0.1;
const DESIRED_SPIRAL_SPREAD = 0.55;
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
  draw(ctx, circles, canvasDimensions, centerPoint, 0);
}

class Circle {
  constructor(spiralAngle, radius, angleShift, centerPoint, inverse) {
    this.baseRadius = radius;
    this.radius = radius;
    this.angleShift = angleShift;
    this.inverse = inverse;
    this.spiralAngle = spiralAngle;
    this.opacity = INITIAL_OPACITY;
    this.setCoords(centerPoint);
  }

  setCoords = (centerPoint) => {
    this.x = centerPoint.x + SPIRAL_SCALE * Math.cos(this.spiralAngle) * Math.exp(spiralSpread * this.spiralAngle);
    this.y = centerPoint.y + SPIRAL_SCALE * Math.sin(this.spiralAngle) * Math.exp(spiralSpread * this.spiralAngle);
  }

  getEdgeCoordsForAngle = (angle) => {
    angle += this.angleShift;
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
        Math.pow(i, 2.2),
        i%2 === 0 ? 0 : ANGLE_SHIFT,
        centerPoint,
        i%2 === 0
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
  spiralSpread += 0.01 * (DESIRED_SPIRAL_SPREAD - spiralSpread);
  circles.forEach((circle, i) => {
    rotationalVelocity += 0.004 * (DESIRED_ROTATIONAL_VELOCITY - rotationalVelocity)
    circle.angleShift += 0.01 * rotationalVelocity
    circle.spiralAngle += 0.02 * Math.cos(0.02 * frameNo);
    radiusScaleFactor = radiusScaleFactor + 0.01 * (DESIRED_RADIUS - radiusScaleFactor);
    circle.calculateRadius();
    circle.opacity += 0.05 * (DESIRED_OPACITY - circle.opacity);
    circle.setCoords(centerPoint);
    // if (i === 1) {
    //   console.log(circle)
    // }
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
  ctx.strokeStyle = "black";
  ctx.fillStyle = `rgb(0, 0, 0, ${circle.opacity})`;

  for (var angle=(circle.inverse? ANGLE_RESOLUTION: 0); angle<2*Math.PI; angle+=ANGLE_RESOLUTION*2) {
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