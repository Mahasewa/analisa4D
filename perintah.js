async function ambilDataLengkap(fileName, prefix) {
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const baris = text.trim().split('\n');
        
        // Objek untuk menampung satu blok data terbaru
        let data = { tgl: "", p1: "-", p2: "-", p3: "-", spec: "-", cons: "-" };

        // Mencari blok data paling bawah (terbaru)
        for (let i = baris.length - 1; i >= 0; i--) {
            let line = baris[i].trim();
            if (line.includes("1st Prize:")) data.p1 = line.split(":")[1].trim();
            if (line.includes("2nd Prize:")) data.p2 = line.split(":")[1].trim();
            if (line.includes("3rd Prize:")) data.p3 = line.split(":")[1].trim();
            if (line.includes("Special:")) data.spec = line.split(":")[1].trim();
            if (line.includes("Consolation:")) data.cons = line.split(":")[1].trim();
            if (line.includes("Tanggal Result:")) {
                data.tgl = line.split(":")[1].trim();
                break; // Berhenti jika satu blok terbaru sudah lengkap
            }
        }

        // 1. Update Tanggal & Prize Utama
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + data.tgl;
        document.getElementById(prefix + '1').innerText = data.p1;
        document.getElementById(prefix + '2').innerText = data.p2;
        document.getElementById(prefix + '3').innerText = data.p3;

        // 2. Update Special & Consolation ke dalam Grid (Biar rapi seperti foto)
        const renderGrid = (containerId, teksAngka) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = ""; // Bersihkan isi lama
            
            if (teksAngka !== "-") {
                const list = teksAngka.split(', ');
                list.forEach(num => {
                    let span = document.createElement('span');
                    span.innerText = num;
                    container.appendChild(span);
                });
            }
        };

        renderGrid(prefix + 'Spec', data.spec);
        renderGrid(prefix + 'Cons', data.cons);

        // 3. Simpan semua angka untuk Generator BBFS
        const gabungan = data.p1 + data.p2 + data.p3 + data.spec.replace(/, /g, '') + data.cons.replace(/, /g, '');
        document.getElementById(prefix + '1').setAttribute('data-all', gabungan);

    } catch (err) {
        console.error("Gagal sedot file: " + fileName, err);
    }
}

// Fungsi Generator untuk membedah BBFS
function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    const limitDigit = parseInt(document.getElementById('jumlahDigit').value);
    out.innerHTML = `<h4><i class='fa-solid fa-microchip'></i> BBFS Sapu Jagat (Top ${limitDigit} Digit):</h4>`;
    
    const markets = [
        { id: 'checkMagnum', prefix: 'mag', name: 'MAGNUM' },
        { id: 'checkKuda', prefix: 'kud', name: 'KUDA' },
        { id: 'checkToto', prefix: 'tot', name: 'TOTO' }
    ];

    markets.forEach(m => {
        if (document.getElementById(m.id).checked) {
            const el = document.getElementById(m.prefix + '1');
            const p123 = el.getAttribute('data-prizes') || "";
            const spec = el.getAttribute('data-spec') || "";
            const cons = el.getAttribute('data-cons') || "";

            // 1. Ambil SEMUA 23 nomor result hari itu
            const semuaNomor = (p123 + "," + spec + "," + cons).split(',').filter(n => n.length >= 4);

            // 2. Hitung angka unik (0-9) yang paling sering muncul di semua prize
            let skorAngka = {};
            for (let i = 0; i <= 9; i++) skorAngka[i] = 0;

            semuaNomor.forEach(no => {
                let unik = [...new Set(no.trim().split(''))];
                unik.forEach(digit => { if(skorAngka[digit] !== undefined) skorAngka[digit]++; });
            });

            // 3. Ambil X angka terkuat (yang paling sering muncul)
            let bbfsHasil = Object.keys(skorAngka)
                .sort((a, b) => skorAngka[b] - skorAngka[a])
                .slice(0, limitDigit)
                .sort();

            // 4. HITUNG ULANG: Berapa banyak nomor yang BENAR-BENAR tembus 4D dengan BBFS ini
            let totalJP = 0;
            semuaNomor.forEach(no => {
                let digitNo = no.trim().split('');
                // Cek apakah semua digit di nomor result ada di dalam bbfsHasil
                let isJP = digitNo.every(d => bbfsHasil.includes(d));
                if (isJP) totalJP++;
            });

            out.innerHTML += `
                <div class='res-box' style="margin-bottom:20px; border-bottom:2px solid #e74c3c; padding-bottom:15px;">
                    <b style="font-size:18px;">${m.name}:</b><br>
                    <div style="margin:10px 0;">
                        ${bbfsHasil.map(n => `<span class="bbfs-box">${n}</span>`).join('')}
                    </div>
                    <div style="background:#27ae60; color:white; padding:5px 10px; border-radius:20px; display:inline-block; font-size:13px; font-weight:bold;">
                        <i class="fa-solid fa-fire"></i> Melahap ${totalJP} Kali JP 4D
                    </div>
                </div>`;
        }
    });
}

// Jalankan saat startup
ambilDataLengkap('data_keluaran_magnum.txt', 'mag');
ambilDataLengkap('data_keluaran_kuda.txt', 'kud');
ambilDataLengkap('data_keluaran_toto.txt', 'tot');
async function cariDataOtomatis() {
    // Ambil tanggal dari kalender (formatnya YYYY-MM-DD)
    const tglPilihan = document.getElementById('inputKalender').value;
    if (!tglPilihan) return;

    console.log("Mencari data untuk tanggal: " + tglPilihan);
    
    // Jalankan pencarian di 3 pasaran
    cariDiFile('data_keluaran_magnum.txt', 'mag', tglPilihan);
    cariDiFile('data_keluaran_kuda.txt', 'kud', tglPilihan);
    cariDiFile('data_keluaran_toto.txt', 'tot', tglPilihan);
}

async function cariDiFile(fileName, prefix, tglTarget) {
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const baris = text.trim().split('\n');
        
        let dataFound = { p1: "----", p2: "----", p3: "----", spec: "-", cons: "-" };
        let ketemu = false;

        // Cari blok yang mengandung Tanggal Result: YYYY-MM-DD
        for (let i = 0; i < baris.length; i++) {
            if (baris[i].includes("Tanggal Result: " + tglTarget)) {
                ketemu = true;
                // Ambil 5 baris di bawahnya (P1, P2, P3, Spec, Cons)
                if (baris[i+1]) dataFound.p1 = baris[i+1].split(":")[1].trim();
                if (baris[i+2]) dataFound.p2 = baris[i+2].split(":")[1].trim();
                if (baris[i+3]) dataFound.p3 = baris[i+3].split(":")[1].trim();
                if (baris[i+4]) dataFound.spec = baris[i+4].split(":")[1].trim();
                if (baris[i+5]) dataFound.cons = baris[i+5].split(":")[1].trim();
                break;
            }
        }

        // Tampilkan hasil ke kartu
        document.getElementById(prefix + '1').innerText = dataFound.p1;
        document.getElementById(prefix + '2').innerText = dataFound.p2;
        document.getElementById(prefix + '3').innerText = dataFound.p3;
        
        const renderGrid = (id, teks) => {
            const el = document.getElementById(id);
            el.innerHTML = (teks !== "-") ? teks.split(', ').map(n => `<span>${n}</span>`).join('') : "";
        };
        renderGrid(prefix + 'Spec', dataFound.spec);
        renderGrid(prefix + 'Cons', dataFound.cons);

        if (ketemu) {
            document.getElementById('lastUpdateTitle').innerText = "Hasil Pencarian: " + tglTarget;
        }

    } catch (e) { console.log("Gagal mencari di " + fileName); }
}
// Variabel Global untuk Histori
let allHistoryData = [];
let currentPage = 1;
const itemsPerPage = 6;

function showHome() {
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('history-content').style.display = 'none';
}

async function showHistory(prefix, fileName) {
    document.getElementById('home-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'block';
    document.getElementById('history-title').innerText = "Histori: " + fileName.replace('.txt', '').replace('data_keluaran_', '').toUpperCase();
    
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        allHistoryData = []; // Reset data
        let currentEntry = {};

        // Parsing file menjadi array objek
        lines.forEach(line => {
            if (line.includes("Tanggal Result:")) currentEntry.tgl = line.split(":")[1].trim();
            if (line.includes("1st Prize:")) currentEntry.p1 = line.split(":")[1].trim();
            if (line.includes("2nd Prize:")) currentEntry.p2 = line.split(":")[1].trim();
            if (line.includes("3rd Prize:")) currentEntry.p3 = line.split(":")[1].trim();
            if (line.includes("Special:")) currentEntry.spec = line.split(":")[1].trim();
            if (line.includes("Consolation:")) {
                currentEntry.cons = line.split(":")[1].trim();
                allHistoryData.push({...currentEntry}); // Simpan blok lengkap
            }
        });

        allHistoryData.reverse(); // Terbaru di atas
        currentPage = 1;
        renderHistoryPage();
    } catch (e) { console.error("Gagal load histori"); }
}

function renderHistoryPage() {
    const container = document.getElementById('history-table-container');
    container.innerHTML = "";
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = allHistoryData.slice(start, end);

    pageData.forEach(item => {
        let card = document.createElement('div');
        card.className = 'hist-card';
        card.innerHTML = `
            <div style="background:#2c3e50; color:white; padding:5px; text-align:center; font-weight:bold; border-radius:4px 4px 0 0;">${item.tgl}</div>
            <table>
                <tr><th colspan="3" style="color:#e74c3c">Utama</th></tr>
                <tr><td>${item.p1}</td><td>${item.p2}</td><td>${item.p3}</td></tr>
                <tr><th colspan="3">Special</th></tr>
                <tr><td colspan="3">${item.spec}</td></tr>
                <tr><th colspan="3">Consolation</th></tr>
                <tr><td colspan="3">${item.cons}</td></tr>
            </table>
        `;
        container.appendChild(card);
    });

    document.getElementById('pageInfo').innerText = `Halaman ${currentPage}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = end >= allHistoryData.length;
}

function changePage(step) {
    currentPage += step;
    renderHistoryPage();
}
