import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def get_data_selenium(target_date):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        url = f"https://4dno.org/past-result-history/{target_date}"
        print(f"Membuka halaman: {url}")
        driver.get(url)
        
        # Tunggu sampai elemen angka muncul (maksimal 15 detik)
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), '1st Prize')]"))
            )
        except:
            print(f"Melewati tanggal {target_date}: Data tidak ditemukan atau libur.")
            driver.quit()
            return

        # Ambil semua teks di halaman dan cari angka 4 digit
        all_elements = driver.find_elements(By.XPATH, "//*[self::td or self::div or self::span]")
        raw_values = [e.text.strip() for e in all_elements if e.text.strip().isdigit() and len(e.text.strip()) == 4]
        
        # Unikkan angka sambil menjaga urutan agar tidak berantakan
        numbers = []
        for val in raw_values:
            if val not in numbers:
                numbers.append(val)

        # Cari judul pasaran untuk menentukan file
        page_content = driver.page_source.upper()
        
        markets = {
            "MAGNUM": "MAGNUM 4D",
            "KUDA": "DA MA CAI",
            "TOTO": "SPORTS TOTO"
        }

        for key, title in markets.items():
            if title in page_content and len(numbers) >= 3:
                filename = f"data_keluaran_{key.lower()}.txt"
                save_to_file(filename, target_date, numbers)
                print(f">>> BERHASIL SIMPAN: {filename} - {target_date}")

        driver.quit()
    except Exception as e:
        print(f"Error: {e}")

def save_to_file(filename, date, n):
    # Mengambil 3 prize utama, sisanya dianggap special/consolation
    content = f"Tanggal Result: {date}\n"
    content += f"1st Prize: {n[0]}\n2nd Prize: {n[1]}\n3rd Prize: {n[2]}\n"
    if len(n) > 3:
        content += f"Angka Lainnya: {', '.join(n[3:23])}\n"
    content += "-"*30 + "\n"
    
    with open(filename, "a") as f:
        f.write(content)

def run_history_scraper():
    # Coba tarik data awal Maret 2026 yang sudah pasti ada result-nya (sesuai foto Koh)
    start_date = datetime(2026, 3, 1)
    end_date = datetime(2026, 3, 1) # Tes satu hari dulu
    
    curr = start_date
    while curr <= end_date:
        get_data_selenium(curr.strftime("%d-%m-%Y"))
        curr += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
