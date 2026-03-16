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
    return [...new Set(permutations)];
}

async function scanAngka() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    const isPermute = document.getElementById('checkPermute').checked;
    const kontainerHasil = document.getElementById('hasilScan');

    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

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
                    const tanggal = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "0000-00-00";
                    
                    let prizeCocok = "";
                    const barisPrize = blok.split('\n');
                    for (let b of barisPrize) {
                        if (b.includes(ditemukan)) {
                            prizeCocok = b.split(':')[0].trim();
                            break;
                        }
                    }
                    semuaHasil.push({ pasaran: file.nama, class: file.class, tanggal, prize: prizeCocok, angkaDitemukan: ditemukan, inputAsli: inputAngka });
                }
            });
        } catch (err) { console.log(`Gagal: ${file.nama}`); }
    }

    // Panggil fungsi render hasil
    renderHasil(semuaHasil, kontainerHasil);
}

function renderHasil(semuaHasil, kontainerHasil) {
    kontainerHasil.innerHTML = "";
    if (semuaHasil.length === 0) {
        kontainerHasil.innerHTML = `<div style="text-align:center; width:100%;">NOMOR PERAWAN</div>`;
        return;
    }

    // Urutkan per pasaran, lalu tanggal terbaru
    const urutanPasaran = ["MAGNUM", "DAMACAI", "TOTO", "SINGAPORE"];
    
    urutanPasaran.forEach(namaPasaran => {
        let hasilPasaran = semuaHasil.filter(h => h.pasaran === namaPasaran)
                                     .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
        
        if (hasilPasaran.length > 0) {
            let kolom = `<div class="kolom-pasaran">`;
            kolom += `<h3 style="text-align:center;">${namaPasaran}</h3>`;
            hasilPasaran.forEach(h => {
                let info = h.angkaDitemukan !== h.inputAsli ? `<div style="font-size:0.7rem; color:#666;">(BB: ${h.inputAsli})</div>` : "";
                kolom += `
                <div class="card ${h.class}" style="margin-bottom:10px;">
                    <div class="card-header">${h.prize}</div>
                    <div style="padding:10px; text-align:center;">
                        <div style="font-size:0.8rem;">${h.tanggal}</div>
                        <div style="font-size:1.5rem; font-weight:bold;">${h.angkaDitemukan}</div>
                        ${info}
                    </div>
                </div>`;
            });
            kolom += `</div>`;
            kontainerHasil.innerHTML += kolom;
        }
    });
}
// --- FITUR BARU: CEK RESULT TERAKHIR (EFEKTIF) ---
async function scanTerakhir() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    const kontainerHasil = document.getElementById('hasilScan');
    const checkbox = document.getElementById('checkPermute');
    const isPermute = checkbox ? checkbox.checked : false;

    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

    let daftarCari = isPermute ? getPermutations(inputAngka) : [inputAngka];
    kontainerHasil.innerHTML = "Sedang cek result terbaru...";

    const daftarFile = [
        { url: 'data_keluaran_magnum.txt', nama: 'MAGNUM', class: 'warna-magnum' },
        { url: 'data_keluaran_kuda.txt', nama: 'DAMACAI', class: 'warna-kuda' },
        { url: 'data_keluaran_toto.txt', nama: 'TOTO', class: 'warna-toto' },
        { url: 'data_keluaran_sgp.txt', nama: 'SINGAPORE', class: 'warna-sgp' }
    ];

    let hasilTerakhir = [];
    let tanggalPalingBaru = "Data tidak tersedia";

    for (let file of daftarFile) {
        try {
            // TAMBAHAN: Kita kasih "?t=" + Date.now() agar browser dipaksa baca file baru
            const respon = await fetch(file.url + "?t=" + Date.now()); 
            const teks = await respon.text();
            
            const semuaBlok = teks.split('------------------------------');
            const blokTerbaru = semuaBlok[semuaBlok.length - 1].trim();
            
            // Ambil tanggal
            const barisTanggal = blokTerbaru.split('\n').find(b => b.includes('Tanggal Result:'));
            if (barisTanggal) {
                const tgl = barisTanggal.replace('Tanggal Result:', '').trim();
                if (tgl > tanggalPalingBaru) tanggalPalingBaru = tgl;
            }

            // PENCARIAN SANGAT TELITI
            // Kita ambil semua angka yang ada di blok terbaru
            const angkaDalamBlok = blokTerbaru.match(/\d{4}/g) || [];
            
            // Cek apakah angka yang dicari ada di dalam blok
            const ditemukan = daftarCari.find(angka => angkaDalamBlok.includes(angka));

            if (ditemukan) {
                const barisPrize = blokTerbaru.split('\n').find(b => b.includes(ditemukan));
                const prizeCocok = barisPrize ? barisPrize.split(':')[0].trim() : "Prize";
                
                hasilTerakhir.push({ 
                    pasaran: file.nama, 
                    class: file.class, 
                    tanggal: (barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : ""), 
                    prize: prizeCocok, 
                    angkaDitemukan: ditemukan, 
                    inputAsli: inputAngka 
                });
            }
        } catch (err) { console.log(`Gagal cek ${file.nama}:`, err); }
    }

    if (hasilTerakhir.length === 0) {
        kontainerHasil.innerHTML = `<div style="text-align: center; padding: 20px; font-weight: bold; grid-column: span 4;">
            Angka tidak ditemukan di result terakhir (${tanggalPalingBaru})
        </div>`;
    } else {
        renderHasil(hasilTerakhir, kontainerHasil);
    }
}
