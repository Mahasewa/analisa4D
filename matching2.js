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
    let tanggalTerbaru = "Data tidak tersedia";

    for (let file of daftarFile) {
        try {
            const respon = await fetch(file.url + "?t=" + Date.now());
            const teks = await respon.text();
            
            // Ambil blok terakhir saja
            const semuaBlok = teks.split('------------------------------');
            const blokTerbaru = semuaBlok[semuaBlok.length - 1].trim();
            
            // Ambil tanggal dari blok tersebut
            const barisTanggal = blokTerbaru.split('\n').find(b => b.includes('Tanggal Result:'));
            const tgl = barisTanggal ? barisTanggal.replace('Tanggal Result:', '').trim() : "";
            if (tgl > tanggalTerbaru) tanggalTerbaru = tgl;

            // Cari angka (mengabaikan spasi dan format label)
            const angkaDalamBlok = blokTerbaru.match(/\d{4}/g) || [];
            const ditemukan = daftarCari.find(angka => angkaDalamBlok.includes(angka));

            if (ditemukan) {
                hasilTerakhir.push({ 
                    pasaran: file.nama, 
                    class: file.class, 
                    tanggal: tgl, 
                    prize: "Result Terbaru", 
                    angkaDitemukan: ditemukan, 
                    inputAsli: inputAngka 
                });
            }
        } catch (err) { console.log(`Error pada ${file.nama}`); }
    }

    if (hasilTerakhir.length === 0) {
        kontainerHasil.innerHTML = `<div style="text-align: center; padding: 20px; font-weight: bold; grid-column: span 4;">
            Angka tidak ditemukan di result terakhir (${tanggalTerbaru})
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
