// core.js - Fokus pada pembuatan permutasi dan pemisahan pola

function generateBBFS(digitString, length) {
    let results = [];
    const digits = digitString.split('');

    function permute(current) {
        if (current.length === length) {
            results.push(current);
            return;
        }
        for (let i = 0; i < digits.length; i++) {
            permute(current + digits[i]);
        }
    }
    permute("");
    return results;
}

function getPatternType(num) {
    const d = num.toString().split('');
    // Logika deteksi pola
    if (d[0] === d[1] && d[1] === d[2] && d[2] === d[3]) return 'QUAD';
    if ((d[0] === d[1] && d[1] === d[2]) || (d[1] === d[2] && d[2] === d[3])) return 'TRIPLE';
    if (d[0] === d[1] && d[2] === d[3]) return 'AABB';
    if (d[0] === d[3] && d[1] === d[2]) return 'ABBA';
    if (d[0] === d[2] && d[1] === d[3]) return 'ABAB';
    return 'ACAK';
}
