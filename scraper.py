import time
import os
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
    chrome_options.add_argument("--window-size=1920,3000") 
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        url = f"https://4dno.org/past-results-history/{target_date}"
        driver.get(url)
        
        # Jeda 10 detik agar hemat waktu namun tetap stabil
        time.sleep(10) 
        
        body_text = driver.find_element(By.TAG_NAME, "body").text
        lines = body_text.split('\n')
        
        current_market = ""
        all_data = {"MAGNUM": [], "KUDA": [], "TOTO": []}

        for line in lines:
            txt = line.strip().upper()
            if "MAGNUM 4D" in txt: current_market = "MAGNUM"
            elif "DA MA CAI" in txt: current_market = "KUDA"
            elif "SPORTS TOTO" in txt: current_market = "TOTO"
            
            if current_market:
                parts = txt.split()
                for p in parts:
                    if p.isdigit() and len(p) == 4:
                        all_data[current_market].append(p)

        # Hanya simpan jika data lengkap (minimal 3 angka utama)
        for market, numbers in all_data.items():
            if len(numbers) >= 3:
                save_to_file(f"data_keluaran_{market.lower()}.txt", target_date, numbers)
                print(f"SUKSES: {market} - {target_date}")
            else:
                print(f"LEWATI: {market} - {target_date} (Data tidak tersedia)")

    except Exception as e:
        print(f"Error pada {target_date}: {e}")
    finally:
        if driver: driver.quit()

def save_to_file(filename, date, n):
    try:
        # Cek apakah data tanggal ini sudah pernah disimpan
        if os.path.exists(filename):
            with open(filename, "r") as f:
                if f"Tanggal Result: {date}" in f.read():
                    return

        n_clean = []
        for x in n:
            if x not in n_clean: n_clean.append(x)
        
        # Susun format tulisan Special & Consolation
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n_clean[0]}\n2nd Prize: {n_clean[1]}\n3rd Prize: {n_clean[2]}\n"
        content += f"Special: {', '.join(n_clean[3:13])}\n"
        content += f"Consolation: {', '.join(n_clean[13:23])}\n"
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
    except Exception as e:
        print(f"Gagal simpan ke {filename}: {e}")

def run_history_scraper():
    # Setting Januari 2026 sesuai instruksi Koh
    start_date = datetime(2026, 1, 1)
    end_date = datetime.now()
    
    curr = start_date
    print(f"--- MULAI MARATON (Cek Hari Server) ---", flush=True)
    
    while curr <= end_date:
        # Ambil nama hari langsung dari server (Sunday, Monday, dsb)
        nama_hari_server = curr.strftime('%A')
        
        # Filter: 2=Wednesday, 5=Saturday, 6=Sunday
        if curr.weekday() in [2, 5, 6]:
            # KUNCI: Ubah tanggal jadi teks (YYYY-MM-DD) tanpa jam 00:00:00
            tgl_bersih = curr.strftime('%Y-%m-%d')
            
            print(f"\n>>> PROSES: {nama_hari_server}, {tgl_bersih} <<<", flush=True)
            
            # Panggil fungsi sapu jagat pakai tgl_bersih
            get_data_sapu_jagat(tgl_bersih)
            
            time.sleep(12) 
        else:
            # Tetap tampilkan hari server meskipun skip
            print(f"SKIP: {nama_hari_server}, {curr.strftime('%d-%m-%Y')} (Bukan result)", flush=True)
            
        curr += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
