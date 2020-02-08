document.addEventListener('DOMContentLoaded', function(){
  main();
});

const N_CIRCLES = 8;
let MOUSE_POS = {x: null, y: null};
const INITIAL_RADIUS = 10;
const ANGLE_SHIFT = Math.PI/15;
const ANGLE_RESOLUTION = Math.PI/40;
let circles;

main = () => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext('2d');
  const canvasDimensions = { x: c.width, y: c.height };
  circles = makeInitialCircleData(canvasDimensions);
  draw(ctx, circles, canvasDimensions);
}

class Circle {
  constructor(spiralAngle, radius, angleShift, centerPoint) {
    this.radius = radius;
    this.angleShift = angleShift;
    this.a = 10;
    this.b = 0.4;
    this.setCoords(spiralAngle, centerPoint);
  }

  setCoords = (angle, centerPoint) => {
    this.x = centerPoint.x + this.a * Math.cos(angle) * Math.exp(this.b * angle);
    this.y = centerPoint.y + this.a * Math.sin(angle) * Math.exp(this.b * angle);
  }

  getEdgeCoordsForAngle(angle) {
    angle += this.angleShift;
    return {
      x: Math.sin(angle) * this.radius + this.x,
      y: Math.cos(angle) * this.radius + this.y,
    }
  }
}

makeInitialCircleData = (canvasDimensions) => {
  let data = [];
  let centerPoint = {x: canvasDimensions.x/2, y: canvasDimensions.y/2}

  for (let i=1; i<N_CIRCLES; i++) {
    data.push(
      new Circle(
        i * Math.PI * 2/N_CIRCLES,
        Math.pow(i, 2.1)*INITIAL_RADIUS,
        i%2 === 0 ? 0 : ANGLE_SHIFT,
        centerPoint
      )
    );
  }
  return data;
}

draw = (ctx, circles, canvasDimensions) => {
  setTimeout(() => {
    circles = updateCircles(circles);
    drawFrame(ctx, circles, canvasDimensions);
    draw(ctx, circles, canvasDimensions);
  }, 50);
}

updateCircles = (circles) => {
  // TODO
  return circles;
}

drawFrame = (ctx, circles, canvasDimensions) => {
  ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  circles.forEach((circle, i) => {
    if (circles.length === i+1) return;
    nextCircle = circles[i+1]
    drawCircleConnectors(ctx, circle, nextCircle);
  });
}

drawCircleConnectors = (ctx, circle, nextCircle) => {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";

  for (var angle=0; angle<2*Math.PI; angle+=ANGLE_RESOLUTION*2) {
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