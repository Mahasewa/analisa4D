import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def uji_intip():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Beritahu web bahwa kita adalah manusia pake browser
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Kita tes tanggal 01-03-2026 yang sudah pasti ada resultnya
    url = "https://4dno.org/past-results-history/01-03-2026"
    
    try:
        print(f"--- MEMULAI UJI INTIP PADA: {url} ---")
        driver.get(url)
        
        # Kasih waktu 10 detik biar loadingnya beneran selesai
        print("Menunggu loading 10 detik...")
        time.sleep(10)
        
        # 1. Cek Judul Halaman
        print(f"Judul Halaman: {driver.title}")
        
        # 2. Ambil SEMUA angka 4 digit yang ada di layar
        # Kita cari di semua tag: div, td, span, b, p
        elements = driver.find_elements(By.XPATH, "//*[self::td or self::div or self::span or self::b]")
        
        ditemukan = []
        for e in elements:
            teks = e.text.strip()
            if teks.isdigit() and len(teks) == 4:
                ditemukan.append(teks)
        
        # Buat daftar angka jadi unik (biar log gak kepanjangan)
        angka_unik = list(dict.fromkeys(ditemukan))
        
        if angka_unik:
            print(f"BERHASIL! Robot melihat {len(angka_unik)} angka unik.")
            print(f"Daftar angka yang tertangkap: {angka_unik}")
        else:
            print("GAGAL: Robot tidak melihat angka 4 digit sama sekali. Halaman mungkin kosong atau terblokir.")

    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        print("--- UJI INTIP SELESAI ---")
        driver.quit()

if __name__ == "__main__":
    uji_intip()
