document.addEventListener('DOMContentLoaded', function(){
  main();
});

const GRID_SIZE = {x: 8, y: 8};
const MARGINS = {x: 60, y: 60};
const DECAY_TIME = 0.8;
let MOUSE_POS = {x: null, y: null};

const CIRCLE_SHARED_PROPERTIES = {
  OUTER_RADIUS: 25,
  INNER_RADIUS_X: 14,
  INNER_RADIUS_Y: 19,
}

main = () => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext('2d');
  const canvasDimensions = { x: c.width, y: c.height };
  let circles = makeInitialCircleData(canvasDimensions);
  document.addEventListener('mousemove', (e) => {
    updateMousePos(c, e);
  });
  draw(ctx, circles, canvasDimensions);
}

updateMousePos = (canvas, evt) => {
  let rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;

  MOUSE_POS.x = (evt.clientX - rect.left) * scaleX;
  MOUSE_POS.y = (evt.clientY - rect.top) * scaleY;
}

class Circle {
  constructor(coords) {
    this.x = coords.x;
    this.y = coords.y;
    this.radius = CIRCLE_SHARED_PROPERTIES.OUTER_RADIUS;
    this.innerRadiusX = CIRCLE_SHARED_PROPERTIES.INNER_RADIUS_X;
    this.innerRadiusY = CIRCLE_SHARED_PROPERTIES.INNER_RADIUS_Y;
    this.initialAngle = 0;
    this.angle = this.initialAngle;
  }
}

calculateCoord = (canvasDimensions, i, j) => {
  const reducedCanvasDimensions = {
    x: canvasDimensions.x - MARGINS.x*2,
    y: canvasDimensions.y - MARGINS.y*2
  };

  const unitSize = {
    x: reducedCanvasDimensions.x/(GRID_SIZE.x-1),
    y: reducedCanvasDimensions.y/(GRID_SIZE.y-1),
  };

  return { x: MARGINS.x + i * unitSize.x, y: MARGINS.y + j * unitSize.y};
}

makeInitialCircleData = (canvasDimensions) => {
  let data = [];
  for (let i=0; i<GRID_SIZE.y; i++) {
    for (let j=0; j<GRID_SIZE.x; j++) {
      data.push(new Circle(calculateCoord(canvasDimensions, i, j)));
    }
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

let oldIdealAngleDiff = 0;

updateCircles = (circles) => {
  // TODO: update angles so they point towards the mouse
  return circles;
}


drawFrame = (ctx, circles, canvasDimensions) => {
  ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  circles.forEach((circle) => {
    drawCircle(ctx, circle);
  });
}

drawCircle = (ctx, circle) => {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, CIRCLE_SHARED_PROPERTIES.OUTER_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(circle.x, circle.y, circle.innerRadiusX, circle.innerRadiusY, circle.angle, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}