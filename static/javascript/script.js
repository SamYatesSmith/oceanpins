document.addEventListener("DOMContentLoaded", function() {
    const wavyTextElements = document.querySelectorAll('.wavy-text');
    
    wavyTextElements.forEach(element => {
        let text = element.innerText;
        element.innerHTML = '';
        text.split('').forEach((char, index) => {
            let span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;'; // Preserve spaces
            } else {
                span.innerText = char;
            }
            span.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(span);
        });
    });
});