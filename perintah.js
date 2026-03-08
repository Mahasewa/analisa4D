// --- FUNGSI UTAMA (HALAMAN DEPAN) ---

async function ambilDataLengkap(fileName, prefix) {
    try {
        const response = await fetch(fileName); [cite: 12]
        const text = await response.text(); [cite: 13]
        const baris = text.trim().split('\n'); [cite: 13]
        
        let data = { tgl: "", p1: "-", p2: "-", p3: "-", spec: "-", cons: "-" }; [cite: 13]
        for (let i = baris.length - 1; i >= 0; i--) { [cite: 14]
            let line = baris[i].trim(); [cite: 14]
            if (line.includes("1st Prize:")) data.p1 = line.split(":")[1].trim(); [cite: 15]
            if (line.includes("2nd Prize:")) data.p2 = line.split(":")[1].trim(); [cite: 15]
            if (line.includes("3rd Prize:")) data.p3 = line.split(":")[1].trim(); [cite: 15]
            if (line.includes("Special:")) data.spec = line.split(":")[1].trim(); [cite: 16]
            if (line.includes("Consolation:")) data.cons = line.split(":")[1].trim(); [cite: 16]
            if (line.includes("Tanggal Result:")) { [cite: 17]
                data.tgl = line.split(":")[1].trim(); [cite: 17]
                break; [cite: 18]
            }
        }

        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + data.tgl; [cite: 18]
        document.getElementById(prefix + '1').innerText = data.p1; [cite: 19]
        document.getElementById(prefix + '2').innerText = data.p2; [cite: 19]
        document.getElementById(prefix + '3').innerText = data.p3; [cite: 19]

        const renderGrid = (containerId, teksAngka) => {
            const container = document.getElementById(containerId); [cite: 20]
            if (!container) return; [cite: 21]
            container.innerHTML = ""; [cite: 21]
            if (teksAngka !== "-") {
                const list = teksAngka.split(', '); [cite: 21]
                list.forEach(num => {
                    let span = document.createElement('span'); [cite: 22]
                    span.innerText = num; [cite: 22]
                    container.appendChild(span); [cite: 22]
                });
            }
        };

        renderGrid(prefix + 'Spec', data.spec); [cite: 23]
        renderGrid(prefix + 'Cons', data.cons); [cite: 23]
        
        const gabungan = data.p1 + data.p2 + data.p3 + data.spec.replace(/, /g, '') + data.cons.replace(/, /g, ''); [cite: 24]
        document.getElementById(prefix + '1').setAttribute('data-all', gabungan); [cite: 25]
        // Tambahan attribute untuk generator
        document.getElementById(prefix + '1').setAttribute('data-prizes', data.p1 + "," + data.p2 + "," + data.p3);
        document.getElementById(prefix + '1').setAttribute('data-spec', data.spec);
        document.getElementById(prefix + '1').setAttribute('data-cons', data.cons);

    } catch (err) {
        console.error("Gagal sedot file: " + fileName, err); [cite: 25]
    }
}

function jalankanGenerator() {
    const out = document.getElementById('analysisResult'); [cite: 26]
    const limitDigit = parseInt(document.getElementById('jumlahDigit').value); [cite: 26]
    out.innerHTML = `<h4><i class='fa-solid fa-microchip'></i> BBFS Sapu Jagat (Top ${limitDigit} Digit):</h4>`; [cite: 27]
    
    const markets = [
        { id: 'checkMagnum', prefix: 'mag', name: 'MAGNUM' }, [cite: 28]
        { id: 'checkKuda', prefix: 'kud', name: 'KUDA' }, [cite: 28]
        { id: 'checkToto', prefix: 'tot', name: 'TOTO' } [cite: 28]
    ];

    markets.forEach(m => {
        if (document.getElementById(m.id).checked) { [cite: 29]
            const el = document.getElementById(m.prefix + '1'); [cite: 29]
            const p123 = el.getAttribute('data-prizes') || ""; [cite: 29]
            const spec = el.getAttribute('data-spec') || ""; [cite: 29]
            const cons = el.getAttribute('data-cons') || ""; [cite: 29]

            const semuaNomor = (p123 + "," + spec + "," + cons).split(',').filter(n => n.trim().length >= 4); [cite: 30]

            let skorAngka = {};
            for (let i = 0; i <= 9; i++) skorAngka[i] = 0; [cite: 30]

            semuaNomor.forEach(no => {
                let unik = [...new Set(no.trim().split(''))]; [cite: 31]
                unik.forEach(digit => { if(skorAngka[digit] !== undefined) skorAngka[digit]++; }); [cite: 31]
            });

            let bbfsHasil = Object.keys(skorAngka)
                .sort((a, b) => skorAngka[b] - skorAngka[a]) [cite: 32]
                .slice(0, limitDigit) [cite: 32]
                .sort(); [cite: 32]

            let totalJP = 0; [cite: 33]
            semuaNomor.forEach(no => {
                let digitNo = no.trim().split(''); [cite: 34]
                let isJP = digitNo.every(d => bbfsHasil.includes(d)); [cite: 34]
                if (isJP) totalJP++; [cite: 34]
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
                </div>`; [cite: 35, 36, 37]
        }
    });
}

async function cariDataOtomatis() {
    const tglPilihan = document.getElementById('inputKalender').value; [cite: 38]
    if (!tglPilihan) return; [cite: 39]
    cariDiFile('data_keluaran_magnum.txt', 'mag', tglPilihan); [cite: 40]
    cariDiFile('data_keluaran_kuda.txt', 'kud', tglPilihan); [cite: 40]
    cariDiFile('data_keluaran_toto.txt', 'tot', tglPilihan); [cite: 40]
}

async function cariDiFile(fileName, prefix, tglTarget) {
    try {
        const response = await fetch(fileName); [cite: 41]
        const text = await response.text(); [cite: 42]
        const baris = text.trim().split('\n'); [cite: 42]
        let dataFound = { p1: "----", p2: "----", p3: "----", spec: "-", cons: "-" }; [cite: 42]
        let ketemu = false; [cite: 43]

        for (let i = 0; i < baris.length; i++) {
            if (baris[i].includes("Tanggal Result: " + tglTarget)) { [cite: 43]
                ketemu = true; [cite: 43]
                if (baris[i+1]) dataFound.p1 = baris[i+1].split(":")[1].trim(); [cite: 44]
                if (baris[i+2]) dataFound.p2 = baris[i+2].split(":")[1].trim(); [cite: 45]
                if (baris[i+3]) dataFound.p3 = baris[i+3].split(":")[1].trim(); [cite: 45]
                if (baris[i+4]) dataFound.spec = baris[i+4].split(":")[1].trim(); [cite: 45]
                if (baris[i+5]) dataFound.cons = baris[i+5].split(":")[1].trim(); [cite: 45]
                break; [cite: 46]
            }
        }

        document.getElementById(prefix + '1').innerText = dataFound.p1; [cite: 46]
        document.getElementById(prefix + '2').innerText = dataFound.p2; [cite: 47]
        document.getElementById(prefix + '3').innerText = dataFound.p3; [cite: 47]
        const renderGrid = (id, teks) => {
            const el = document.getElementById(id); [cite: 48]
            el.innerHTML = (teks !== "-") ? teks.split(', ').map(n => `<span>${n}</span>`).join('') : ""; [cite: 49]
        };
        renderGrid(prefix + 'Spec', dataFound.spec); [cite: 49]
        renderGrid(prefix + 'Cons', dataFound.cons); [cite: 50]
        if (ketemu) document.getElementById('lastUpdateTitle').innerText = "Hasil Pencarian: " + tglTarget; [cite: 50]

    } catch (e) { console.log("Gagal mencari di " + fileName); } [cite: 51]
}

// Jalankan saat startup
ambilDataLengkap('data_keluaran_magnum.txt', 'mag'); [cite: 37]
ambilDataLengkap('data_keluaran_kuda.txt', 'kud'); [cite: 38]
ambilDataLengkap('data_keluaran_toto.txt', 'tot'); [cite: 38]


// --- FUNGSI BARU (HISTORI PER PASARAN) ---

let allHistoryData = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentMarketName = "";

function showHome() {
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('history-content').style.display = 'none';
}

async function showHistory(prefix, fileName, marketName) {
    document.getElementById('home-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'block';
    currentMarketName = marketName;
    
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        allHistoryData = []; 
        let currentEntry = {};

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.includes("Tanggal Result:")) currentEntry.tgl = line.split(":")[1].trim();
            if (line.includes("1st Prize:")) currentEntry.p1 = line.split(":")[1].trim();
            if (line.includes("2nd Prize:")) currentEntry.p2 = line.split(":")[1].trim();
            if (line.includes("3rd Prize:")) currentEntry.p3 = line.split(":")[1].trim();
            if (line.includes("Special:")) currentEntry.spec = line.split(":")[1].trim();
            if (line.includes("Consolation:")) {
                currentEntry.cons = line.split(":")[1].trim();
                allHistoryData.push({...currentEntry});
            }
        }

        allHistoryData.reverse(); 
        currentPage = 1;
        renderHistoryPage();
    } catch (e) { console.error("Gagal memuat histori"); }
}

function renderHistoryPage() {
    const grid = document.getElementById('history-grid');
    grid.innerHTML = "";
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = allHistoryData.slice(start, end);

    pageData.forEach(item => {
        const specSpans = item.spec.split(', ').map(n => `<span>${n}</span>`).join('');
        const consSpans = item.cons.split(', ').map(n => `<span>${n}</span>`).join('');

        let card = document.createElement('div');
        card.className = 'card'; 
        card.innerHTML = `
            <div class="card-header">${currentMarketName} ${item.tgl}</div>
            <div class="main-prizes">
                <div><small>1st</small><div class="num p1">${item.p1}</div></div>
                <div><small>2nd</small><div class="num">${item.p2}</div></div>
                <div><small>3rd</small><div class="num">${item.p3}</div></div>
            </div>
            <div class="extra-prizes">
                <small>Special</small><div class="grid-small">${specSpans}</div>
                <small>Consolation</small><div class="grid-small">${consSpans}</div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('pageInfo').innerText = `Halaman ${currentPage}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (end >= allHistoryData.length);
}

function changePage(step) {
    currentPage += step;
    renderHistoryPage();
    window.scrollTo(0, 0); 
}
