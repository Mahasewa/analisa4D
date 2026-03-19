function prosesRekap(pakeEliminasi) {
    const inputUtama = document.getElementById('inputAngka').value;
    const filterVal = document.getElementById('inputEliminasi').value;
    const isChecked = document.getElementById('checkElim').checked;
    
    let rawNumbers = inputUtama.split(/[* \n,]+/).filter(n => n.length === 4);
    
    if (rawNumbers.length === 0) {
        alert("Kotak utama kosong, Koh!");
        return;
    }

    // LOGIKA ELIMINASI 3 DIGIT
    if (pakeEliminasi && isChecked && filterVal.length === 4) {
        const digitFilter = filterVal.split('');

        rawNumbers = rawNumbers.filter(num => {
            const digitNum = num.split('');
            let tempFilter = [...digitFilter];
            let matchCount = 0;
            
            digitNum.forEach(d => {
                const idx = tempFilter.indexOf(d);
                if (idx !== -1) {
                    matchCount++;
                    tempFilter.splice(idx, 1);
                }
            });

            return matchCount < 3; // Buang jika match >= 3
        });
    }

    const groups = {};
    rawNumbers.forEach(num => {
        const sortedBase = num.split('').sort().join(''); 
        if (!groups[sortedBase]) { groups[sortedBase] = new Set(); }
        groups[sortedBase].add(num);
    });

    tampilkanHasil(groups, rawNumbers.length);
}

function tampilkanHasil(groups, total) {
    const tableFullBody = document.querySelector('#tableFull tbody');
    const tablePartialBody = document.querySelector('#tablePartial tbody');
    const totalInfo = document.getElementById('totalInfo');
    
    tableFullBody.innerHTML = '';
    tablePartialBody.innerHTML = '';
    
    let countFull = 0, countPartial = 0;
    const sortedKeys = Object.keys(groups).sort();

    sortedKeys.forEach(base => {
        const count = groups[base].size;
        const row = document.createElement('tr');
        if (count === 24) {
            countFull++;
            row.innerHTML = `<td><b>${base}</b></td><td>${count}</td><td class="status-full">LENGKAP</td>`;
            tableFullBody.appendChild(row);
        } else {
            countPartial++;
            row.innerHTML = `<td><b>${base}</b></td><td>${count}</td><td class="status-partial">Kurang ${24-count}</td>`;
            tablePartialBody.appendChild(row);
        }
    });

    totalInfo.innerText = `Total: ${total} Angka | Set Lengkap: ${countFull} | Set Sisa: ${countPartial}`;
    document.getElementById('output').style.display = 'block';
}
