async function sedotData(fileName, prefix) {
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        const baris = text.trim().split('\n');
        
        let p1="", p2="", p3="", spec=[], cons=[], tgl="";

        for (let i = baris.length - 1; i >= 0; i--) {
            if (baris[i].includes("1st Prize:")) p1 = baris[i].split(":")[1].trim();
            if (baris[i].includes("2nd Prize:")) p2 = baris[i].split(":")[1].trim();
            if (baris[i].includes("3rd Prize:")) p3 = baris[i].split(":")[1].trim();
            if (baris[i].includes("Special:")) spec = baris[i].split(":")[1].trim().split(", ");
            if (baris[i].includes("Consolation:")) cons = baris[i].split(":")[1].trim().split(", ");
            if (baris[i].includes("Tanggal Result:")) {
                tgl = baris[i].split(":")[1].trim();
                break;
            }
        }

        document.getElementById(prefix + '1').innerText = p1;
        document.getElementById(prefix + '2').innerText = p2;
        document.getElementById(prefix + '3').innerText = p3;
        document.getElementById('lastUpdateTitle').innerText = "Result Terakhir: " + tgl;

        const renderGrid = (id, arr) => {
            const el = document.getElementById(id);
            el.innerHTML = arr.map(n => `<span>${n}</span>`).join('');
        };
        renderGrid(prefix + 'Spec', spec);
        renderGrid(prefix + 'Cons', cons);
        
        // Simpan semua angka untuk generator
        document.getElementById(prefix + '1').setAttribute('data-all', p1+p2+p3+spec.join('')+cons.join(''));

    } catch (e) { console.log("Error baca " + fileName); }
}

function jalankanGenerator() {
    const out = document.getElementById('analysisResult');
    out.innerHTML = "<h4>Hasil Analisa BBFS Tembus (Semua Prize):</h4>";
    ['mag', 'kud', 'tot'].forEach(p => {
        const check = document.getElementById('check' + (p==='mag'?'Magnum':p==='kud'?'Kuda':'Toto'));
        if(check.checked) {
            const allStr = document.getElementById(p + '1').getAttribute('data-all') || "";
            const bbfs = [...new Set(allStr.split(''))].sort();
            out.innerHTML += `<p><b>${p.toUpperCase()}:</b> ${bbfs.map(n => `<span class="bbfs-box">${n}</span>`).join('')}</p>`;
        }
    });
}

// Jalankan otomatis
sedotData('data_keluaran_magnum.txt', 'mag');
sedotData('data_keluaran_kuda.txt', 'kud');
sedotData('data_keluaran_toto.txt', 'tot');
