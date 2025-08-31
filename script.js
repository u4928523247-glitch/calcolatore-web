let activeInput = document.getElementById('A');
let D_manuale = false;
let orario_manuale = false;

// Imposta i campi cliccabili
document.getElementById('A').addEventListener('click', () => {
    setActive('A');
});
document.getElementById('orario').addEventListener('click', () => {
    setActive('orario');
    orario_manuale = true;  // Segna che è stato modificato
});
document.getElementById('C').addEventListener('click', () => {
    setActive('C');
});
document.getElementById('D').addEventListener('click', () => {
    setActive('D');
    D_manuale = true;
});
// Attiva il campo "Giorni" con la tastiera virtuale
document.getElementById('giorni').addEventListener('click', function () {
    activeInput = this;  // Imposta come campo attivo
    if (this.value === '0') return;
    this.value = '0';    // Azzera al click
});

function setActive(inputId) {
    activeInput = document.getElementById(inputId);
    activeInput.value = '0';
}

function input(digit) {
    let val = activeInput.value;
    if (val === '0' && digit !== '.') {
        activeInput.value = digit;
    } else {
        activeInput.value += digit;
    }
}

function clearInput() {
    activeInput.value = '0';
}

function backspace() {
    let val = activeInput.value;
    if (val.length > 1) {
        activeInput.value = val.slice(0, -1);
    } else {
        activeInput.value = '0';
    }
}

function arrotondaSpeciale(x) {
    const euro = Math.floor(x);
    return (x - euro) * 100 >= 50 ? euro + 1 : euro;
}

function aggiorna() {
    const B = parseFloat(document.getElementById('B').value) / 100;
    const ore = parseFloat(document.getElementById('ore').value);
    const giorni = parseFloat(document.getElementById('giorni').value) || 30;
    const D_val = parseFloat(document.getElementById('D').value) || 0;
    const A_val = parseFloat(document.getElementById('A').value) || 0;
    const orario_val = parseFloat(document.getElementById('orario').value) || 0;

    // 1. Se D è stato inserito manualmente → usa D come base
    if (D_manuale && D_val > 0) {
        const C = D_val / giorni;
        const C_out = arrotondaSpeciale(C);
        const A_calc = C_out / (1 - B);
        const A_out = arrotondaSpeciale(A_calc);
        const orario_calc = A_out / ore || 0;

        document.getElementById('C').value = C_out.toFixed(2);
        document.getElementById('A').value = A_out.toFixed(2);

        // Aggiorna Guadagno Orario solo se non è stato modificato manualmente
        if (!orario_manuale) {
            document.getElementById('orario').value = orario_calc.toFixed(2);
        }
    }
    // 2. Altrimenti: calcola da A o da orario × ore
    else {
        let entrata = A_val;

        // Se A non è manuale, calcola da orario × ore
        if (A_val === 0 && orario_val > 0 && !orario_manuale) {
            entrata = orario_val * ore;
            document.getElementById('A').value = entrata.toFixed(2);
        }

        const C = entrata * (1 - B);
        const C_out = arrotondaSpeciale(C);
        const D_out = arrotondaSpeciale(C_out * giorni);

        document.getElementById('C').value = C_out.toFixed(2);
        document.getElementById('D').value = D_out.toFixed(2);

        // Aggiorna Guadagno Orario da A e ore, se non è stato modificato manualmente
        if (!orario_manuale && ore > 0) {
            const orario_auto = entrata / ore;
            document.getElementById('orario').value = orario_auto.toFixed(2);
        }
    }
}

function reset() {
    document.getElementById('A').value = '0.00';
    document.getElementById('orario').value = '0.00';
    document.getElementById('C').value = '0.00';
    document.getElementById('D').value = '0.00';
    document.getElementById('giorni').value = '30';
    document.getElementById('ore').value = '8';
    document.getElementById('B').value = '50%';
    D_manuale = false;
    orario_manuale = false;
}