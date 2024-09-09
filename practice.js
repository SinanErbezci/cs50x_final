// Game loop tut
let lastTime = null;
let totalTime = 0;
setInterval(function gameLoop() {
    const currentTime = Date.now();
    if (lastTime === null) {
        lastTime = currentTime;
    }
    const deltaTime = currentTime - lastTime;
    totalTime += deltaTime;
    lastTime = currentTime;
    updateMyGame(deltaTime, totalTime);
}, 1000);

function updateMyGame(deltaTime, totalTime) {

}

// Deriving Value
const currency_display = document.getElementById("currency");
let currency = 0;
const currencyPerMillisecond = 0.001;
