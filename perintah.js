// Tambahkan ini di paling atas perintah.js Koh
async function ambilDataDariServer() {
    try {
        // Mengambil file hasil maraton robot
        const response = await fetch('data_keluaran_semua.txt');
        const dataMentah = await response.text();
        
        // Proses pecah data per baris
        const baris = dataMentah.trim().split('\n');
        const hasilTerakhir = baris[baris.length - 1]; // Ambil baris paling bawah (terbaru)
        
        console.log("Data Berhasil Dimuat: " + hasilTerakhir);
        
        // Update tampilan kartu di atas secara otomatis
        updateKartuOtomatis(hasilTerakhir);
    } catch (err) {
        console.log("Gagal ambil data TXT: ", err);
    }
}

function updateKartuOtomatis(teksBaris) {
    // Format di TXT kita: "DD-MM-YYYY: angka1,angka2,angka3..."
    const bagian = teksBaris.split(': ');
    const tgl = bagian[0];
    const angka = bagian[1].split(',');

    document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + tgl;
    document.getElementById('resMagnum').innerText = angka[0] || "----";
    document.getElementById('resKuda').innerText = angka[1] || "----";
    document.getElementById('resToto').innerText = angka[2] || "----";
}

// Panggil fungsi ini saat halaman dibuka
ambilDataDariServer();

// Fungsi simulasi ambil data (Nanti disambung ke data_keluaran_semua.txt)
const dataResult = [
    { tgl: "04-03-2026", magnum: "1234", kuda: "5678", toto: "9012" }
];

// Set tampilan default
function loadDefault() {
    const last = dataResult[0];
    document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + last.tgl;
    document.getElementById('resMagnum').innerText = last.magnum;
    document.getElementById('resKuda').innerText = last.kuda;
    document.getElementById('resToto').innerText = last.toto;
}

function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    out.innerHTML = "<h4>Hasil Analisa Kombinasi Angka (BBFS):</h4>";
    
    let selectedMarkets = [];
    if(document.getElementById('checkMagnum').checked) selectedMarkets.push({name: "MAGNUM", res: document.getElementById('resMagnum').innerText});
    if(document.getElementById('checkKuda').checked) selectedMarkets.push({name: "KUDA", res: document.getElementById('resKuda').innerText});
    if(document.getElementById('checkToto').checked) selectedMarkets.push({name: "TOTO", res: document.getElementById('resToto').innerText});

    selectedMarkets.forEach(m => {
        // Logika membedah angka unik yang membentuk 4D tersebut
        let angkaUnik = [...new Set(m.res.split(''))].sort();
        let html = `<p><b>${m.name} (${m.res}):</b> Kombinasi BBFS yang menembus adalah angka: `;
        angkaUnik.forEach(num => {
            html += `<span class="bbfs-box">${num}</span>`;
        });
        html += ` (Total ${angkaUnik.length} Digit)</p>`;
        out.innerHTML += html;
    });
}

// Jalankan fungsi saat startup
loadDefault();
