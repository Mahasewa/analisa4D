import os
import re
from datetime import datetime

def urutkan_dan_timpa():
    # Daftar file asli yang ingin langsung dirapikan
    files = ["data_keluaran_kuda.txt", "data_keluaran_magnum.txt", "data_keluaran_toto.txt"]
    
    for nama_file in files:
        if os.path.exists(nama_file):
            print(f"Merapikan isi {nama_file}...")
            
            # 1. Baca isi file asli
            with open(nama_file, 'r') as f:
                content = f.read().strip()
            
            # 2. Pecah per blok berdasarkan garis pemisah
            blocks = [b.strip() for b in content.split('------------------------------') if b.strip()]
            
            # 3. Fungsi untuk mengambil tanggal agar sortir akurat
            def ambil_tanggal(block):
                # Mencari format Tanggal Result: YYYY-MM-DD
                match = re.search(r'Tanggal Result: (\d{4}-\d{2}-\d{2})', block)
                if match:
                    return datetime.strptime(match.group(1), '%Y-%m-%d')
                return datetime.min

            # 4. SORTING: Dari yang terlama (atas) ke terbaru (bawah)
            blocks.sort(key=ambil_tanggal)
            
            # 5. Tulis ulang KE FILE YANG SAMA (Menimpa isi lama)
            with open(nama_file, 'w') as f:
                for block in blocks:
                    f.write(block + '\n')
                    f.write('------------------------------\n')
            
            print(f"Sukses! {nama_file} sekarang sudah urut tanggal.")
        else:
            print(f"File {nama_file} tidak ditemukan, dilewati.")

if __name__ == "__main__":
    urutkan_dan_timpa()
