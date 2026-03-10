const BASE_URL = "https://raw.githubusercontent.com/Mahasewa/analisa4D/main/";

let dataGlobal = [];
    let pasaranAktif = 'home';
    let halAktif = 0;

    async function muatData() {
        const files = { 'mag': 'data_keluaran_magnum.txt', 'kud': 'data_keluaran_kuda.txt', 'tot': 'data_keluaran_toto.txt' };
        for (let key in files) {
            try {
                const res = await fetch(files[key]);
                const text = await res.text();
                // Split berdasarkan baris, cari yang mengandung "Tanggal Result:"
                const lines = text.split('\n');
                let item = null;
                lines.forEach(line => {
                    if (line.includes("Tanggal Result:")) {
                        if (item) dataGlobal.push(item);
                        item = { pasaran: key, tgl: line.split(":")[1].trim(), p1: "-", p2: "-", p3: "-", spec: "-", cons: "-" };
                    } else if (item) {
                        if (line.includes("1st Prize:")) item.p1 = line.split(":")[1].trim();
                        if (line.includes("2nd Prize:")) item.p2 = line.split(":")[1].trim();
                        if (line.includes("3rd Prize:")) item.p3 = line.split(":")[1].trim();
                        if (line.includes("Special:")) item.spec = line.split(":")[1].trim();
                        if (line.includes("Consolation:")) item.cons = line.split(":")[1].trim();
                    }
                });
                if (item) dataGlobal.push(item);
            } catch (e) { console.error("Error load " + files[key]); }
        }
        dataGlobal.sort((a,b) => new Date(b.tgl) - new Date(a.tgl));
        render();
    }

    function render() {
        const kontainer = document.getElementById('kontenData');
        let filtered = (pasaranAktif === 'home') ? dataGlobal : dataGlobal.filter(d => d.pasaran === pasaranAktif);
        let start = halAktif * 6;
        let dataTampil = filtered.slice(start, start + 6);
        
        kontainer.innerHTML = dataTampil.length ? "" : "Data tidak ditemukan.";
        dataTampil.forEach(d => {
            kontainer.innerHTML += `
                <div class="card">
                    <div class="card-header">${d.pasaran.toUpperCase()} - ${d.tgl}</div>
                    <div>1st: ${d.p1} | 2nd: ${d.p2} | 3rd: ${d.p3}</div>
                    <div style="font-size:12px; margin-top:5px;">Spec: ${d.spec}</div>
                    <div style="font-size:12px;">Cons: ${d.cons}</div>
                </div>`;
        });
        document.getElementById('infoHal').innerText = "Halaman " + (halAktif + 1);
    }

    function pilihPasaran(p) { pasaranAktif = p; halAktif = 0; render(); }
    function ubahHalaman(dir) { 
        halAktif = Math.max(0, halAktif + dir); 
        render(); 
    }

    document.addEventListener("DOMContentLoaded", muatData);
