// ui.js - Kode yang sudah disatukan dan lengkap

// 1. Fungsi Utama untuk Generate
function jalankanProses() {
    const inputBBFS = document.getElementById('inputBBFS').value;
    if (inputBBFS.length < 4) { alert("Minimal 4 digit, Koh!"); return; }

    // Generate kombinasi (dari core.js)
    let hasil = generateBBFS(inputBBFS, 4); 

    // Ambil Filter Posisi dari UI
    const rows = document.querySelectorAll('.filter-row');
    let rules = [];
    rows.forEach(row => {
        const as = row.querySelector('.f-as').value;
        const kop = row.querySelector('.f-kop').value;
        const kepala = row.querySelector('.f-kep').value;
        const ekor = row.querySelector('.f-ekor').value;
        
        // Hanya tambahkan jika ada isi
        if (as || kop || kepala || ekor) {
            rules.push({ as, kop, kepala, ekor });
        }
    });

    // Jalankan Filter (dari filter.js)
    hasil = filterByPosisi(hasil, rules);

    // Tampilkan hasil
    renderHasil(hasil);
}

// 2. Fungsi untuk Menampilkan Hasil 
function renderHasil(data) {
    const output = document.getElementById('outputHasil');
    let groups = { ACAK: [], TWIN: [], TRIPLE: [], QUAD: [], AABB: [], ABBA: [], ABAB: [] };

    data.forEach(n => {
        let p = getPattern(n);
        if (groups[p]) groups[p].push(n);
        else groups['ACAK'].push(n);
    });

    output.innerHTML = `
        <div class="result-block">
            <h3>HASIL 4D ACAK (${groups.ACAK.length} line)</h3>
            <textarea style="width: 100%; height: 100px;">${groups.ACAK.join('\n')}</textarea>
            
            <h3>HASIL 4D TWIN (${groups.TWIN.length} line)</h3>
            <div class="checkbox-pola">
                <label><input type="checkbox" class="pola-select" value="AABB"> AABB (${groups.AABB.length})</label>
                <label><input type="checkbox" class="pola-select" value="ABBA"> ABBA (${groups.ABBA.length})</label>
                <label><input type="checkbox" class="pola-select" value="ABAB"> ABAB (${groups.ABAB.length})</label>
            </div>
            <button onclick="gabungkanPola()">Gabungkan Pola</button>
            <textarea id="outputGabung" style="width: 100%; height: 100px;"></textarea>
        </div>
    `;
}

// 3. Fungsi Tambah Baris Filter
function tambahBarisFilter() {
    const container = document.getElementById('filterContainer');
    const div = document.createElement('div');
    div.className = 'filter-row';
    div.innerHTML = `
        <input type="text" class="f-as" maxlength="1" placeholder="As">
        <input type="text" class="f-kop" maxlength="1" placeholder="Kop">
        <input type="text" class="f-kep" maxlength="1" placeholder="Kep">
        <input type="text" class="f-ekor" maxlength="1" placeholder="Ekor">
    `;
    container.appendChild(div);
}
function getPattern(num) {
    const d = num.toString().split('');
    if (d[0] === d[1] && d[1] === d[2] && d[2] === d[3]) return 'QUAD';
    if (d[0] === d[1] && d[1] === d[2]) return 'TRIPLE'; // Sederhana
    if (d[1] === d[2] && d[2] === d[3]) return 'TRIPLE';
    if (d[0] === d[1] && d[2] === d[3]) return 'AABB';
    if (d[0] === d[3] && d[1] === d[2]) return 'ABBA';
    if (d[0] === d[2] && d[1] === d[3]) return 'ABAB';
    if (d[0] === d[1] || d[1] === d[2] || d[2] === d[3]) return 'TWIN';
    return 'ACAK';
}
function gabungkanPola() {
    const selected = document.querySelectorAll('.pola-select:checked');
    let gabungan = [];
    selected.forEach(cb => {
        // Gabungkan array berdasarkan pola yang dipilih
        gabungan = gabungan.concat(groups[cb.value]); 
    });
    document.getElementById('outputGabung').value = gabungan.join('\n');
}
