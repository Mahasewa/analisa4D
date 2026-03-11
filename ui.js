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

// 2. Fungsi untuk Menampilkan Hasil (Pemicu Error sebelumnya)
function renderHasil(data) {
    const output = document.getElementById('outputHasil');
    if (data.length === 0) {
        output.innerHTML = "<p>Tidak ada angka yang cocok, Koh.</p>";
        return;
    }
    output.innerHTML = `
        <div class="result-block">
            <h3>HASIL 4D ACAK (${data.length} line)</h3>
            <textarea style="width: 100%; height: 200px; font-family: monospace;">${data.join('\n')}</textarea>
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
