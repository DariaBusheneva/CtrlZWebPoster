// Падающий текст
const letterSpeed = 2;
const container = document.getElementById("letter-container");
const spawnDuration = 2 * 1000; // 1 second

let startTime = Date.now();
let engine,
  world,
  render,
  circles = [];

const letters = "CTRLZ^&%(*!@£#;%?>)"; // Add more letters if needed

function createCircle(x, y) {
  const circle = document.createElement("div");
  circle.className = "falling-circle";
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  const text = document.createElement("div");
  text.className = "falling-text";
  text.innerText = letters[Math.floor(Math.random() * letters.length)];
  circle.appendChild(text);

  container.appendChild(circle);
  return { circle, text };
}

function setupMatter() {
  engine = Matter.Engine.create();
  world = engine.world;
  render = Matter.Render.create({
    element: container,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      wireframes: false,
      background: "#CBCBCB",
    },
  });
}

function updatePosition(circle, body) {
  circle.style.left = `${body.position.x - circle.clientWidth / 2}px`;
  circle.style.top = `${body.position.y - circle.clientHeight / 2}px`;
}

function update() {
  const currentTime = Date.now();

  if (currentTime - startTime < spawnDuration) {
    const x = Math.random() * container.clientWidth;
    const y = 0;
    const { circle } = createCircle(x, y);

    const circleBody = Matter.Bodies.circle(x, y, circle.clientWidth / 2, {
      restitution: 0.5,
      render: {
        fillStyle: "#CBCBCB",
      },
    });

    Matter.World.add(world, [circleBody]);
    circles.push({ circle, body: circleBody });
  }

  requestAnimationFrame(update);
}

function runPhysics() {
  Matter.Engine.run(engine);
  Matter.Render.run(render);

  Matter.Events.on(engine, "collisionStart", function (event) {
    const pairs = event.pairs;

    for (const pair of pairs) {
      // Handle collisions here if needed
    }
  });
}

function animateCircles() {
  for (const { circle, body } of circles) {
    updatePosition(circle, body);
  }

  requestAnimationFrame(animateCircles);
}

function stackCircles() {
  for (const { circle, body } of circles) {
    if (body.position.y >= container.clientHeight - circle.clientHeight / 2) {
      body.position.y = container.clientHeight - circle.clientHeight / 2;
      body.velocity.y = 0;
    }
  }

  requestAnimationFrame(stackCircles);
}

setupMatter();
runPhysics();
update();
animateCircles();
stackCircles();

// ----------------------------------------------------------------------------------

// Включение лампочек
document.addEventListener("DOMContentLoaded", function () {
  const kubik = document.getElementById("kubikON");
  const lighters = document.getElementById("lighters");

  // Добавляем обработчик события клика по кубику
  kubik.addEventListener("click", function () {
    // Меняем фоновое изображение другого div при клике на кубик
    lighters.style.backgroundImage = "url(images/lightOn.svg)";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const kubik = document.getElementById("kubikOFF");
  const lighters = document.getElementById("lighters");

  // Добавляем обработчик события клика по кубику
  kubik.addEventListener("click", function () {
    // Меняем фоновое изображение другого div при клике на кубик
    lighters.style.backgroundImage = "url(images/lightDarker.svg)";
  });
});

// ----------------------------------------------------------------------------------

// Переворачивающиеся круги

document.getElementById("coin1").addEventListener("click", function () {
  this.classList.toggle("flip"); // Переключаем класс при каждом клике
});

document.getElementById("coin2").addEventListener("click", function () {
  this.classList.toggle("flip1"); // Переключаем класс при каждом клике
});
document.getElementById("coin3").addEventListener("click", function () {
  this.classList.toggle("flip"); // Переключаем класс при каждом клике
});

// ----------------------------------------------------------------------------------

// Рисующийся график

// Get the canvas element
var canvas = document.querySelector("#plot");
var ctx = canvas.getContext("2d");

// Define the function
function f(x) {
  // Solve for y using numerical methods (e.g., Newton's method)
  return x * Math.sin(Math.log(x));
}

// Set up initial scaling factors
var scaleX = 10; // pixels per unit on x-axis
var scaleY = 3; // pixels per unit on y-axis
var offsetX = canvas.width / 3.7; // x-axis offset from left
var offsetY = canvas.height / 2; // y-axis offset from top

// Draw function
function drawFunction() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw X and Y axes
  ctx.beginPath();
  ctx.moveTo(0, offsetY);
  ctx.lineTo(canvas.width, offsetY);
  ctx.moveTo(offsetX, 0);
  ctx.lineTo(offsetX, canvas.height);
  ctx.strokeStyle = "#757575";
  ctx.lineWidth = 3; // Установите желаемую толщину осей
  ctx.stroke();

  // Plot the function with dashed line
  ctx.beginPath();
  ctx.setLineDash([9, 9]); // Устанавливаем паттерн для пунктирной линии
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#757575";
  for (var pixelX = 0; pixelX < canvas.width; pixelX++) {
    var x = (pixelX - offsetX) / scaleX;
    var y = f(x);
    var pixelY = y * scaleY + offsetY;
    if (pixelX === 0) {
      ctx.moveTo(pixelX, pixelY);
    } else {
      ctx.lineTo(pixelX, pixelY);
    }
  }
  ctx.stroke();

  // Сбрасываем паттерн для пунктирной линии
  ctx.setLineDash([]);
}

// Initial draw
drawFunction();

// Add event listener for scaling using the mouse wheel
canvas.addEventListener("wheel", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение браузера
  var delta = event.deltaY;
  if (delta < 0) {
    // Zoom in
    scaleX *= 1.1; // эквивалетно scaleX = scaleX * 1.1
    scaleY *= 1.1;
  } else {
    // Zoom out
    scaleX /= 1.1;
    scaleY /= 1.1;
  }
  // Redraw function with new scale
  drawFunction();
});

// Переменная для хранения текущего смещения по оси y
var yScrollOffset = 0;

// Добавляем обработчик события для изменения смещения по оси y при скроллировании
canvas.addEventListener("wheel", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение браузера
  var delta = event.deltaY;
  if (delta < 0) {
    // Прокрутка вверх - уменьшаем смещение по оси y
    yScrollOffset -= 5; // Например, на 10 пикселей
  } else {
    // Прокрутка вниз - увеличиваем смещение по оси y
    yScrollOffset += 25; // Например, на 10 пикселей
  }
  // Перерисовываем функцию с новым смещением по оси y
  drawFunction();
});

window.addEventListener("resize", function () {
  // Update canvas dimensions
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  // Recalculate offsets to keep the origin fixed
  offsetX = canvas.width / 3.7;
  offsetY = canvas.height / 2;

  // Redraw function with new dimensions
  drawFunction();
});

// ----------------------------------------------------------------------------------

