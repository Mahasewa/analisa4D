// Fungsi Utama untuk Mengambil Data dari 3 File Berbeda
async function ambilSemuaData() {
    try {
        // Tarik data dari masing-masing file pasaran
        const [resMag, resKud, resTot] = await Promise.all([
            fetch('data_keluaran_magnum.txt').then(r => r.text()).catch(() => ""),
            fetch('data_keluaran_kuda.txt').then(r => r.text()).catch(() => ""),
            fetch('data_keluaran_toto.txt').then(r => r.text()).catch(() => "")
        ]);

        // Fungsi bantu untuk ambil baris terakhir dan pecah datanya
        const prosesBaris = (teks) => {
            if (!teks.trim()) return { tgl: "--/--/--", angka: "----" };
            const baris = teks.trim().split('\n');
            const terakhir = baris[baris.length - 1];
            const bagian = terakhir.split(': '); // Format "DD-MM-YYYY: 1234,5678..."
            return {
                tgl: bagian[0],
                angka: bagian[1] ? bagian[1].split(',')[0] : "----" // Ambil angka pertama (Prize 1)
            };
        };

        const dataMag = prosesBaris(resMag);
        const dataKud = prosesBaris(resKud);
        const dataTot = prosesBaris(resTot);

        // Update Tampilan Kartu di Dashboard
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + dataMag.tgl;
        document.getElementById('resMagnum').innerText = dataMag.angka;
        document.getElementById('resKuda').innerText = dataKud.angka;
        document.getElementById('resToto').innerText = dataTot.angka;

        console.log("Data 3 Pasaran Berhasil Dimuat, Koh!");
    } catch (err) {
        console.error("Gagal sinkronisasi data:", err);
    }
}

// Fungsi Generator Analisa BBFS (Keinginan Koh)
function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    out.innerHTML = "<h4><i class='fa-solid fa-microchip'></i> Analisa BBFS Tembus 4D:</h4>";
    
    let checklist = [
        { id: 'checkMagnum', n: "MAGNUM", v: document.getElementById('resMagnum').innerText },
        { id: 'checkKuda', n: "KUDA", v: document.getElementById('resKuda').innerText },
        { id: 'checkToto', n: "TOTO", v: document.getElementById('resToto').innerText }
    ];

    checklist.forEach(item => {
        if(document.getElementById(item.id).checked && item.v !== "----") {
            // Ambil angka unik untuk BBFS
            let bbfs = [...new Set(item.v.split(''))].sort();
            let html = `
                <div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <b style="color:#2c3e50;">${item.n} [${item.v}]:</b><br>
                    Set BBFS: ${bbfs.map(n => `<span class="bbfs-box">${n}</span>`).join(' ')}
                    <br><small>Hanya butuh <b>${bbfs.length} digit</b> untuk jebol 4D.</small>
                </div>`;
            out.innerHTML += html;
        }
    });
}

// Jalankan saat halaman dibuka
ambilSemuaData();
