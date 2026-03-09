import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

driver = webdriver.Chrome(options=options)
file_name = "data_keluaran_china.txt"

try:
    for page in range(1, 32):
        url = f"https://superliga5.com/draw-history?m=1025&page={page}"
        print(f"Mengambil data halaman: {page}")
        driver.get(url)
        time.sleep(5) 
        
        # Mengambil semua baris dalam tbody
        rows = driver.find_elements(By.CSS_SELECTOR, "table.table-bordered tbody tr")
        
        data_nomor_saja = []
        for row in rows:
            # Mengambil semua kolom (td) dalam baris tersebut
            cols = row.find_elements(By.TAG_NAME, "td")
            
            # Jika tabel memiliki 3 kolom (Tanggal, Periode, Nomor), 
            # maka Nomor ada di indeks ke-2 (karena hitung dari 0)
            if len(cols) >= 3:
                nomor = cols[2].text.strip()
                data_nomor_saja.append(nomor)

        # Simpan ke file
        if data_nomor_saja:
            with open(file_name, "a") as f:
                for nomor in data_nomor_saja:
                    f.write(f"{nomor}\n")
            print(f"Berhasil menyimpan {len(data_nomor_saja)} nomor dari halaman {page}")
        
        time.sleep(3)

except Exception as e:
    print(f"Terjadi error: {e}")

finally:
    driver.quit()
    print("Selesai.")
