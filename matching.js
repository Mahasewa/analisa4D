// 1. Fungsi untuk menghasilkan permutasi (Bolak-Balik)
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
    // Menghilangkan duplikat jika ada angka kembar
    return [...new Set(permutations)];
}

// 2. Fungsi Utama Pencarian
async function scanAngka() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    const kontainerHasil = document.getElementById('hasilScan');
    const checkbox = document.getElementById('checkPermute');
    const isPermute = checkbox ? checkbox.checked : false;

    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

    // Tentukan daftar angka yang akan dicari
    let daftarCari = isPermute ? getPermutations(inputAngka) : [inputAngka];

    kontainerHasil.innerHTML = "Sedang mencari...";

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
                const ditemukan = daftarCari.find(angka => blok.includes(angka));
                
                if (ditemukan) {
                    const barisTanggal = blok.split('\n').find(b => b.includes('Tanggal Result:'));
                    const tanggal = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "N/A";
                    
                    let prizeCocok = "";
                    const barisPrize = blok.split('\n');
                    for (let b of barisPrize) {
                        if (b.includes(ditemukan)) {
                            prizeCocok = b.split(':')[0].trim();
                            break;
                        }
                    }

                    semuaHasil.push({
                        pasaran: file.nama,
                        class: file.class,
                        tanggal: tanggal,
                        prize: prizeCocok,
                        angkaDitemukan: ditemukan,
                        inputAsli: inputAngka
                    });
                }
            });
        } catch (err) {
            console.log(`Gagal membaca ${file.nama}`);
        }
    }

    // Panggil fungsi untuk menampilkan hasil
    renderHasil(semuaHasil, kontainerHasil);
}

// 3. Fungsi Render Hasil ke Layar
function renderHasil(semuaHasil, kontainerHasil) {
    kontainerHasil.innerHTML = "";
    if (semuaHasil.length > 0) {
        semuaHasil.forEach(h => {
            let infoTambahan = "";
            if (h.angkaDitemukan !== h.inputAsli) {
                infoTambahan = `<div style="font-size: 0.8rem; color: #7f8c8d; margin-top: 5px;">(Hasil bolak-balik dari: ${h.inputAsli})</div>`;
            }

            kontainerHasil.innerHTML += `
                <div class="card ${h.class} card-win" style="margin-bottom: 10px;">
                    <div class="card-header">${h.pasaran} - ${h.tanggal}</div>
                    <div style="padding: 15px; text-align: center;">
                        <div style="font-weight: bold; color: #555;">Kategori: ${h.prize}</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #000;">${h.angkaDitemukan}</div>
                        ${infoTambahan}
                    </div>
                </div>`;
        });
    } else {
        kontainerHasil.innerHTML = `<div class="no-data" style="text-align: center; padding: 20px; font-weight: bold;">NOMOR PERAWAN</div>`;
    }
}

// 4. Listener untuk tombol Enter
const inputScan = document.getElementById('inputScan');
if (inputScan) {
    inputScan.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            scanAngka();
            setTimeout(() => { inputScan.value = ""; }, 100);
        }
    });
}
