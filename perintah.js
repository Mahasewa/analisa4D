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
    out.innerHTML = "<h4><i class='fa-solid fa-microchip'></i> Analisa BBFS Tembus Semua Prize:</h4>";
    
    const markets = [
        { id: 'checkMagnum', key: 'mag', name: 'MAGNUM' },
        { id: 'checkKuda', key: 'kud', name: 'KUDA' },
        { id: 'checkToto', key: 'tot', name: 'TOTO' }
    ];

    markets.forEach(m => {
        if (document.getElementById(m.id).checked) {
            const raw = document.getElementById(m.key + '1').getAttribute('data-all') || "";
            if (raw) {
                const bbfs = [...new Set(raw.match(/\d/g))].sort(); // Ambil angka unik saja
                out.innerHTML += `<div class='res-box'><b>${m.name}:</b><br>${bbfs.map(n => `<span class="bbfs-box">${n}</span>`).join('')}</div>`;
            }
        }
    });
}

// Jalankan saat startup
ambilDataLengkap('data_keluaran_magnum.txt', 'mag');
ambilDataLengkap('data_keluaran_kuda.txt', 'kud');
ambilDataLengkap('data_keluaran_toto.txt', 'tot');
