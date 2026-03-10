let dataGlobal = [];

async function muatData() {
    const file_map = {
        "mag": "data_keluaran_magnum.txt",
        "kud": "data_keluaran_kuda.txt",
        "tot": "data_keluaran_toto.txt"
    };

    for (let key in file_map) {
        try {
            const url = `https://raw.githubusercontent.com/Mahasewa/analisa4D/main/${file_map[key]}`;
            const res = await fetch(url);
            const text = await res.text();
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
        } catch (e) { console.error("Gagal muat:", file_map[key]); }
    }
    
    // Urutkan data dari yang terbaru
    dataGlobal.sort((a, b) => new Date(b.tgl) - new Date(a.tgl));
    
    // Panggil fungsi render yang ada di file HTML masing-masing
    if (typeof render === 'function') {
        render();
    }
}
