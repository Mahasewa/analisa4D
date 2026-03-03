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
    # Set layar sangat lebar & panjang agar semua kotak tertangkap
    chrome_options.add_argument("--window-size=1920,3000") 
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        url = f"https://4dno.org/past-results-history/{target_date}"
        print(f"--- MEMULAI SAPU JAGAT: {url} ---")
        driver.get(url)
        
        print("Menunggu 20 detik agar semua kotak muncul...")
        time.sleep(20) 
        
        # AMBIL SEMUA TEKS DI HALAMAN (Body)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        lines = body_text.split('\n')
        print(f"Total baris teks yang terbaca: {len(lines)}")

        current_market = ""
        all_data = {"MAGNUM": [], "KUDA": [], "TOTO": []}

        for line in lines:
            txt = line.strip().upper()
            
            # 1. Tentukan Sedang Di Pasaran Mana
            if "MAGNUM 4D" in txt:
                current_market = "MAGNUM"
                continue
            elif "DA MA CAI" in txt:
                current_market = "KUDA"
                continue
            elif "SPORTS TOTO" in txt:
                current_market = "TOTO"
                continue
            
            # 2. Ambil Angka 4 Digit (Jika sedang di dalam pasaran)
            if current_market:
                # Pisahkan kata jika dalam satu baris ada banyak angka (misal Special)
                parts = txt.split()
                for p in parts:
                    if p.isdigit() and len(p) == 4:
                        all_data[current_market].append(p)

        # 3. Simpan Hasilnya ke File Masing-masing
        for market, numbers in all_data.items():
            if numbers:
                filename = f"data_keluaran_{market.lower()}.txt"
                save_to_file(filename, target_date, numbers)
                print(f"BERHASIL: {market} ditarik ({len(numbers)} angka)")
            else:
                print(f"ZONK: Tidak ada angka ditemukan untuk {market}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.quit()

def save_to_file(filename, date, n):
    try:
        # Bersihkan duplikat tapi jaga urutan
        n_clean = []
        for x in n:
            if x not in n_clean: n_clean.append(x)
        
        content = f"Tanggal Result: {date}\n"
        content += f"1st Prize: {n_clean[0] if len(n_clean) > 0 else '-'}\n"
        content += f"2nd Prize: {n_clean[1] if len(n_clean) > 1 else '-'}\n"
        content += f"3rd Prize: {n_clean[2] if len(n_clean) > 2 else '-'}\n"
        
        # Mengambil 10 angka setelah prize utama sebagai Special
        special = n_clean[3:13]
        content += f"Special: {', '.join(special) if special else '-'}\n"
        
        # Mengambil 10 angka setelah Special sebagai Consolation
        consolation = n_clean[13:23]
        content += f"Consolation: {', '.join(consolation) if consolation else '-'}\n"
        
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)
        print(f"SUKSES: {filename} diperbarui dengan format Special & Consolation")
    except Exception as e:
        print(f"Gagal Menulis File: {e}")
