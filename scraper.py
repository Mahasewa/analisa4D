import requests
from bs4 import BeautifulSoup
import os

def get_magnum_data():
    # URL Arsip Magnum (Contoh untuk mengambil data terbaru)
    url = "https://www.magnum4d.my/en/results" 
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Logika pengambilan angka Prize 1, 2, 3, Special, Consolation
        # (Bagian ini akan kita pertajam setelah Anda cek struktur HTML-nya)
        
        result_text = "Tanggal: 03-03-2026\n1st: 1234\n2nd: 5678\n3rd: 9012\nSpecial: ...\nConsolation: ...\n"
        
        # Simpan ke file
        with open("data_keluaran_magnum.txt", "a") as f:
            f.write(result_text + "\n---\n")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_magnum_data()
