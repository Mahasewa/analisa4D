import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from datetime import datetime, timedelta

def get_data_selenium(target_date):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    driver = webdriver.Chrome(options=options)
    url = f"https://4dno.org/past-result-history/{target_date}"
    
    try:
        driver.get(url)
        time.sleep(10) # Menunggu web loading angka
        
        # Mencari semua kartu (Magnum, Toto, Kuda)
        cards = driver.find_elements(By.CLASS_NAME, "card")
        
        for card in cards:
            text = card.text.upper()
            # Ambil semua teks dari cell tabel
            cells = card.find_elements(By.TAG_NAME, "td")
            numbers = [c.text.strip() for c in cells if len(c.text.strip()) == 4 and c.text.strip().isdigit()]
            
            if len(numbers) >= 3:
                filename = ""
                if "MAGNUM 4D" in text: filename = "data_keluaran_magnum.txt"
                elif "DA MA CAI" in text: filename = "data_keluaran_kuda.txt"
                elif "SPORTS TOTO" in text: filename = "data_keluaran_toto.txt"
                
                if filename:
                    p1, p2, p3 = numbers[0], numbers[1], numbers[2]
                    special = ", ".join(numbers[3:13])
                    consolation = ", ".join(numbers[13:23])
                    
                    hasil = (f"Tanggal Result: {target_date}\n"
                             f"1st Prize: {p1}\n2nd Prize: {p2}\n3rd Prize: {p3}\n"
                             f"Special: {special}\nConsolation: {consolation}\n"
                             f"{'-'*30}\n")
                    
                    with open(filename, "a") as f:
                        f.write(hasil)
                    print(f"Berhasil: {filename} {target_date}")
                    
    except Exception as e:
        print(f"Error {target_date}: {e}")
    finally:
        driver.quit()

def run_history():
    # Tes untuk tanggal 01-03-2026 (sesuai foto Koh yang ada datanya)
    test_date = "01-03-2026"
    get_data_selenium(test_date)

if __name__ == "__main__":
    run_history()
