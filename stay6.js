// === Calculator Logic ===
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

let expression = '';

function updateDisplay(value) {
    display.textContent = value || '0';
}

function evaluateExpression(expr) {
    try {
        // Replace ^ with Math.pow equivalent
        expr = expr.replace(/(\d+|\))\^(\d+|\()/g, 'Math.pow($1,$2)');

        // Allow usage of sqrt, log, sin, etc.
        expr = expr.replace(/(\b)(sin|cos|tan|log|ln|sqrt)\(/g, (match, p1, func) => {
            if (func === 'ln') return 'Math.log(';
            if (func === 'log') return 'Math.log10(';
            return `Math.${func}(`;
        });

        // Replace constants
        expr = expr.replace(/Math\.PI/g, 'Math.PI');
        expr = expr.replace(/Math\.E/g, 'Math.E');

        // Evaluate safely
        const result = Function(`"use strict"; return (${expr})`)();
        return result;
    } catch (err) {
        return 'Erreur';
    }
}

// Handle button press
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');

        if (value === 'AC') {
            expression = '';
            updateDisplay('');
        } else if (value === 'DEL') {
            expression = expression.slice(0, -1);
            updateDisplay(expression);
        } else if (value === '=') {
            const result = evaluateExpression(expression);
            expression = result.toString();
            updateDisplay(expression);
        } else {
            expression += value;
            updateDisplay(expression);
        }
    });
});

// === Optional: Keyboard Support ===
document.addEventListener('keydown', (e) => {
    if (/\d/.test(e.key) || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(e.key)) {
        expression += e.key;
        updateDisplay(expression);
    } else if (e.key === 'Enter') {
        const result = evaluateExpression(expression);
        expression = result.toString();
        updateDisplay(expression);
    } else if (e.key === 'Backspace') {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
    } else if (e.key === 'Escape') {
        expression = '';
        updateDisplay(expression);
    }
});

// === LLM Modal Logic ===
const explainBtn = document.getElementById('explainConceptButton');
const inputConcept = document.getElementById('conceptInput');
const modal = document.getElementById('explanationModal');
const closeModalBtn = document.getElementById('closeModalButton');
const explanationText = document.getElementById('explanationText');
const spinner = document.getElementById('spinner');

function showModal() {
    modal.classList.add('show');
}

function hideModal() {
    modal.classList.remove('show');
    inputConcept.value = '';
    explanationText.innerHTML = '';
}

function simulateExplanationFetch(concept) {
    spinner.classList.add('show');
    explanationText.innerHTML = '';
    
    setTimeout(() => {
        spinner.classList.remove('show');
        explanationText.innerHTML = `<p><strong>${concept}</strong> est un concept mathématique très important. (Remplace ce texte par une vraie explication via une API ou base de données)</p>`;
    }, 1500);
}

explainBtn.addEventListener('click', () => {
    const concept = inputConcept.value.trim();
    if (concept.length === 0) return;

    showModal();
    simulateExplanationFetch(concept);
});

closeModalBtn.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
});
