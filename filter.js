// filter.js - Fokus pada penyaringan data

// 1. Filter Database Sejarah (Pasaran)
async function filterByDatabase(listAngka, pasaranDipilih) {
    let hasil = listAngka;
    for (let pasaran of pasaranDipilih) {
        // Asumsi data pasaran sudah tersimpan di memori atau fetch per pasaran
        const data = await fetch(`data_keluaran_${pasaran}.txt`).then(r => r.text());
        hasil = hasil.filter(angka => !data.includes(angka));
    }
    return hasil;
}

// 2. Filter Posisi (Anti-Angka)
// Contoh: rules = [{as: '1', kop: '2', kepala: '3', ekor: '4'}, ...]
function filterByPosisi(listAngka, rules) {
    return listAngka.filter(angka => {
        const d = angka.split('');
        // Jika angka cocok dengan salah satu rule, maka ELIMINASI (Return false)
        for (let rule of rules) {
            if ((!rule.as || d[0] === rule.as) &&
                (!rule.kop || d[1] === rule.kop) &&
                (!rule.kepala || d[2] === rule.kepala) &&
                (!rule.ekor || d[3] === rule.ekor)) {
                return false; 
            }
        }
        return true;
    });
}
