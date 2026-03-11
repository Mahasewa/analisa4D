async function scanAngka() {
    const inputAngka = document.getElementById('inputScan').value.trim();
    const kontainerHasil = document.getElementById('hasilScan');
    
    if (inputAngka.length < 4) {
        alert("Masukkan 4 digit angka, Koh!");
        return;
    }

    kontainerHasil.innerHTML = "Sedang mencari...";

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
            const baris = teks.split('\n');

            baris.forEach(line => {
                if (line.includes(inputAngka)) {
                    semuaHasil.push({
                        pasaran: file.nama,
                        class: file.class,
                        info: line // Asumsi format baris: Tgl, Prize, Angka
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
                <div class="card ${h.class} card-win">
                    <div class="card-header">${h.pasaran}</div>
                    <div style="padding: 15px;">${h.info}</div>
                </div>`;
        });
    } else {
        kontainerHasil.innerHTML = `<div class="no-data">NOMOR PERAWAN</div>`;
    }
}
