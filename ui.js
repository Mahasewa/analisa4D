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
