  
// ----------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    const arrowsAndCloud = document.getElementById("arrows_and_cloud");
    const leftController = document.getElementById("left-controller");
    const rightController = document.getElementById("right-controller");
  
    arrowsAndCloud.addEventListener("click", function() {
      moveControllers();
    });
  
    function moveControllers() {
      leftController.style.transition = "left 1s ease-in-out";
      leftController.style.left = "5%";
  
      rightController.style.transition = "left 1s ease-in-out";
      rightController.style.left = "65%"; 

      leftController.addEventListener("transitionend", function() {
        leftController.style.transition = "left 1s ease-in-out"; 
        leftController.style.left = "11%"; 
      });
  
      rightController.addEventListener("transitionend", function() {
        rightController.style.transition = "left 1s ease-in-out";
        rightController.style.left = "60%"; 
      });
    }
  });
 // ----------------------------------------------------------------------------------
 

// Падающий текст
const letterSpeed = 2;
const container = document.getElementById("letter-container");
const spawnDuration = 2000;

let startTime = Date.now();
let engine,
  world,
  render,
  circles = [];

const letters = "CTRLZ!+"; 

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

  
  world.gravity.y = 0.2;
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
      // Handle collisions here maybe
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
    if (body.position.y >= container.clientHeight - circle.clientHeight / -10) {
      body.position.y = container.clientHeight - circle.clientHeight / -10;
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
  const kubik1 = document.getElementById("kubikON");
  const lighters = document.getElementById("lighters");


  kubik1.addEventListener("click", function () {

    lighters.style.backgroundImage = "url(images/lightOn.svg)";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const kubik1 = document.getElementById("kubikOFF");
  const lighters = document.getElementById("lighters");


  kubik1.addEventListener("click", function () {

    lighters.style.backgroundImage = "url(images/lightDarker.svg)";
  });
});

// ----------------------------------------------------------------------------------

// Переворачивающиеся круги

document.getElementById("coin1").addEventListener("click", function () {
  this.classList.toggle("flip"); 
});

document.getElementById("coin2").addEventListener("click", function () {
  this.classList.toggle("flip1"); 
});
document.getElementById("coin3").addEventListener("click", function () {
  this.classList.toggle("flip"); 
});

// ----------------------------------------------------------------------------------

// Рисующийся график

let canvas = document.querySelector("#plot");
let ctx = canvas.getContext("2d");

function f(x) {
  return x * Math.sin(Math.log(x));
}

let scaleX = 10; 
let scaleY = 3; 
let offsetX = canvas.width / 3.7; 
let offsetY = canvas.height / 2; 

function drawFunction() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw X and Y axes
  ctx.beginPath();
  ctx.moveTo(0, offsetY);
  ctx.lineTo(canvas.width, offsetY);
  ctx.moveTo(offsetX, 0);
  ctx.lineTo(offsetX, canvas.height);
  ctx.strokeStyle = "#757575";
  ctx.lineWidth = 3; 
  ctx.stroke();

  // Plot the function with dashed line
  ctx.beginPath();
  ctx.setLineDash([9, 9]); 
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#757575";
  for (let pixelX = 0; pixelX < canvas.width; pixelX++) {
    let x = (pixelX - offsetX) / scaleX;
    let y = f(x);
    let pixelY = y * scaleY + offsetY;
    if (pixelX === 0) {
      ctx.moveTo(pixelX, pixelY);
    } else {
      ctx.lineTo(pixelX, pixelY);
    }
  }
  ctx.stroke();


  ctx.setLineDash([]);
}

// Initial draw
drawFunction();

canvas.addEventListener("wheel", function (event) {
  event.preventDefault(); 
  let delta = event.deltaY;
  if (delta < 0) {
    // Zoom in
    scaleX *= 1.1; 
    scaleY *= 1.1;
  } else {
    // Zoom out
    scaleX /= 1.1;
    scaleY /= 1.1;
  }

  drawFunction();
});


let yScrollOffset = 0;


canvas.addEventListener("wheel", function (event) {
  event.preventDefault(); 
  let delta = event.deltaY;
  if (delta < 0) {

    yScrollOffset -= 5; 
  } else {

    yScrollOffset += 25; 
  }

  drawFunction();
});

window.addEventListener("resize", function () {

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;


  offsetX = canvas.width / 3.7;
  offsetY = canvas.height / 2;


  drawFunction();
});

// ----------------------------------------------------------------------------------


let circleCount = 0;
const maxCircles = 40; 

function addCircle() {
  if (circleCount >= maxCircles) return; 
  circleCount++; 
  const circleContainer = document.querySelector(".line-with-rounds");
  if (!circleContainer) return; 
  const circle = document.createElement("div");
  const outerCircle = document.createElement("div");
  const innerCircle = document.createElement("div");

  circle.classList.add("round");
  outerCircle.classList.add("outer-circle");
  innerCircle.classList.add("inner-circle");

  const circleSize = 40; 
  const containerRect = circleContainer.getBoundingClientRect();
  const left = Math.random() * (containerRect.width - circleSize);
  const top = Math.random() * (containerRect.height - circleSize);

  circle.style.left = `${left}px`;
  circle.style.top = `${top}px`;
  circle.appendChild(outerCircle);
  circle.appendChild(innerCircle);
  circleContainer.appendChild(circle);

  circle.addEventListener("click", removeCircle);

  setInterval(() => {
    const deltaX = (Math.random() - 0.5) * 10; 
    const deltaY = (Math.random() - 0.5) * -10; 
    const circleRect = circle.getBoundingClientRect();
    const newLeft = circleRect.left + deltaX;
    const newTop = circleRect.top + deltaY;
  }, 2500); 
}

// Функция для удаления кружка при клике
function removeCircle(event) {
  const innerCircle = event.target;
  const parentElement = innerCircle.parentNode;
  if (!parentElement) return; 
  parentElement.removeChild(innerCircle); 
  parentElement.removeChild(parentElement.firstChild); 
}

setInterval(addCircle, 1000);

// --------------------------------------------------------------------------------------------------------

// Слайдер
let sliders = document.querySelectorAll(".slider");

sliders.forEach(function (slider) {
  let out1 = slider.querySelector(".plugout, .plugout2");
  let sliderRect = slider.getBoundingClientRect();

  // Генерация случайного положения plugout
  let randomLeft = Math.random() * (sliderRect.width - out1.offsetWidth);
  out1.style.left =
    Math.max(
      20,
      Math.min(randomLeft, sliderRect.width - out1.offsetWidth - 20)
    ) + "px";
  out1.style.top = "13%";

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
    let sliderRect = slider.getBoundingClientRect();
    let newLeft = clientX - sliderRect.left;
    // let newLeft = sliderRect.width - out1.offsetWidth + 20;
    let rightLimit = sliderRect.width - out1.offsetWidth + 20;
    // let leftLimit = 20;

    if (newLeft <= 12) {
      out1.style.left = 12 + "px";
    }
    else if (newLeft >= rightLimit) {
      out1.style.left = rightLimit + "px";
    }
    else {
      out1.style.left = newLeft - out1.offsetWidth / 2 + "px";
    }
  }

  function up() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  }
});

// --------------------------------------------------------------------------------------------------------

// Переворачивающиеся по клику палочки-соединители

document.getElementById("rotateline1").addEventListener("click", function () {
  this.classList.toggle("flip-line");
});

document.getElementById("rotateline2").addEventListener("click", function () {
  this.classList.toggle("flip-line");
});
document.getElementById("rotateline3").addEventListener("click", function () {
  this.classList.toggle("flip-line");
});

// --------------------------------------------------------------------------------------------------------

// Еще одни переворачивающиеся по клику палочки-соединители
document
  .getElementById("rotateconnector1")
  .addEventListener("click", function () {
    this.classList.toggle("flip-line");
  });

document
  .getElementById("rotateconnector2")
  .addEventListener("click", function () {
    this.classList.toggle("flip-line");
  });
document
  .getElementById("rotateconnector3")
  .addEventListener("click", function () {
    this.classList.toggle("flip-connector");
  });

document
  .getElementById("rotateconnector5")
  .addEventListener("click", function () {
    this.classList.toggle("flip-connector");
  });

// --------------------------------------------------------------------------------------------------------

// Появление коннекторов
document.addEventListener("DOMContentLoaded", function () {
  const kubik = document.getElementById("square1_3");

  kubik.addEventListener("click", function () {
    kubik.style.backgroundImage = "url(images/connect.svg)";
    kubik.style.width = "68%"; 
    kubik.style.height = "103%"; 
    kubik.style.transform = "translate(49%, 3%) rotate(-90deg)";
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square2_3");  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(49%, 3%) rotate(-90deg)";
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square3_3");  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(24%, 20%)";
    });
  });

document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square4_3");  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(24%, -13%) rotate(180deg)";
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square5_3");
    const letterB = document.getElementById("letterB");
  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(24%, 20%)";
      letterB.style.height = "56%"
      letterB.style.transform = "translate(0px, -29%)"
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square6_3");  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(-1%, 3%) rotate(90deg)";
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square7_3"); 
    const letterA = document.getElementById("letterA"); 
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(25%, -14%) rotate(180deg)";
      letterA.style.height = "56%"
      letterA.style.transform = "translate(0px, -29%) rotate(180deg)"
    });
  });


  document.addEventListener("DOMContentLoaded", function () {
    const kubik = document.getElementById("square8_3");  
    kubik.addEventListener("click", function () {
      kubik.style.backgroundImage = "url(images/connect.svg)";
      kubik.style.width = "68%"; 
      kubik.style.height = "103%"; 
      kubik.style.transform = "translate(49%, 4%) rotate(-90deg)";
    });
  });