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
        
        url = f"https://4dno.org/past-results-history/{target_date}"
        print(f"--- Mencoba Akses URL: {url} ---")
        driver.get(url)
        
        print("Menunggu halaman stabil (10 detik)...")
        time.sleep(10) 
        
        rows = driver.find_elements(By.TAG_NAME, "tr")
        print(f"Jumlah baris tabel ditemukan: {len(rows)}")
        
        current_market = ""
        numbers = []

        for row in rows:
            text = row.text.upper()
            
            if "MAGNUM 4D" in text:
                current_market = "MAGNUM"
                numbers = []
            elif "DA MA CAI" in text:
                current_market = "KUDA"
                numbers = []
            elif "SPORTS TOTO" in text:
                current_market = "TOTO"
                numbers = []

            cells = row.find_elements(By.TAG_NAME, "td")
            for cell in cells:
                val = cell.text.strip()
                if val.isdigit() and len(val) == 4:
                    numbers.append(val)

            # CEK: Jika angka sudah terkumpul, kita paksa tulis
            if len(numbers) >= 3 and current_market:
                print(f"Mencoba menyimpan data {current_market}. Total angka didapat: {len(numbers)}")
                filename = f"data_keluaran_{current_market.lower()}.txt"
                save_to_file(filename, target_date, numbers)
                current_market = "" 
                numbers = []

    except Exception as e:
        print(f"Terjadi Kesalahan: {e}")
    finally:
        if driver:
            driver.quit()

def save_to_file(filename, date, n):
    try:
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n[0] if len(n) > 0 else '-'}\n"
        content += f"2nd Prize: {n[1] if len(n) > 1 else '-'}\n"
        content += f"3rd Prize: {n[2] if len(n) > 2 else '-'}\n"
        if len(n) > 3:
            content += f"Angka Lainnya: {', '.join(n[3:23])}\n"
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
        print(f"FILE BERHASIL DITULIS: {filename}")
    except Exception as e:
        print(f"Gagal Menulis ke File: {e}")

def run_history_scraper():
    # Tes satu hari saja: 1 Maret 2026
    test_date = "01-03-2026"
    print(f"MEMULAI PROSES SCRAPING TANGGAL: {test_date}")
    get_data_selenium(test_date)

if __name__ == "__main__":
    run_history_scraper()
