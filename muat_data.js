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
    if (!kontainer) return;

    let filtered = (pasaranAktif === 'home') ? dataGlobal : dataGlobal.filter(d => d.pasaran === pasaranAktif);
    let start = halAktif * 6;
    let dataTampil = filtered.slice(start, start + 6);

    kontainer.innerHTML = ""; // Bersihkan kontainer sebelum diisi

    dataTampil.forEach(d => {
        // Tentukan class warna (pastikan d.pasaran bernilai 'mag', 'kud', atau 'tot')
        let warnaClass = (d.pasaran === 'mag') ? 'warna-magnum' : 
                         (d.pasaran === 'kud') ? 'warna-kuda' : 'warna-toto';

        kontainer.innerHTML += `
            <div class="card ${warnaClass}">
                <div class="card-header">${d.pasaran.toUpperCase()} - ${d.tgl}</div>
                <div class="main-prizes">
                    <div><small>1st</small><div class="num p1">${d.p1}</div></div>
                    <div><small>2nd</small><div class="num">${d.p2}</div></div>
                    <div><small>3rd</small><div class="num">${d.p3}</div></div>
                </div>
                <div class="extra-prizes">
                    <small>Special</small><div class="grid-small">${d.spec.split(', ').map(n => `<span>${n}</span>`).join('')}</div>
                    <small>Consolation</small><div class="grid-small">${d.cons.split(', ').map(n => `<span>${n}</span>`).join('')}</div>
                </div>
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
