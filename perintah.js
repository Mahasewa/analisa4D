// Fungsi Penyedot Data dari File TXT Maraton
async function sedotData() {
    try {
        // Ambil file yang dibuat oleh Python scraper
        const response = await fetch('data_keluaran_semua.txt');
        if (!response.ok) throw new Error("File TXT belum ada atau kosong");
        
        const text = await response.text();
        const baris = text.trim().split('\n');
        
        // Ambil baris terakhir (data paling baru)
        const dataTerbaru = baris[baris.length - 1]; 
        const [tanggal, angkaTeks] = dataTerbaru.split(': ');
        const daftarAngka = angkaTeks.split(',');

        // Update Tampilan Default (3 Pasaran Utama)
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + tanggal;
        document.getElementById('resMagnum').innerText = daftarAngka[0] || "----";
        document.getElementById('resKuda').innerText = daftarAngka[1] || "----";
        document.getElementById('resToto').innerText = daftarAngka[2] || "----";

        console.log("Senjata Siap! Data terakhir berhasil dimuat.");
    } catch (err) {
        console.error("Gagal muat data:", err);
        document.getElementById('lastUpdateTitle').innerText = "Belum ada data di file TXT";
    }
}

// Fungsi Generator Analisa BBFS (Keinginan Koh)
function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    out.innerHTML = "<h4><i class='fa-solid fa-microchip'></i> Hasil Bedah Kombinasi:</h4>";
    
    let target = [];
    if(document.getElementById('checkMagnum').checked) target.push({n: "MAGNUM", v: document.getElementById('resMagnum').innerText});
    if(document.getElementById('checkKuda').checked) target.push({n: "KUDA", v: document.getElementById('resKuda').innerText});
    if(document.getElementById('checkToto').checked) target.push({n: "TOTO", v: document.getElementById('resToto').innerText});

    target.forEach(item => {
        if(item.v !== "----") {
            // Logika Generator: Mengambil angka unik dari 4D
            let bbfs = [...new Set(item.v.split(''))].sort();
            let html = `<div style='margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;'>
                <b>${item.n} (${item.v}):</b><br>
                Kombinasi BBFS tembus: `;
            bbfs.forEach(n => {
                html += `<span class="bbfs-box">${n}</span>`;
            });
            html += `<br><small>Hanya butuh ${bbfs.length} digit untuk tembus 4D ini.</small></div>`;
            out.innerHTML += html;
        }
    });
}

// Panggil fungsi sedot data saat website dibuka
sedotData();
