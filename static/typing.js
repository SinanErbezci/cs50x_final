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


function formatWord(word) {
    return `<span class="letter">${word.split('').join('</span><span class="letter">')}</span>`;
}

function checkSuccess(elem) {
    childElem = elem.children;

    for (let i = 0; i < childElem.length; i++) {
        if(childElem[i].className.includes('incorrect')){
            return false;   
        }  
    }
    return true;
}

function typingGame(week) {
    const word = new giveLine(week);
    const formatedWord = formatWord(word.line);
    let wordCount = word.line.length;
    let cursorIndex = 0;
    var finished = false
    var success;

    const wordsElement = document.querySelector('.words');
    wordsElement.innerHTML = formatedWord;

    // addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.words .letter'), 'current');

    const game = document.querySelector('.game');
    console.log(wordCount);

    game.addEventListener('keyup', ev => {
        const typedKey = ev.key;
        const currentLetter = document.querySelector('.letter.current');
        const isBackspace = typedKey === 'Backspace';

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
        else if  (typedKey === currentLetter.innerHTML) {

            if (cursorIndex === (wordCount - 1)) {
                console.log("finished");
                addClass(currentLetter, 'correct');
                if (checkSuccess(wordsElement)) {
                    success = true;
                }
                else {
                    success = false;
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
            if (cursorIndex === (wordCount - 1)) {
                console.log("finished");
                checkSuccess(wordsElement);
                addClass(currentLetter, 'incorrect');
                 if (checkSuccess(wordsElement)) {
                    success = true;
                 }
                 else {
                    success = false;
                }
                finished = true;
            }   
            else {
                addClass(currentLetter, 'incorrect');
                removeClass(currentLetter, 'current'); 
                addClass(currentLetter.nextSibling, 'current');
                cursorIndex += 1;
                console.log(cursorIndex)
            }
        }})

        let checkFinish = setInterval( () => {
            if (finished) {
                clearInterval(checkFinish);
                return success;
            }
        }, 100)

}

export { giveLine, addClass, removeClass, formatWord, checkSuccess, typingGame};