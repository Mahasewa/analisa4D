async function sedotDataLengkap(fileName, prefix) {
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const baris = text.trim().split('\n');
        
        let dataHalaman = { tgl: "", p1: "", p2: "", p3: "", spec: [], cons: [] };

        // Mencari blok data terakhir di file Koh
        for (let i = baris.length - 1; i >= 0; i--) {
            if (baris[i].includes("1st Prize:")) dataHalaman.p1 = baris[i].split(":")[1].trim();
            if (baris[i].includes("2nd Prize:")) dataHalaman.p2 = baris[i].split(":")[1].trim();
            if (baris[i].includes("3rd Prize:")) dataHalaman.p3 = baris[i].split(":")[1].trim();
            if (baris[i].includes("Special:")) dataHalaman.spec = baris[i].split(":")[1].trim().split(", ");
            if (baris[i].includes("Consolation:")) dataHalaman.cons = baris[i].split(":")[1].trim().split(", ");
            if (baris[i].includes("Tanggal Result:")) {
                dataHalaman.tgl = baris[i].split(":")[1].trim();
                break; // Berhenti jika sudah dapat satu blok lengkap terbaru
            }
        }

        // Tampilkan ke HTML
        document.getElementById(prefix + '1').innerText = dataHalaman.p1;
        document.getElementById(prefix + '2').innerText = dataHalaman.p2;
        document.getElementById(prefix + '3').innerText = dataHalaman.p3;
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + dataHalaman.tgl;

        // Isi Special & Consolation
        const buatGrid = (containerId, dataArray) => {
            const container = document.getElementById(containerId);
            container.innerHTML = "";
            dataArray.forEach(angka => {
                let span = document.createElement('span');
                span.innerText = angka;
                container.appendChild(span);
            });
        };

        buatGrid(prefix + 'Spec', dataHalaman.spec);
        buatGrid(prefix + 'Cons', dataHalaman.cons);

    } catch (err) {
        console.error("Gagal baca " + fileName, err);
    }
}

// Jalankan untuk 3 file
sedotDataLengkap('data_keluaran_magnum.txt', 'mag');
sedotDataLengkap('data_keluaran_kuda.txt', 'kud');
sedotDataLengkap('data_keluaran_toto.txt', 'tot');
