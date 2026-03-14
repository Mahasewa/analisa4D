import os
import subprocess
import re
from datetime import datetime

def urutkan_ke_file_baru():
    # Daftar file asli yang ingin diproses
    files = ["data_keluaran_kuda.txt", "data_keluaran_magnum.txt", "data_keluaran_toto.txt"]
    
    for nama_file_asli in files:
        if os.path.exists(nama_file_asli):
            # Tentukan nama file baru (misal: data_keluaran_kuda2.txt)
            nama_file_baru = nama_file_asli.replace(".txt", "2.txt")
            print(f"Memproses {nama_file_asli} -> {nama_file_baru}...")
            
            with open(nama_file_asli, 'r') as f:
                content = f.read().strip()
            
            # 1. Pecah per blok berdasarkan garis pemisah
            blocks = [b.strip() for b in content.split('------------------------------') if b.strip()]
            
            # 2. Fungsi untuk mengambil tanggal agar sortirnya akurat (Kronologis)
            def ambil_tanggal(block):
                match = re.search(r'Tanggal Result: (\d{4}-\d{2}-\d{2})', block)
                if match:
                    return datetime.strptime(match.group(1), '%Y-%m-%d')
                return datetime.min

            # 3. SORTING: Terlama di atas, Terbaru di bawah
            blocks.sort(key=ambil_tanggal)
            
            # 4. Simpan hasil sortir ke FILE BARU
            with open(nama_file_baru, 'w') as f:
                for block in blocks:
                    f.write(block + '\n')
                    f.write('------------------------------\n')
            
            print(f"Sukses membuat {nama_file_baru}")
        else:
            print(f"File {nama_file_asli} tidak ditemukan, dilewati.")

    # 5. Git Push Otomatis untuk file baru
    try:
        print("\nMemulai proses Git Push ke GitHub...")
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", "Tambah file data terurut (Lama ke Baru)"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("\nBeres Bos! File baru sudah ada di GitHub.")
    except Exception as e:
        print(f"\nGagal Push. Pastikan sudah git login di PC. Error: {e}")

if __name__ == "__main__":
    urutkan_ke_file_baru()
 
