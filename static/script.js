import { giveLine,  addClass, removeClass, formatWord, checkSuccess, typingGame} from "./typing.js";

document.addEventListener("DOMContentLoaded", main);
var weekProgress = Array(11).fill(0.0);
var gameIntervals = [];
var activeWeek;
var typGameStatus = false;


function main() {

    const startBtns = document.querySelectorAll('.cs-week-title button');
    startBtns.forEach( btn => {
        btn.addEventListener("click", gameLoop);
    })

    const btn = document.querySelector("#plus");
    const progress = document.querySelector("#progress");
    btn.addEventListener("click", () => {
        let percent = parseInt(progress.innerHTML);
        percent += 1;
        progress.innerHTML = `${percent}%`;
        progress.style.width = `${percent}%`;
    });

    var textWrapper = document.querySelector('.animated');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: false})
    .add({
        targets: '.animated .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i+1)
    });



}

function gameLoop() {
    if (activeWeek) removeClass(activeWeek, 'active');
    addClass(this, 'active');
    activeWeek = this;
    for ( var i = 0; i < gameIntervals.length; i++) {
        clearInterval(gameIntervals[i]);
    }
    let week = this.dataset.week;
    var currentProgress = weekProgress[this.dataset.week]
    console.log(currentProgress);
    gameIntervals.push( setInterval( () => {
        weekProgress[week] += 0.1;
        console.log(`${week}`,weekProgress[week]);
        if (!typGameStatus) {
            typGameStatus = true;
            console.log("typing game start");
            let success = typingGame(this.dataset.week);
                if (success) {
                weekProgress[week] += 5;
                console.log("sucess");
                updateBar();}
                else {
                    console.log("fail");
                }
            typGameStatus = false;
        }
    }, 1000));
}   

function updateBar() {

}