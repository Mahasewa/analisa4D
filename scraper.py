import time
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def get_data_sapu_jagat(target_date):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # Set layar lebar agar semua kotak (Magnum, Kuda, Toto) terbaca
    chrome_options.add_argument("--window-size=1920,3000") 
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # URL dengan huruf 's' pada results
        url = f"https://4dno.org/past-results-history/{target_date}"
        print(f"--- MEMULAI PROSES: {url} ---")
        driver.get(url)
        
        # Tunggu 20 detik agar semua angka muncul sempurna
        print("Menunggu loading 20 detik...")
        time.sleep(20) 
        
        # Ambil semua teks di halaman
        body_text = driver.find_element(By.TAG_NAME, "body").text
        lines = body_text.split('\n')
        
        current_market = ""
        all_data = {"MAGNUM": [], "KUDA": [], "TOTO": []}

        for line in lines:
            txt = line.strip().upper()
            
            # Identifikasi Pasaran
            if "MAGNUM 4D" in txt:
                current_market = "MAGNUM"
                continue
            elif "DA MA CAI" in txt:
                current_market = "KUDA"
                continue
            elif "SPORTS TOTO" in txt:
                current_market = "TOTO"
                continue
            
            # Ambil angka 4 digit
            if current_market:
                parts = txt.split()
                for p in parts:
                    if p.isdigit() and len(p) == 4:
                        all_data[current_market].append(p)

        # Simpan hasil ke file masing-masing
        for market, numbers in all_data.items():
            if numbers:
                save_to_file(f"data_keluaran_{market.lower()}.txt", target_date, numbers)
                print(f"BERHASIL: {market} ditarik ({len(numbers)} angka)")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.quit()

def save_to_file(filename, date, n):
    try:
        # Unikkan angka tanpa merusak urutan asli
        n_clean = []
        for x in n:
            if x not in n_clean: n_clean.append(x)
        
        # Format penulisan sesuai instruksi Koh
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n_clean[0] if len(n_clean) > 0 else '-'}\n"
        content += f"2nd Prize: {n_clean[1] if len(n_clean) > 1 else '-'}\n"
        content += f"3rd Prize: {n_clean[2] if len(n_clean) > 2 else '-'}\n"
        
        # Special (10 angka)
        special = n_clean[3:13]
        content += f"Special: {', '.join(special) if special else '-'}\n"
        
        # Consolation (10 angka)
        consolation = n_clean[13:23]
        content += f"Consolation: {', '.join(consolation) if consolation else '-'}\n"
        
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
    except Exception as e:
        print(f"Gagal Menulis File: {e}")

def run_history_scraper():
    # Menarik data tanggal 1, 2, dan 3 Maret 2026 sebagai tes
    start_date = datetime(2026, 3, 1)
    end_date = datetime(2026, 3, 3)
    
    curr = start_date
    while curr <= end_date:
        date_str = curr.strftime("%d-%m-%Y")
        get_data_sapu_jagat(date_str)
        curr += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
