export function startTimer(timerElement, secondsElapsed) {
    let timerInterval = setInterval(() => {
        secondsElapsed++;
        timerElement.textContent = `Time: ${secondsElapsed} sec`;
    }, 1000);
}
