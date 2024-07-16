document.addEventListener("DOMContentLoaded", function() {
    const wavyTextElements = document.querySelectorAll('.wavy-text');

    function applyWavyEffect() {
        wavyTextElements.forEach(element => {
            let text = element.innerText;
            element.innerHTML = '';
            text.split('').forEach((char, index) => {
                let span = document.createElement('span');
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.innerText = char;
                }
                span.style.animationDelay = `${index * 0.1}s`;
                element.appendChild(span);
            });
        });
    }
    applyWavyEffect();
    setInterval(() => {
        wavyTextElements.forEach(element => {
            element.innerHTML = element.textContent;
        });
        applyWavyEffect();
    }, 5000);
});
