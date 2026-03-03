import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def get_data_selenium(target_date):
    # Pengaturan Chrome agar bisa jalan di server (Headless)
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Memasang Driver secara otomatis
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    url = f"https://4dno.org/past-result-history/{target_date}"
    
    try:
        print(f"Membuka halaman: {url}")
        driver.get(url)
        time.sleep(5) # Memberi waktu lebih lama agar tabel termuat sempurna
        
        # Mengambil semua baris tabel
        rows = driver.find_elements(By.TAG_NAME, "tr")
        
        current_market = ""
        numbers = []

        for row in rows:
            text = row.text.upper()
            
            # Deteksi Pasaran berdasarkan teks di baris
            if "MAGNUM 4D" in text:
                current_market = "MAGNUM"
                numbers = []
            elif "DA MA CAI" in text:
                current_market = "KUDA"
                numbers = []
            elif "SPORTS TOTO" in text:
                current_market = "TOTO"
                numbers = []

            # Ambil semua cell (td) dan cari angka 4 digit
            cells = row.find_elements(By.TAG_NAME, "td")
            for cell in cells:
                val = cell.text.strip()
                if val.isdigit() and len(val) == 4:
                    numbers.append(val)

            # Jika angka sudah terkumpul lengkap (minimal 23 angka untuk 1 set result)
            if len(numbers) >= 23 and current_market:
                filename = {
                    "MAGNUM": "data_keluaran_magnum.txt",
                    "KUDA": "data_keluaran_kuda.txt",
                    "TOTO": "data_keluaran_toto.txt"
                }.get(current_market)
                
                save_to_file(filename, target_date, numbers)
                current_market = "" # Reset pasaran setelah disimpan
                numbers = []

    except Exception as e:
        print(f"Error pada tanggal {target_date}: {e}")
    finally:
        driver.quit()

def save_to_file(filename, date, n):
    try:
        # Susunan: 1st(0), 2nd(1), 3rd(2), Special(3-12), Consolation(13-22)
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n[0]}\n"
        content += f"2nd Prize: {n[1]}\n"
        content += f"3rd Prize: {n[2]}\n"
        content += f"Special: {', '.join(n[3:13])}\n"
        content += f"Consolation: {', '.join(n[13:23])}\n"
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
        print(f">>> BERHASIL: Data {filename} untuk {date} telah disimpan.")
    except Exception as e:
        print(f"Gagal menulis file: {e}")

def run_history_scraper():
    # TEST: Kita ambil data Februari 2026 dulu (28 hari)
    start_date = datetime(2026, 2, 1)
    end_date = datetime(2026, 2, 3)
    
    current = start_date
    while current <= end_date:
        date_str = current.strftime("%d-%m-%Y")
        get_data_selenium(date_str)
        current += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
