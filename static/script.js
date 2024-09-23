var weekProgress = Array(11).fill(0.0);
var weekFinished = Array(11).fill(false);
var finishedWeeks = 0;
var gameIntervals = [];
var activeWeek;
var typGameStatus = false;
var cursorIndex = 0;
var typingEventBinded;
var gameElem = document.querySelector('.game');

function main() {
    const startBtns = document.querySelectorAll('.cs-week-title button');
    startBtns.forEach( btn => {
        btn.addEventListener("click", gameLoop);
    })

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
        progress(20);
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
    }
    console.log(weekProgress[activeWeek.dataset.week]);
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
        gameElem.className = "d-none    ";
        activeWeek.className = 'finished';
        for ( var i = 0; i < gameIntervals.length; i++) {
            clearInterval(gameIntervals[i]);
        }
    }
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
    const game = document.querySelector('.game');
    // console.log(wordCount);

    if (typingEventBinded) game.removeEventListener('keyup', typingEventBinded);
    typingEventBinded = typingEvent.bind(word);
    game.addEventListener('keyup', typingEventBinded);
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
                    typGameStatus = false;
                }
                else {
                    console.log("fail");
                    typGameStatus = false;
                    
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
                typGameStatus = false;
            }   
            else {
                addClass(currentLetter, 'incorrect');
                removeClass(currentLetter, 'current'); 
                addClass(currentLetter.nextSibling, 'current');
                cursorIndex += 1;
                console.log(cursorIndex);
            }
        }}}


main()