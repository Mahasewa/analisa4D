// ui.js - Fokus pada interaksi tombol dan display

// Fungsi untuk menambah baris filter
function tambahBarisFilter() {
    const container = document.getElementById('filterContainer');
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" class="filter-pos" placeholder="As" maxlength="1">
        <input type="text" class="filter-pos" placeholder="Kop" maxlength="1">
        <input type="text" class="filter-pos" placeholder="Kep" maxlength="1">
        <input type="text" class="filter-pos" placeholder="Ekor" maxlength="1">
    `;
    container.appendChild(div);
}

// Fungsi utama trigger proses
async function jalankanProses() {
    // 1. Ambil input BBFS
    const inputBBFS = document.getElementById('inputBBFS').value;
    let data = generateBBFS(inputBBFS, 4); // Panggil dari core.js
    
    // 2. Jalankan Filter
    data = filterByPosisi(data, ambilRulesDariUI()); // Panggil dari filter.js
    
    // 3. Tampilkan di UI
    renderHasil(data);
}
// ui.js - Jembatan Antar File
function jalankanProses() {
    const inputBBFS = document.getElementById('inputBBFS').value;
    if (inputBBFS.length < 4) { alert("Minimal 4 digit, Koh!"); return; }

    // 1. Generate Kombinasi (dari core.js)
    let hasil = generateBBFS(inputBBFS, 4); 

    // 2. Ambil Filter Posisi dari UI
    const rows = document.querySelectorAll('#filterContainer .filter-row');
    let rules = [];
    rows.forEach(row => {
        rules.push({
            as: row.querySelector('.f-as').value,
            kop: row.querySelector('.f-kop').value,
            kepala: row.querySelector('.f-kep').value,
            ekor: row.querySelector('.f-ekor').value
        });
    });

    // 3. Filter (dari filter.js)
    hasil = filterByPosisi(hasil, rules);

    // 4. Tampilkan
    renderHasil(hasil);
}

// Fungsi bantu pindah kursor otomatis
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('f-as') && e.target.value.length === 1) e.target.nextElementSibling.focus();
    if (e.target.classList.contains('f-kop') && e.target.value.length === 1) e.target.nextElementSibling.focus();
    if (e.target.classList.contains('f-kep') && e.target.value.length === 1) e.target.nextElementSibling.focus();
});
