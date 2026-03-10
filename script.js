// --- KONFIGURASI ---
const BASE_URL = "https://raw.githubusercontent.com/Mahasewa/analisa4D/main/";

// --- FUNGSI UNTUK INDEX.HTML (Pencarian & Result Terakhir) ---
async function ambilDataLengkap(fileName, prefix) {
    try {
        const response = await fetch(BASE_URL + fileName);
        const text = await response.text();
        const baris = text.trim().split('\n');
        let data = { tgl: "", p1: "-", p2: "-", p3: "-", spec: "-", cons: "-" };
        
        for (let i = baris.length - 1; i >= 0; i--) {
            let line = baris[i].trim();
            if (line.includes("1st Prize:")) data.p1 = line.split(":")[1].trim();
            if (line.includes("2nd Prize:")) data.p2 = line.split(":")[1].trim();
            if (line.includes("3rd Prize:")) data.p3 = line.split(":")[1].trim();
            if (line.includes("Special:")) data.spec = line.split(":")[1].trim();
            if (line.includes("Consolation:")) data.cons = line.split(":")[1].trim();
            if (line.includes("Tanggal Result:")) { data.tgl = line.split(":")[1].trim(); break; }
        }
        
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + data.tgl;
        document.getElementById(prefix + '1').innerText = data.p1;
        document.getElementById(prefix + '2').innerText = data.p2;
        document.getElementById(prefix + '3').innerText = data.p3;
        
        const renderGrid = (id, teks) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = (teks !== "-") ? teks.split(', ').map(n => `<span>${n}</span>`).join('') : "";
        };
        renderGrid(prefix + 'Spec', data.spec);
        renderGrid(prefix + 'Cons', data.cons);
    } catch (err) { console.error("Gagal ambil data: " + fileName, err); }
}
function cariDataOtomatis() {
        const tgl = document.getElementById('inputKalender').value;
        if (!tgl) return;
        cariDiFile('data_keluaran_magnum.txt', 'mag', tgl);
        cariDiFile('data_keluaran_kuda.txt', 'kud', tgl);
        cariDiFile('data_keluaran_toto.txt', 'tot', tgl);
    }

// --- FUNGSI UNTUK HISTORY.HTML (Tabel Data) ---
let dataGlobal = [];
async function muatData() {
    const files = ["data_keluaran_magnum.txt", "data_keluaran_kuda.txt", "data_keluaran_toto.txt"];
    for (let file of files) {
        // ... (Logika muatData yang sudah kita buat sebelumnya) ...
        // Ingat untuk tetap menggunakan BASE_URL + file
    }
    if (typeof render === 'function') render();
}
