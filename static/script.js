document.addEventListener("DOMContentLoaded", main);

function main() {
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