document.addEventListener('DOMContentLoaded', function(){
  main();
});

const N_CIRCLES = 5;
const MARGINS = {x: 60, y: 60};
const DECAY_TIME = 0.8;
const MOUSE_PULL = 1;
const SHOW_METADATA = true;
let MOUSE_POS = {x: null, y: null};

main = () => {
  const c = document.getElementById("canvas");
  const ctx = c.getContext('2d');
  const canvasDimensions = { x: c.width, y: c.height };
  let circles = makeInitialCircleData(canvasDimensions);
  draw(ctx, circles, canvasDimensions);
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
    this.idealAngle = this.initialAngle;
    this.idealAngleModifier = 0;
  }
}

calculateCoord = (canvasDimensions, i) => {
  const reducedCanvasDimensions = {
    x: canvasDimensions.x - MARGINS.x*2,
    y: canvasDimensions.y - MARGINS.y*2
  };

  // const unitSize = {
  //   x: reducedCanvasDimensions.x/(GRID_SIZE.x-1),
  //   y: reducedCanvasDimensions.y/(GRID_SIZE.y-1),
  // };

  // return { x: MARGINS.x + i * unitSize.x, y: MARGINS.y + j * unitSize.y};
}

makeInitialCircleData = (canvasDimensions) => {
  let data = [];
  for (let i=0; i<N_CIRCLES; i++) {
    data.push(new Circle(calculateCoord(canvasDimensions, i)));
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
  circles.forEach((circle) => {
    drawCircle(ctx, circle);
  });
}

drawCircle = (ctx, circle) => {
  // TODO
  return
}