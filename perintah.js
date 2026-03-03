// Konfigurasi Fitur Dinamis
const daftarFitur = [
    { nama: "Lihat Data Januari", aksi: "tampilData" },
    { nama: "Cek Hari Result", aksi: "cekHari" },
    { nama: "Update Otomatis", aksi: "refreshData" }
];

// Fungsi untuk membuat tombol secara otomatis saat halaman dibuka
function buatMenu() {
    const container = document.getElementById('menu-container');
    daftarFitur.forEach(fitur => {
        let btn = document.createElement('button');
        btn.innerText = fitur.nama;
        btn.onclick = () => window[fitur.aksi](); // Memanggil fungsi berdasarkan nama aksi
        container.appendChild(btn);
    });
}

// ISI PERINTAH/FUNGSI (Bisa ditambah sesuka hati Koh)
function tampilData() {
    document.getElementById('display-area').innerHTML = "<h3>Memuat data dari data_keluaran_semua.txt...</h3>";
    // Nanti di sini kita pasang kode untuk baca file TXT hasil maraton tadi
}

function cekHari() {
    alert("Hari Result Rutin: Rabu, Sabtu, Minggu (Server Time)");
}

function refreshData() {
    location.reload();
}

// Jalankan pembuatan menu
buatMenu();
