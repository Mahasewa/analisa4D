async function scanAngka() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    const kontainerHasil = document.getElementById('hasilScan');
    
    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

    kontainerHasil.innerHTML = "Sedang mencari...";
    // Opsional: hapus input setelah enter
    document.getElementById('inputScan').value = "";

    const daftarFile = [
        { url: 'data_keluaran_magnum.txt', nama: 'MAGNUM', class: 'warna-magnum' },
        { url: 'data_keluaran_kuda.txt', nama: 'DAMACAI', class: 'warna-kuda' },
        { url: 'data_keluaran_toto.txt', nama: 'TOTO', class: 'warna-toto' }
    ];

    let semuaHasil = [];

    for (let file of daftarFile) {
        try {
            const respon = await fetch(file.url);
            const teks = await respon.text();
            
            // Memecah berdasarkan garis pemisah (---) menjadi blok-blok tanggal
            const blokData = teks.split('------------------------------');

            blokData.forEach(blok => {
                if (blok.includes(inputAngka)) {
                    // Mencari baris tanggal dalam blok
                    const barisTanggal = blok.split('\n').find(b => b.includes('Tanggal Result:'));
                    const tanggal = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "N/A";
                    
                    // Mencari prize mana yang cocok
                    let prizeCocok = "";
                    const barisPrize = blok.split('\n');
                    for (let b of barisPrize) {
                        if (b.includes(inputAngka)) {
                            prizeCocok = b.split(':')[0].trim(); // Ambil nama prize (1st Prize, Special, dll)
                            break;
                        }
                    }

                    semuaHasil.push({
                        pasaran: file.nama,
                        class: file.class,
                        tanggal: tanggal,
                        prize: prizeCocok,
                        angka: inputAngka
                    });
                }
            });
        } catch (err) {
            console.log(`Gagal membaca ${file.nama}`);
        }
    }

    // Tampilkan hasil
    kontainerHasil.innerHTML = "";
    if (semuaHasil.length > 0) {
        semuaHasil.forEach(h => {
            kontainerHasil.innerHTML += `
                <div class="card ${h.class} card-win" style="margin-bottom: 10px;">
                    <div class="card-header">${h.pasaran} - ${h.tanggal}</div>
                    <div style="padding: 15px; text-align: center;">
                        <div style="font-weight: bold; color: #555;">Kategori: ${h.prize}</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #000;">${h.angka}</div>
                    </div>
                </div>`;
        });
    } else {
        kontainerHasil.innerHTML = `<div class="no-data">NOMOR PERAWAN</div>`;
    }
}
// Listener untuk tombol Enter
const inputScan = document.getElementById('inputScan');

inputScan.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Mencegah submit form bawaan
        
        // Panggil fungsi utama
        scanAngka();
        
        // Kasih jeda sedikit (delay) supaya teks tidak hilang sebelum diproses
        setTimeout(() => {
            inputScan.value = ""; 
        }, 100); 
    }
});
