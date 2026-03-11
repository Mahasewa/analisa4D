let currentGroups = {};

function tambahBarisFilter() {
    const div = document.createElement('div');
    div.className = 'filter-row';
    div.innerHTML = `<input type="text" class="f-as" maxlength="1" placeholder="As"><input type="text" class="f-kop" maxlength="1" placeholder="Kop"><input type="text" class="f-kep" maxlength="1" placeholder="Kep"><input type="text" class="f-ekor" maxlength="1" placeholder="Ekor">`;
    document.getElementById('filterContainer').appendChild(div);
}

function jalankanProses() {
    const input = document.getElementById('inputBBFS').value;
    let hasil = generateBBFS(input);
    const rows = document.querySelectorAll('.filter-row');
    let rules = [];
    rows.forEach(r => rules.push({
        as: r.querySelector('.f-as').value, kop: r.querySelector('.f-kop').value,
        kep: r.querySelector('.f-kep').value, ekor: r.querySelector('.f-ekor').value
    }));
    hasil = filterPosisi(hasil, rules);
    currentGroups = { ACAK: [], TWIN: [], TRIPLE: [], QUAD: [], AABB: [], ABBA: [], ABAB: [] };
    hasil.forEach(n => {
        let p = getPattern(n);
        if (currentGroups[p]) currentGroups[p].push(n);
        else currentGroups['ACAK'].push(n);
    });
    let html = '';
    for(let p in currentGroups) if(currentGroups[p].length > 0) html += `<label><input type="checkbox" class="pola-select" value="${p}"> ${p} (${currentGroups[p].length})</label><br>`;
    document.getElementById('polaContainer').innerHTML = html;
}

function gabungkanPola() {
    const selected = document.querySelectorAll('.pola-select:checked');
    let gabungan = [];
    selected.forEach(cb => gabungan = gabungan.concat(currentGroups[cb.value]));
    document.getElementById('outputHasil').innerHTML = `<div class="result-flow">${gabungan.join('*')}</div>`;
}
