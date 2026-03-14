// Fungsi untuk menghasilkan permutasi (Bolak-Balik)
function getPermutations(str) {
    if (str.length <= 1) return [str];
    let permutations = [];
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let remainingChars = str.slice(0, i) + str.slice(i + 1);
        for (let subPermutation of getPermutations(remainingChars)) {
            permutations.push(char + subPermutation);
        }
    }
    // Menghilangkan duplikat jika ada angka kembar (seperti 1122)
    return [...new Set(permutations)];
}
async function scanAngka() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    // Pastikan ID checkbox di HTML Koh adalah "checkPermute"
    const isPermute = document.getElementById('checkPermute').checked; 

    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

    // LOGIKA BARU: Jika diceklis, buat daftar semua permutasi. Jika tidak, gunakan angka asli saja.
    let daftarCari = isPermute ? getPermutations(inputAngka) : [inputAngka];

    document.getElementById('hasilScan').innerHTML = "Sedang mencari...";

    const daftarFile = [
        { url: 'data_keluaran_magnum.txt', nama: 'MAGNUM', class: 'warna-magnum' },
        { url: 'data_keluaran_kuda.txt', nama: 'DAMACAI', class: 'warna-kuda' },
        { url: 'data_keluaran_toto.txt', nama: 'TOTO', class: 'warna-toto' },
        { url: 'data_keluaran_sgp.txt', nama: 'SINGAPORE', class: 'warna-sgp' }
    ];

    let semuaHasil = [];

    for (let file of daftarFile) {
        try {
            const respon = await fetch(file.url);
            const teks = await respon.text();
            const blokData = teks.split('------------------------------');

            blokData.forEach(blok => {
                // MENCARI KECOCOKAN: Apakah ada angka di daftarCari yang muncul di dalam blok data?
                const ditemukan = daftarCari.find(angka => blok.includes(angka));
                
                if (ditemukan) {
                    const barisTanggal = blok.split('\n').find(b => b.includes('Tanggal Result:'));
                    const tanggal = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "N/A";
                    
                    let prizeCocok = "";
                    const barisPrize = blok.split('\n');
                    for (let b of barisPrize) {
                        if (b.includes(ditemukan)) { // Kita cek baris berdasarkan angka yang ditemukan
                            prizeCocok = b.split(':')[0].trim();
                            break;
                        }
                    }

                    semuaHasil.push({
                        pasaran: file.nama,
                        class: file.class,
                        tanggal: tanggal,
                        prize: prizeCocok,
                        angkaDitemukan: ditemukan, // Angka yang benar-benar cocok
                        inputAsli: inputAngka      // Angka yang diketik Koh
                    });
                }
            });
        } catch (err) {
            console.log(`Gagal membaca ${file.nama}`);
        }
    }

    // Tampilkan hasil (Koh bisa kustomisasi bagian ini sesuai selera)
    tampilkanHasil(semuaHasil);
}

    // Tampilkan hasil
kontainerHasil.innerHTML = "";
if (semuaHasil.length > 0) {
    semuaHasil.forEach(h => {
        // Cek apakah angka yang ditemukan berbeda dengan input asli (artinya bolak-balik)
        let infoTambahan = "";
        if (h.angkaDitemukan !== h.inputAsli) {
            infoTambahan = `<div style="font-size: 0.8rem; color: #7f8c8d; margin-top: 5px;">
                                (Hasil bolak-balik dari: ${h.inputAsli})
                            </div>`;
        }

        kontainerHasil.innerHTML += `
            <div class="card ${h.class} card-win" style="margin-bottom: 10px;">
                <div class="card-header">${h.pasaran} - ${h.tanggal}</div>
                <div style="padding: 15px; text-align: center;">
                    <div style="font-weight: bold; color: #555;">Kategori: ${h.prize}</div>
                    <div style="font-size: 1.8rem; font-weight: bold; color: #000;">
                        ${h.angkaDitemukan}
                    </div>
                    ${infoTambahan}
                </div>
            </div>`;
    });
} else {
    kontainerHasil.innerHTML = `<div class="no-data" style="text-align: center; padding: 20px; font-weight: bold;">NOMOR PERAWAN</div>`;
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
