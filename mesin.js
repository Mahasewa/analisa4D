function generateBBFS(digitString) {
    let results = [];
    const d = digitString.split('');
    for(let a of d) for(let b of d) for(let c of d) for(let e of d) 
        results.push(a+b+c+e);
    return results;
}

function filterPosisi(list, rules) {
    return list.filter(num => {
        const d = num.split('');
        return !rules.some(r => 
            (r.as && d[0] === r.as) || (r.kop && d[1] === r.kop) || 
            (r.kep && d[2] === r.kep) || (r.ekor && d[3] === r.ekor)
        );
    });
}

function getPattern(n) {
    const d = n.split('');
    if (d[0] === d[1] && d[1] === d[2] && d[2] === d[3]) return 'QUAD';
    if ((d[0]===d[1] && d[1]===d[2]) || (d[1]===d[2] && d[2]===d[3])) return 'TRIPLE';
    if (d[0] === d[1] && d[2] === d[3]) return 'AABB';
    if (d[0] === d[3] && d[1] === d[2]) return 'ABBA';
    if (d[0] === d[2] && d[1] === d[3]) return 'ABAB';
    if (d[0]===d[1] || d[1]===d[2] || d[2]===d[3]) return 'TWIN';
    return 'ACAK';
}
