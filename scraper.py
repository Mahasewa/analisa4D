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
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # URL dengan huruf 's' yang sudah fix
        url = f"https://4dno.org/past-results-history/{target_date}"
        driver.get(url)
        time.sleep(7) # Tunggu loading angka
        
        # Cari semua baris tabel
        rows = driver.find_elements(By.TAG_NAME, "tr")
        current_market = ""
        numbers = []

        for row in rows:
            text = row.text.upper()
            
            # Deteksi Pasaran
            if "MAGNUM 4D" in text:
                current_market = "MAGNUM"
                numbers = []
            elif "DA MA CAI" in text:
                current_market = "KUDA"
                numbers = []
            elif "SPORTS TOTO" in text:
                current_market = "TOTO"
                numbers = []

            # Ambil cell data
            cells = row.find_elements(By.TAG_NAME, "td")
            for cell in cells:
                val = cell.text.strip()
                if val.isdigit() and len(val) == 4:
                    numbers.append(val)

            # Jika angka terkumpul (23 angka), langsung simpan
            if len(numbers) >= 23 and current_market:
                filename = f"data_keluaran_{current_market.lower()}.txt"
                save_to_file(filename, target_date, numbers)
                print(f"Berhasil simpan {current_market} tanggal {target_date}")
                current_market = "" 
                numbers = []

        driver.quit()
    except Exception as e:
        print(f"Error pada {target_date}: {e}")

def save_to_file(filename, date, n):
    # Format penulisan sesuai permintaan Koh
    content = f"Tanggal Result: {date}\n"
    content += f"1st Prize: {n[0]}\n"
    content += f"2nd Prize: {n[1]}\n"
    content += f"3rd Prize: {n[2]}\n"
    content += f"Special: {', '.join(n[3:13])}\n"
    content += f"Consolation: {', '.join(n[13:23])}\n"
    content += "-"*30 + "\n"
    
    with open(filename, "a") as f:
        f.write(content)

def run_history_scraper():
    # Mari kita tes dari tanggal 1 - 3 Maret 2026 dulu
    start_date = datetime(2026, 3, 1)
    end_date = datetime(2026, 3, 3)
    
    curr = start_date
    while curr <= end_date:
        date_str = curr.strftime("%d-%m-%Y")
        print(f"Sedang menarik data: {date_str}")
        get_data_selenium(date_str)
        curr += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
