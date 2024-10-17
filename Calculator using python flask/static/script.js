document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.buttons button');
    const showHistoryBtn = document.getElementById('showHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const modal = document.getElementById('historyModal');
    const closeBtn = document.querySelector('.close');
    const historyList = document.getElementById('historyList');

    let output = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (value === '=') {
                calculate();
            } else if (value === 'AC') {
                output = '';
                display.value = output;
            } else if (value === 'DEL') {
                output = output.slice(0, -1);
                display.value = output;
            } else {
                output += value;
                display.value = output;
            }
        });
    });

    function calculate() {
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression: output }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                output = data.result;
                display.value = output;
            } else {
                display.value = 'Error';
                output = '';
            }
        });
    }

    showHistoryBtn.addEventListener('click', () => {
        fetch('/get_history')
            .then(response => response.json())
            .then(history => {
                historyList.innerHTML = '';
                history.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    historyList.appendChild(li);
                });
                modal.style.display = 'block';
            });
    });

    clearHistoryBtn.addEventListener('click', () => {
        fetch('/clear_history', { method: 'POST' })
            .then(() => {
                historyList.innerHTML = '';
            });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});