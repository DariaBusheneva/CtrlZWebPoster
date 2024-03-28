// Падающий текст
const letterSpeed = 2;
const container = document.getElementById("letter-container");
const spawnDuration = 2000;

let startTime = Date.now();
let engine,
  world,
  render,
  circles = [];

const letters = "CTRLZ!+"; // Add more letters if needed

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

  // Установка гравитации и коэффициента упругости
  world.gravity.y = 0.2; // Уменьшаем гравитацию для уменьшения скорости падения
}

function updatePosition(circle, body) {
  circle.style.left = `${body.position.x - circle.clientWidth / 1}px`;
  circle.style.top = `${body.position.y - circle.clientHeight / 1}px`;
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

// Удаляющиеся кружки
let circleCount = 0; // Счетчик созданных кружков
const maxCircles = 40; // Максимальное количество кружков
// Функция для добавления нового кружка
function addCircle() {
  if (circleCount >= maxCircles) return; // Проверяем, достигнут ли предел кружков
  circleCount++; // Увеличиваем счетчик
  const circleContainer = document.querySelector(".line-with-rounds");
  if (!circleContainer) return; // Проверяем существование контейнера
  const circle = document.createElement("div");
  const outerCircle = document.createElement("div");
  const innerCircle = document.createElement("div");

  circle.classList.add("round");
  outerCircle.classList.add("outer-circle");
  innerCircle.classList.add("inner-circle");

  const circleSize = 40; // Диаметр круга
  const containerRect = circleContainer.getBoundingClientRect();
  const left = Math.random() * (containerRect.width - circleSize);
  const top = Math.random() * (containerRect.height - circleSize);

  circle.style.left = `${left}px`;
  circle.style.top = `${top}px`;
  circle.appendChild(outerCircle);
  circle.appendChild(innerCircle);
  circleContainer.appendChild(circle);

  // Добавляем обработчик событий для удаления круга при клике
  circle.addEventListener("click", removeCircle);

  // Добавляем случайные значения для изменения позиции
  setInterval(() => {
    const deltaX = (Math.random() - 0.5) * 10; // Случайное значение для изменения позиции по горизонтали
    const deltaY = (Math.random() - 0.5) * -10; // Случайное значение для изменения позиции по вертикали
    const circleRect = circle.getBoundingClientRect();
    const newLeft = circleRect.left + deltaX;
    const newTop = circleRect.top + deltaY;
  }, 2500); // Обновляем позицию каждые 0.5 секунды
}

// Функция для удаления кружка при клике
function removeCircle(event) {
  const innerCircle = event.target;
  const parentElement = innerCircle.parentNode;
  if (!parentElement) return; // Проверяем существование родительского элемента
  parentElement.removeChild(innerCircle); // Удаляем внутренний круг
  parentElement.removeChild(parentElement.firstChild); // Удаляем внешний круг
}

// Добавляем новый кружок каждую секунду
setInterval(addCircle, 1000);

// --------------------------------------------------------------------------------------------------------

// Слайдер
var sliders = document.querySelectorAll(".slider");

sliders.forEach(function (slider) {
  var out1 = slider.querySelector(".plugout");
  var sliderRect = slider.getBoundingClientRect();

  // Генерация случайного положения plugout только по горизонтали
  var randomLeft = Math.random() * (sliderRect.width - out1.offsetWidth);
  out1.style.left =
    Math.max(
      20,
      Math.min(randomLeft, sliderRect.width - out1.offsetWidth - 20)
    ) + "px";
  out1.style.top = "15%";

  out1.addEventListener("mousedown", down);

  function down(e) {
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }

  function move(e) {
    out1.style.position = "absolute";
    updatePosition(e.clientX);
  }

  function updatePosition(clientX) {
    var sliderRect = slider.getBoundingClientRect();
    var newLeft = clientX - sliderRect.left;
    // var newLeft = sliderRect.width - out1.offsetWidth + 20;
    var rightLimit = sliderRect.width - out1.offsetWidth + 20;
    // var leftLimit = 20;

    // Проверка, чтобы plugout не выезжал за пределы слайдера справа
    if (newLeft <= 12) {
      out1.style.left = 12 + "px";
    }
    // Проверка, чтобы plugout не выезжал за пределы слайдера слева
    else if (newLeft >= rightLimit) {
      out1.style.left = rightLimit + "px";
    }
    // В противном случае позволяется перемещение plugout
    else {
      out1.style.left = newLeft - out1.offsetWidth / 2 + "px";
    }
  }

  function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  }
});
