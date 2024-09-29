// Loading data from localstroge
var weekProgress =  JSON.parse(localStorage.getItem("weekProgress"));
var weekFinished = JSON.parse(localStorage.getItem("weekFinished"));
var finishedWeeks = JSON.parse(localStorage.getItem("finishedWeeks"));
// First Time
if (!weekProgress) {
    weekProgress = Array(11).fill(0.0);
    weekFinished = Array(11).fill(false);
    finishedWeeks = 0;
    const myModal = bootstrap.Modal.getOrCreateInstance('#startModal');
    myModal.show();
}
// Global Variables
var gameIntervals = [];
var activeWeek;
var typGameStatus = false;
var cursorIndex = 0;
var typingEventBinded;
var gameElem = document.querySelector('.game');
var progressBar = document.querySelector('.progress-bar');
var textAnimate = document.querySelector('.text-animate');
var profile = {
    "beginner": {
        "img": "beginner_1024x1024.jpeg",
        "about": "This is you. You are just a noob programmer. Everything confuses you. You've heard about this course called CS50x. You hope this course makes you a better programmer."
    },
    "mid": {
        "img": "mid_1024x1024.jpeg",
        "about": "Stuff is getting sense now. You understand main concepts of programming. Ideas are poping into your head. You are confident with your skills. "
    },
    "advanced": {
        "img": "advanced_1024x1024.jpeg",
        "about": "You can see what's under the hood. You see the bytes flowing in your CPU. Nothing fears you. You have 200 WPM. You eat bugs for breakfast."
    }
}
var linesToAnimate = [
    "...watching lecture...",
    "...watching sections...",
    "...watching shorts...",
    "...solving problem sets..."
]

function main() {
    // Game Loop buttons
    const startBtns = document.querySelectorAll('.cs-week-title button');
    startBtns.forEach( btn => {
        btn.addEventListener("click", gameLoop);
    })
    // Reset button
    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', resetProgress);
    // Saving progress
    window.addEventListener("beforeunload" , () => {
        localStorage.setItem("weekProgress", JSON.stringify(weekProgress));
        localStorage.setItem("weekFinished", JSON.stringify(weekFinished));
        localStorage.setItem("finishedWeeks",JSON.stringify(finishedWeeks));
    })
    // updates
    updateCheckMark();
    updateProfile();
}

function gameLoop() {
    if (activeWeek) removeClass(activeWeek, 'active');
    addClass(this, 'active');
    activeWeek = this;
    typGameStatus = false;
    let week = this.dataset.week;
    // Updates
    updateProfile();
    intervalReset();
    updatebar(week);
    // Static progress loop
    gameIntervals.push( setInterval( () => {
        progress(0.5);
        checkFinished();
        },1000));
    // Typing game loop
    gameIntervals.push( setInterval( () => {
        if (!typGameStatus) {
            typingGame(week);
        }
    },1000));
    // Text animation loop
    gameIntervals.push( setInterval( () => {
        textAnimate.textContent = linesToAnimate[Math.ceil(Math.random() * 4)-1];
    },5000));
}   

class giveLine {
    // Give a random line based on week
    static Lines = [['say hello,world', 'wait 10 seconds', 'define meow n times', 'if touching mouse-pointer then', 'go to x'],
        ['int main(void)', 'printf("hello,world");', 'string answer = get_string("whats your name");', 'if (x<y)', 'include <stdio.h>'],
        ['words[0] = "HI!";', 'int main(int argc, string argv[])', 'int scores[N]', 'scores[0] = get_int("Score: ");', 'float average(int length, int array[]);'],
        ['for (int i = 0; i < 7; i++)', 'typedef struct', 'people[0].name = "carter"', 'void draw(int n)', 'strcmp(names[i], name) == 0'],
        ['int *p = &n;','printf("%i",*p);','char *s = "HI!"','char *t = malloc(strlen(s) + 1);','int *x = malloc(3 * sizeof(int));'],
        ['struct node *next;','next->number = number;','free(ptr);','node *n = malloc(sizeof(node));','n->left = NULL;'],
        ['from cs50 import get_string','print(f"hello, {answer}")','x = int(input("x: "))','for i in range(n)','except ValueError:'],
        ['SELECT * FROM shows','SELECT name FROM shows WHERE id = 1','JOIN genres ON shows.id = genres.show_id', 'INSERT INTO favorites','CREATE TABLE imdb'],
        ['<html lang="en">','text-align: center;', '<link href="style.css">', 'alert("hello")', 'document.querySelector("body")'],
        ['app = Flask(__name__)','return render_template("index.html")','hello, {{name}}', 'if request.method == "POST"', 'request.form.get("name)'],
        ['Two-factor Authentication', 'Hashing algorithms', 'Passkeys', 'Cryptography','Encryption']];

    constructor(week) {
        const randomIndex = Math.ceil(Math.random() * 5);
        this.line = giveLine.Lines[week][randomIndex - 1];
    }
}

function typingGame(week) {
    const word = new giveLine(week);
    const formatedWord = formatWord(word.line);
    wordLength = word.line.length;
    cursorIndex = 0;
    typGameStatus = true;

    const wordsElement = document.querySelector('.words');
    wordsElement.innerHTML = formatedWord;

    addClass(document.querySelector('.words .letter'), 'current');
    gameElem.parentElement.className = "d-flex justify-content-center";
    gameElem.className = "game";

    if (typingEventBinded) gameElem.removeEventListener('keyup', typingEventBinded);
    typingEventBinded = typingEvent.bind(word);
    gameElem.addEventListener('keyup', typingEventBinded);
    return 0;}
    function typingEvent (event) {
        const typedKey = event.key;
        const currentElem = document.querySelector('.letter.current');
        let currentLetter = currentElem.innerHTML;
        if (currentLetter.length > 1) {
            if(currentLetter === "&amp;") currentLetter = "&";
            if(currentLetter === "&lt;") currentLetter = "<";
            if(currentLetter === "&gt;") currentLetter = ">";
        }
        const isBackspace = typedKey === 'Backspace';
        const isLetter = typedKey.length === 1;
    
        if (isBackspace) {
            if (cursorIndex === 0) {
            }
            else {
                removeClass(currentElem, 'current');
                addClass(currentElem.previousSibling, 'current');
                if (currentElem.previousSibling.className.includes("incorrect")) {
                    removeClass(currentElem.previousSibling, 'incorrect')
                }
                else {
                    removeClass(currentElem.previousSibling, 'correct')
                }
                cursorIndex -= 1;
            }
        }
        else if (isLetter) {
            if(typedKey === currentLetter) {
                if (cursorIndex === (wordLength - 1)) {
                    addClass(currentElem, 'correct');
                    if (checkSuccess()) {
                        progress(5);
                        typeGameAnime(true);
                    }
                    else {
                        typeGameAnime(false);
                        
                    }
                    finished = true
                }   
                else {
                    addClass(currentElem, 'correct');
                    removeClass(currentElem, 'current'); 
                    addClass(currentElem.nextSibling, 'current');
                    cursorIndex += 1;
                }
            }
            else {
                if (cursorIndex === (wordLength - 1)) {
                    addClass(currentElem, 'incorrect');
                    typeGameAnime(false);
                }   
                else {
                    addClass(currentElem, 'incorrect');
                    removeClass(currentElem, 'current'); 
                    addClass(currentElem.nextSibling, 'current');
                    cursorIndex += 1;
                }}}}

function addClass(elem, x) {
    elem.className += ' '+x;
}

function removeClass(elem, x) {
    elem.className = elem.className.replace(x,'');
}

function progress(point) {
    weekProgress[activeWeek.dataset.week] += point;
    if (weekProgress[activeWeek.dataset.week] >= 100.0) {
        weekFinished[activeWeek.dataset.week] = true;
        finishedWeeks += 1;
    }
    updatebar(activeWeek.dataset.week);
}

function formatWord(word) {
    return `<span class="letter">${word.split('').join('</span><span class="letter">')}</span>`;
}


function checkSuccess() {
    const game = document.querySelector('.words')
    childElem = game.children;

    for (let i = 0; i < childElem.length; i++) {
        if(childElem[i].className.includes('incorrect')){
            return false;   
        }  
    }
    return true;
}

function checkFinished() {
    if (weekFinished[activeWeek.dataset.week]) {
        gameElem.parentElement.className = "d-none";
        gameElem.className = "d-none";
        activeWeek.className = 'finished';
        activeWeek.disabled = true;
        for ( var i = 0; i < gameIntervals.length; i++) {
            clearInterval(gameIntervals[i]);
        }
        let checkMark = '<img class="check-mark" src="./static/images/check.svg"/>';
        let weekElem = document.querySelector(`#week${activeWeek.dataset.week} p`);
        weekElem.innerHTML += ' ' + checkMark;
        textAnimate.innerHTML = "<br>";
        typGameStatus = false;
        updateProfile();
    }
}

function updateCheckMark() {
    let checkMark = '<img class="check-mark" src="./static/images/check.svg"/>';
    for ( let i = 0; i < weekFinished.length ; i++) {
        let weekBool = weekFinished[i]
        if (weekBool) {
            let weekP = document.querySelector(`#week${i.toString()} p`);
            let weekButton = document.querySelector(`#week${i.toString()} button`)
            weekP.innerHTML += ' ' + checkMark;
            weekButton.disabled = true;
            weekButton.className = "finished";
        }
    }
}

function updateProfile () {
    if (finishedWeeks < 3){
        var title = "<h5>Beginner Programmer</h5>";
        var about = `<p>${profile.beginner.about}</p>`;
        var img = `<img src="./static/images/${profile.beginner.img}" class="rounded border-dark" alt="profile-pic" width="1024">`;
    }
    else if (finishedWeeks < 9) {
        var title = "<h5>Mid Programmer</h5>";
        var about = `<p>${profile.mid.about}</p>`;
        var img = `<img src="./static/images/${profile.mid.img}" class="rounded border-dark" alt="profile-pic" width="1024">`;
    }
    else {
        if (finishedWeeks === 11) {
            const finalModal = bootstrap.Modal.getOrCreateInstance('#endingModal');
            finalModal.show();
        }
        var title = "<h5>Advanced Programmer</h5>";
        var about = `<p>${profile.advanced.about}</p>`;
        var img = `<img src="./static/images/${profile.advanced.img}" class="rounded border-dark" alt="profile-pic" width="1024">`;
    }
    var profileDiv = document.querySelector('.profile');
    profileDiv.innerHTML = img + title + about ;    
}

function updatebar(week) {
    let progress = weekProgress[week].toString() + '%';
    progressBar.style.width = progress;
    progressBar.innerHTML = progress;
}

function intervalReset() {
    for ( var i = 0; i < gameIntervals.length; i++) {
        clearInterval(gameIntervals[i]);
    }
}

function typeGameAnime(success) {
    if (success) {
        gameElem.className = 'game pulse-correct';
    }
    else {
        gameElem.className = 'game pulse-incorrect';
    }
    setTimeout(() => {typGameStatus=false;},2000);
}

function resetProgress() {
    weekProgress = Array(11).fill(0.0);
    weekFinished = Array(11).fill(false);
    finishedWeeks = 0;

    const weekP = document.querySelectorAll('.cs-week-title p');
    for (let i = 0; i < weekP.length ; i++){
        if(weekP[i].children[0]){
            weekP[i].children[0].remove();  
        }
    }

    const btns = document.querySelectorAll('.cs-week-title button').forEach( (btn) => {
        btn.disabled = false;
        btn.className = "unfinished";
    });

    gameElem.className = "d-none";
    textAnimate.innerHTML = "<br>";
    progressBar.style.width = "0%";
    progressBar.innerHTML = "0%";
    updateProfile();
    intervalReset();
}

main()