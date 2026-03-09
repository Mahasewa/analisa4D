import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Konfigurasi opsi browser
options = Options()
options.add_argument("--headless") # Jalankan tanpa membuka jendela browser
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

driver = webdriver.Chrome(options=options)

file_name = "data_keluaran_china.txt"

try:
    # Loop dari halaman 1 sampai 31
    for page in range(1, 32):
        url = f"https://superliga5.com/draw-history?m=1025&page={page}"
        print(f"Mengakses: {url}")
        driver.get(url)
        time.sleep(5) # Jeda waktu agar tabel termuat sempurna (Cloudflare friendly)
        
        # Mencari elemen tabel
        # Berdasarkan analisis kita sebelumnya, tabel menggunakan class "table-bordered"
        rows = driver.find_elements(By.CSS_SELECTOR, "table.table-bordered tbody tr")
        
        data_halaman = []
        for row in rows:
            data_halaman.append(row.text.strip())

        # Menyimpan data ke file
        if data_halaman:
            with open(file_name, "a") as f:
                for line in data_halaman:
                    f.write(f"{line}\n")
            print(f"Berhasil menyimpan {len(data_halaman)} baris dari halaman {page}")
        
        # Jeda antar halaman agar tidak terdeteksi bot/DDoS
        time.sleep(3)

except Exception as e:
    print(f"Terjadi error: {e}")

finally:
    driver.quit()
    print("Selesai. Data telah disimpan di", file_name)
