import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def get_data_selenium(target_date):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # URL dengan huruf 's' yang sudah fix
        url = f"https://4dno.org/past-results-history/{target_date}"
        print(f"--- Membuka Alamat: {url} ---")
        driver.get(url)
        
        # Tunggu 20 detik agar aman sesuai permintaan Koh
        print("Menunggu halaman stabil (20 detik)...")
        time.sleep(20) 
        
        rows = driver.find_elements(By.TAG_NAME, "tr")
        print(f"Berhasil menemukan {len(rows)} baris data.")
        
        current_market = ""
        numbers = []

        for row in rows:
            text = row.text.upper()
            
            # Cek apakah baris ini berisi Judul Pasaran
            new_market = ""
            if "MAGNUM 4D" in text:
                new_market = "MAGNUM"
            elif "DA MA CAI 1+3D" in text:
                new_market = "KUDA"
            elif "SPORTS TOTO 4D" in text:
                new_market = "TOTO"

            if new_market:
                # Jika sebelumnya sudah ada data pasaran lain, simpan dulu sebelum pindah
                if current_market and len(numbers) > 0:
                    save_to_file(f"data_keluaran_{current_market.lower()}.txt", target_date, numbers)
                
                current_market = new_market
                numbers = []
                print(f"Menemukan Sektor: {current_market}")
                continue

            # Ambil angka 4 digit di dalam baris tersebut
            cells = row.find_elements(By.TAG_NAME, "td")
            for cell in cells:
                val = cell.text.strip()
                if val.isdigit() and len(val) == 4:
                    numbers.append(val)

        # Simpan pasaran terakhir setelah perulangan selesai
        if current_market and len(numbers) > 0:
            save_to_file(f"data_keluaran_{current_market.lower()}.txt", target_date, numbers)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.quit()

def save_to_file(filename, date, n):
    try:
        # Menghapus duplikat angka tanpa merubah urutan
        n_clean = []
        for x in n:
            if x not in n_clean:
                n_clean.append(x)
        
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n_clean[0] if len(n_clean) > 0 else '-'}\n"
        content += f"2nd Prize: {n_clean[1] if len(n_clean) > 1 else '-'}\n"
        content += f"3rd Prize: {n_clean[2] if len(n_clean) > 2 else '-'}\n"
        
        if len(n_clean) > 3:
            content += f"Special/Cons: {', '.join(n_clean[3:])}\n"
        
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
        print(f"SUKSES: Data ditulis ke {filename} (Total: {len(n_clean)} angka)")
    except Exception as e:
        print(f"Gagal Menulis File: {e}")

def run_history_scraper():
    # Tes satu hari yang pasti ada datanya: 1 Maret 2026
    test_date = "01-03-2026"
    print(f"MEMULAI PROSES SCRAPING: {test_date}")
    get_data_selenium(test_date)

if __name__ == "__main__":
    run_history_scraper()
