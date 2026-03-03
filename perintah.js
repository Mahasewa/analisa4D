async function sedotSemuaData() {
    const outlets = [
        { id: 'resMagnum', file: 'data_keluaran_magnum.txt' },
        { id: 'resKuda', file: 'data_keluaran_kuda.txt' },
        { id: 'resToto', file: 'data_keluaran_toto.txt' }
    ];

    try {
        let tglTerakhir = "";

        for (let outlet of outlets) {
            const response = await fetch(outlet.file);
            if (response.ok) {
                const text = await response.text();
                const baris = text.trim().split('\n');
                const dataTerbaru = baris[baris.length - 1]; // Ambil baris paling bawah
                
                // Format di file Koh: "01-03-2026: 3737,2866,9791..."
                const [tgl, angkaTeks] = dataTerbaru.split(': ');
                const daftarAngka = angkaTeks.split(',');

                // Tampilkan Prize 1 di kotak utama
                document.getElementById(outlet.id).innerText = daftarAngka[0] || "----";
                tglTerakhir = tgl;

                // Simpan data lengkap ke elemen (hidden) untuk dianalisa generator nanti
                document.getElementById(outlet.id).setAttribute('data-full', angkaTeks);
            }
        }
        
        if(tglTerakhir) {
            document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + tglTerakhir;
        }
    } catch (err) {
        console.error("Gagal sedot data:", err);
    }
}

function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    out.innerHTML = "<h4><i class='fa-solid fa-microchip'></i> Bedah Kombinasi BBFS (All Prizes):</h4>";
    
    const checklist = [
        { id: 'checkMagnum', name: 'MAGNUM', displayId: 'resMagnum' },
        { id: 'checkKuda', name: 'KUDA', displayId: 'resKuda' },
        { id: 'checkToto', name: 'TOTO', displayId: 'resToto' }
    ];

    checklist.forEach(item => {
        if(document.getElementById(item.id).checked) {
            const fullData = document.getElementById(item.displayId).getAttribute('data-full');
            if(fullData) {
                // Menghapus koma dan mengambil semua angka unik dari P1 sampai Consolation
                const semuaAngka = fullData.replace(/,/g, '');
                const bbfs = [...new Set(semuaAngka.split(''))].sort();
                
                let html = `<div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <b>${item.name}:</b> Kombinasi angka yang keluar di semua prize hari ini:<br>
                    ${bbfs.map(n => `<span class="bbfs-box">${n}</span>`).join(' ')}
                    <br><small>Gunakan ${bbfs.length} digit ini untuk cover semua Prize.</small>
                </div>`;
                out.innerHTML += html;
            }
        }
    });
}

sedotSemuaData();
