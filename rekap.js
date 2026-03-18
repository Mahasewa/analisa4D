function prosesRekap() {
    const input = document.getElementById('inputAngka').value;
    // Bersihkan input, ambil hanya angka 4 digit
    const rawNumbers = input.split(/[* \n,]+/).filter(n => n.length === 4);
    
    if (rawNumbers.length === 0) {
        alert("Masukkan angka yang benar dulu, Koh!");
        return;
    }

    const groups = {};

    // Kelompokkan berdasarkan angka dasar (diurutkan)
    rawNumbers.forEach(num => {
        const sortedBase = num.split('').sort().join(''); // Contoh: "0138"
        if (!groups[sortedBase]) {
            groups[sortedBase] = new Set();
        }
        groups[sortedBase].add(num);
    });

    // Ambil elemen tabel
    const tableFullBody = document.querySelector('#tableFull tbody');
    const tablePartialBody = document.querySelector('#tablePartial tbody');
    const totalInfo = document.getElementById('totalInfo');
    
    // Reset tabel
    tableFullBody.innerHTML = '';
    tablePartialBody.innerHTML = '';
    
    let countFull = 0;
    let countPartial = 0;

    // Logika sorting kelompok
    for (const [base, variations] of Object.entries(groups)) {
        const count = variations.size;
        const row = document.createElement('tr');

        if (count === 24) {
            countFull++;
            row.innerHTML = `<td><b>{${base}}</b></td><td>${count}</td><td class="status-full">LENGKAP</td>`;
            tableFullBody.appendChild(row);
        } else {
            countPartial++;
            const kurang = 24 - count;
            row.innerHTML = `<td><b>{${base}}</b></td><td>${count}</td><td class="status-partial">Kurang ${kurang}</td>`;
            tablePartialBody.appendChild(row);
        }
    }

    // Tampilkan hasil
    totalInfo.innerText = `Total Angka Terdeteksi: ${rawNumbers.length} | Kelompok Lengkap: ${countFull} | Kelompok Sisa: ${countPartial}`;
    document.getElementById('output').style.display = 'block';
}
