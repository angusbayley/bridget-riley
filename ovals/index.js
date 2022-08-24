document.addEventListener('DOMContentLoaded', function(){
  main();
});

const GRID_SIZE = {x: 10, y: 10};
const MARGINS = {x: 120, y: 120};
const DECAY_TIME = 0.8;
const MOUSE_PULL = 0.2;
const PULL_RADIUS = 2800;
const SHOW_METADATA = false;
let MOUSE_POS = {x: null, y: null};

const CIRCLE_SHARED_PROPERTIES = {
  OUTER_RADIUS: 60,
  INNER_RADIUS_X: 40,
  INNER_RADIUS_Y: 52,
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
    this.idealAngle = this.initialAngle;
    this.idealAngleModifier = 0;
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

  return {
    x: (j%2 === 0 ? MARGINS.x + i * unitSize.x : MARGINS.x + i * unitSize.x + unitSize.x/2),
    y: MARGINS.y + j * unitSize.y};
}

makeInitialCircleData = (canvasDimensions) => {
  let data = [];
  for (let i=0; i<GRID_SIZE.x; i++) {
    for (let j=0; j<GRID_SIZE.y; j++) {
      if (j%2 === 0 || i < GRID_SIZE.x - 1) {
        data.push(new Circle(calculateCoord(canvasDimensions, i, j)));
      }
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
  // update angles so they point towards the mouse
  circles.forEach((circle, i) => {
    const yDiff = MOUSE_POS.y - circle.y;
    const xDiff = MOUSE_POS.x - circle.x;
    const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    

    // [x] calculate single valued ideal angle
    // [x] track previous single valued ideal angle
    // [ ] if current is more than π smaller than previous, add π to angle modifier

    const singleValuedIdealAngle = Math.atan(yDiff / xDiff);
    const previousIdealAngle = circle.idealAngle;
    circle.idealAngle = singleValuedIdealAngle + circle.idealAngleModifier + Math.PI/2

    if (circle.idealAngle < (previousIdealAngle - 0.8*Math.PI)) {
      circle.idealAngleModifier += Math.PI;
      circle.idealAngle += Math.PI;
    }
    else if (circle.idealAngle > (previousIdealAngle + 0.8*Math.PI)) {
      circle.idealAngleModifier -= Math.PI;
      circle.idealAngle -= Math.PI;
    }

    let idealAngleDiff = circle.idealAngle - circle.angle;
    const initialAngleDiff = circle.initialAngle - circle.angle;
    // TODO: some magic numbers in here
    circle.angle = distance > PULL_RADIUS ? circle.angle : circle.angle + MOUSE_PULL * 0.9 * (1-Math.pow(distance/PULL_RADIUS, 1/1)) * idealAngleDiff;
    
    if (SHOW_METADATA) showMetadata(circle, previousIdealAngle, i);
  });
  return circles;
}

showMetadata = (circle, previousIdealAngle, i) => {
  if (i===0) {
    document.getElementById("metadata").innerHTML = (
      `angle: ${Math.round(circle.angle*100)/100}<br>
      idealAngle: ${Math.round(circle.idealAngle*100)/100}<br>
      previousIdealAngle: ${Math.round(previousIdealAngle*100)/100}<br>
      idealAngleModifier: ${Math.round(circle.idealAngleModifier*100)/100}`
    );
  }
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