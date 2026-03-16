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

    for (let file of daftarFile) {
        try {
            // 1. Ambil seluruh isi file
            const respon = await fetch(file.url + "?t=" + Date.now());
            const teks = await respon.text();
            
            // 2. Pecah berdasarkan pemisah
            const semuaBlok = teks.split('------------------------------');
            
            // 3. Ambil elemen terakhir yang berisi data (karena hasil split terakhir mungkin kosong jika file berakhir dengan pemisah)
            let blokTerbaru = "";
            for (let i = semuaBlok.length - 1; i >= 0; i--) {
                if (semuaBlok[i].trim().length > 0) {
                    blokTerbaru = semuaBlok[i].trim();
                    break;
                }
            }

            // 4. Ekstrak Tanggal
            const barisTanggal = blokTerbaru.split('\n').find(b => b.includes('Tanggal Result:'));
            const tgl = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "Data tidak tersedia";

            // 5. Pencocokan Angka (hanya di blok ini)
            const ditemukan = daftarCari.find(angka => blokTerbaru.includes(angka));

            if (ditemukan) {
                // Cari kategori prize di blok ini
                const barisPrize = blokTerbaru.split('\n').find(b => b.includes(ditemukan));
                const prizeCocok = barisPrize ? barisPrize.split(':')[0].trim() : "Result";
                
                hasilTerakhir.push({ 
                    pasaran: file.nama, 
                    class: file.class, 
                    tanggal: tgl, 
                    prize: prizeCocok, 
                    angkaDitemukan: ditemukan, 
                    inputAsli: inputAngka 
                });
            } else {
                // Simpan juga info "tidak ada" agar kita bisa tahu tanggal terakhir yang dicek
                console.log(`${file.nama} terbaru (${tgl}) tidak ada angka ${inputAngka}`);
            }
        } catch (err) { console.log(`Gagal proses ${file.nama}`); }
    }

    if (hasilTerakhir.length === 0) {
        kontainerHasil.innerHTML = `<div style="text-align: center; padding: 20px; font-weight: bold; grid-column: span 4;">
            Angka tidak ditemukan di result terakhir.
        </div>`;
    } else {
        renderHasil(hasilTerakhir, kontainerHasil);
    }
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
async function cekJackpot() {
    const input = document.getElementById('inputJackpot').value;
    const kontainer = document.getElementById('hasilJackpot');
    const nomorUser = input.split(',').map(n => n.trim()).filter(n => n.length === 4);
    
    if (nomorUser.length < 1) {
        alert("Masukkan nomor, Koh!");
        return;
    }

    kontainer.innerHTML = "Menganalisa data...";

    const daftarFile = ['data_keluaran_magnum.txt', 'data_keluaran_kuda.txt', 'data_keluaran_toto.txt', 'data_keluaran_sgp.txt'];
    let hasilFinal = [];

    for (let url of daftarFile) {
        const respon = await fetch(url + "?t=" + Date.now());
        const teks = await respon.text();
        const blokTerbaru = teks.split('------------------------------').filter(b => b.trim()).pop();
        
        // Memetakan nomor ke kategori
        const baris = blokTerbaru.split('\n');
        let grupUtama = [], grupSpecial = [], grupConsolation = [];
        
        baris.forEach(b => {
            let nums = b.match(/\d{4}/g) || [];
            if (b.includes('1st Prize') || b.includes('2nd Prize') || b.includes('3rd Prize')) grupUtama.push(...nums);
            if (b.includes('Special')) grupSpecial.push(...nums);
            if (b.includes('Consolation')) grupConsolation.push(...nums);
        });

        // Cek Jackpot
        nomorUser.forEach(num => {
            if (grupUtama.includes(num)) {
                // Logika Jackpot
                if (nomorUser.filter(n => grupUtama.includes(n)).length >= 2) hasilFinal.push("JACKPOT 1 (2 nomor di Utama)");
                else if (nomorUser.some(n => grupSpecial.includes(n))) hasilFinal.push("JACKPOT 2 (Utama + Special)");
                else hasilFinal.push("JACKPOT HIBURAN 1 (Nomor di Utama)");
            } else if (grupSpecial.includes(num)) {
                hasilFinal.push("JACKPOT HIBURAN 2 (Nomor di Special)");
            } else if (grupConsolation.includes(num)) {
                hasilFinal.push("JACKPOT HIBURAN 3 (Nomor di Consolation)");
            }
        });
    }

    if (hasilFinal.length > 0) {
        kontainer.innerHTML = `<div style="color: green; font-weight: bold;">SELAMAT ANDA MENANG:<br>${[...new Set(hasilFinal)].join('<br>')}</div>`;
    } else {
        kontainer.innerHTML = `<div style="color: red; font-weight: bold;">ANDA BELUM BERUNTUNG</div>`;
    }
}
