// Loading data from localstroge
var weekProgress =  JSON.parse(localStorage.getItem("weekProgress"));
var weekFinished = JSON.parse(localStorage.getItem("weekFinished"));
var finishedWeeks = JSON.parse(localStorage.getItem("finishedWeeks"));

// First Time
if (!weekProgress) {
    weekProgress = Array(11).fill(0.0);
    weekFinished = Array(11).fill(false);
    finishedWeeks = 0;
    const myModal = bootstrap.Modal.getOrCreateInstance('#endingModal');
    myModal.show();
}

var gameIntervals = [];
var activeWeek;
var typGameStatus = false;
var cursorIndex = 0;
var typingEventBinded;
var gameElem = document.querySelector('.game');
var progressBar = document.querySelector('.progress-bar');
var profile = {
    "beginner": {
        "img": "beginner_1024x1024.jpeg",
        "about": "This is you. You are just a noob programmer. Everything confuses you."
    },
    "mid": {
        "img": "mid_1024x1024.jpeg",
        "about": "Stuff is getting sense now. You understand main concepts of programming."
    },
    "advanced": {
        "img": "advanced_1024x1024.jpeg",
        "about": "You can see what's under the hood"
    }
}
function main() {

    const startBtns = document.querySelectorAll('.cs-week-title button');
    startBtns.forEach( btn => {
        btn.addEventListener("click", gameLoop);
    })

    updateCheckMark();
    updateProfile();
    // window.addEventListener("beforeunload" , () => {
    //     localStorage.setItem("weekProgress", JSON.stringify(weekProgress));
    //     localStorage.setItem("weekFinished", JSON.stringify(weekFinished));
    //     localStorage.setItem("finishedWeeks",JSON.stringify(finishedWeeks));
    // })
    // var textWrapper = document.querySelector('.animated');
    // textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    // anime.timeline({loop: false})
    // .add({
    //     targets: '.animated .letter',
    //     opacity: [0,1],
    //     easing: "easeInOutQuad",
    //     duration: 2250,
    //     delay: (el, i) => 150 * (i+1)
    // });
}

function gameLoop() {
    if (activeWeek) removeClass(activeWeek, 'active');
    addClass(this, 'active');
    // showGame();
    updateProfile();
    activeWeek = this;
    for ( var i = 0; i < gameIntervals.length; i++) {
        clearInterval(gameIntervals[i]);
    }
    let week = this.dataset.week;
    updatebar(week);
    gameIntervals.push( setInterval( () => {
        progress(0.5);
        console.log(`${week}`,weekProgress[week]);
        checkFinished();
        }
    , 1000));
    gameIntervals.push( setInterval( () => {
        if (!typGameStatus) {
            typingGame(week);
        }
    }), 1000)
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
        ['<html lang="en"','text-align: center;', '<link href="style.css">', 'alert("hello")', 'document.querySelector("body")'],
        ['app = Flask(__name__)','return render_template("index.html")','hello, {{name}}', 'if request.method == "POST"', 'request.form.get("name)'],
        ['Two-factor Authentication', 'Hashing algorithms', 'Passkeys', 'Cryptography','Encryption']];

    constructor(week) {
        const randomIndex = Math.ceil(Math.random() * 5);
        this.line = giveLine.Lines[week][randomIndex - 1];
    }
}

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
        gameElem.className = "d-none";
        activeWeek.className = 'finished';
        activeWeek.disabled = true;
        for ( var i = 0; i < gameIntervals.length; i++) {
            clearInterval(gameIntervals[i]);
        }
        let checkMark = '<img class="check-mark" src="./static/images/check.svg"/>';
        let weekElem = document.querySelector(`#week${activeWeek.dataset.week} p`);
        weekElem.innerHTML += ' ' + checkMark;
    }
}

function updateCheckMark() {
    let checkMark = '<img class="check-mark" src="./static/images/check.svg"/>';
    for ( let i = 0; i < weekFinished.length ; i++) {
        let weekBool = weekFinished[i]
        console.log(i, weekBool);
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
    else if (finishedWeeks < 5) {
        var title = "<h5>Mid Programmer</h5>";
        var about = `<p>${profile.mid.about}</p>`;
        var img = `<img src="./static/images/${profile.mid.img}" class="rounded border-dark" alt="profile-pic" width="1024">`;
    }
    else {
        var title = "<h5>Advanced Programmer</h5>";
        var about = `<p>${profile.advanced.about}</p>`;
        var img = `<img src="./static/images/${profile.advanced.img}" class="rounded border-dark" alt="profile-pic" width="1024">`;
    }
    var profileDiv = document.querySelector('.profile');
    profileDiv.innerHTML = img + title + about ;
    // <img src="./static/images/mid_1024x1024.jpeg" class="rounded border-dark" alt="profile-pic" width="1024">

}
 
function typingGame(week) {
    const word = new giveLine(week);
    const formatedWord = formatWord(word.line);
    wordLength = word.line.length;
    console.log("word length", wordLength);
    cursorIndex = 0;
    typGameStatus = true;

    const wordsElement = document.querySelector('.words');
    wordsElement.innerHTML = formatedWord;

    // addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.words .letter'), 'current');
    gameElem.parentElement.className = "d-flex justify-content-center";
    gameElem.className = "game";
    // console.log(wordCount);

    if (typingEventBinded) gameElem.removeEventListener('keyup', typingEventBinded);
    typingEventBinded = typingEvent.bind(word);
    gameElem.addEventListener('keyup', typingEventBinded);
    return 0;

}

function typingEvent (event) {
    const typedKey = event.key;
    console.log(typedKey);
    const currentLetter = document.querySelector('.letter.current');
    const isBackspace = typedKey === 'Backspace';
    const isLetter = typedKey.length === 1;

    if (isBackspace) {
        if (cursorIndex === 0) {
            console.log("cant go back")
        }
        else {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            if (currentLetter.previousSibling.className.includes("incorrect")) {
                removeClass(currentLetter.previousSibling, 'incorrect')
            }
            else {
                removeClass(currentLetter.previousSibling, 'correct')
            }
            cursorIndex -= 1;
        }
    }
    else if (isLetter) {
        if(typedKey === currentLetter.innerHTML) {
            if (cursorIndex === (wordLength - 1)) {
                console.log("finished");
                addClass(currentLetter, 'correct');
                if (checkSuccess()) {
                    console.log("success");
                    progress(5);
                    // typGameStatus = false;
                    typeGameAnime(true);
                }
                else {
                    console.log("fail");
                    // typGameStatus = false;
                    typeGameAnime(false);
                    
                }
                finished = true
            }   
            else {
                addClass(currentLetter, 'correct');
                removeClass(currentLetter, 'current'); 
                addClass(currentLetter.nextSibling, 'current');
                cursorIndex += 1;
                console.log(cursorIndex)
            }
        }
        else {
            if (cursorIndex === (wordLength - 1)) {
                console.log("finished");
                addClass(currentLetter, 'incorrect');
                console.log("fail");
                typeGameAnime(false);
                // typGameStatus = false;
            }   
            else {
                addClass(currentLetter, 'incorrect');
                removeClass(currentLetter, 'current'); 
                addClass(currentLetter.nextSibling, 'current');
                cursorIndex += 1;
                console.log(cursorIndex);
            }
        }}}

function updatebar(week) {
    let progress = weekProgress[week].toString() + '%';
    progressBar.style.width = progress;
    progressBar.innerHTML = progress;
}

function showGame() {
    gameElem.style.display = "inline-flex";
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
main()