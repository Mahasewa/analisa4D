function prosesRekap(pakeEliminasi) {
    const inputUtama = document.getElementById('inputAngka').value;
    const inputElim = document.getElementById('inputEliminasi').value;
    const isChecked = document.getElementById('checkElim').checked;
    
    let rawNumbers = inputUtama.split(/[* \n,]+/).filter(n => n.length === 4);
    const filterList = inputElim.split(/[* \n,]+/).filter(n => n.length === 4);
    
    if (rawNumbers.length === 0) {
        alert("Kotak utama kosong, Koh!");
        return;
    }

    // LOGIKA ELIMINASI 3 DIGIT
    if (pakeEliminasi && isChecked && filterList.length > 0) {
        rawNumbers = rawNumbers.filter(num => {
            const digitNum = num.split(''); // Misal: ['1','3','4','5']
            
            // Cek ke setiap angka di kotak filter
            const kenaElim = filterList.some(fNum => {
                const digitFilter = fNum.split(''); // Misal: ['1','2','3','4']
                
                // Hitung berapa digit yang sama (tanpa melihat urutan)
                // Kita buat copy digitFilter supaya digit yang sudah dihitung tidak dihitung dua kali
                let tempFilter = [...digitFilter];
                let matchCount = 0;
                
                digitNum.forEach(d => {
                    const idx = tempFilter.indexOf(d);
                    if (idx !== -1) {
                        matchCount++;
                        tempFilter.splice(idx, 1);
                    }
                });

                return matchCount >= 3; // Jika 3 digit atau lebih sama, tandai untuk buang
            });

            return !kenaElim; // Simpan jika TIDAK kena eliminasi
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

    totalInfo.innerText = `Total Akhir: ${total} Angka | Set Lengkap: ${countFull} | Set Sisa: ${countPartial}`;
    document.getElementById('output').style.display = 'block';
}
