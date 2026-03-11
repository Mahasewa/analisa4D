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

# --- LANGKAH 1: Ambil nomor terakhir yang pernah disimpan ---
nomor_terakhir_disimpan = ""
try:
    with open(file_name, "r") as f:
        baris = f.readlines()
        if baris:
            # Mengambil baris paling bawah/terakhir dari file
            nomor_terakhir_disimpan = baris[-1].strip()
except FileNotFoundError:
    print("File belum ada, akan membuat file baru.")

try:
    # --- LANGKAH 2: Cukup buka halaman pertama saja ---
    url = "https://superliga5.com/draw-history?m=1025&page=1"
    print("Mengecek nomor terbaru...")
    driver.get(url)
    time.sleep(5) 
    
    # Ambil baris pertama di dalam tabel (nomor paling atas)
    row_terbaru = driver.find_element(By.CSS_SELECTOR, "table.table-bordered tbody tr")
    cols = row_terbaru.find_elements(By.TAG_NAME, "td")
    
    if len(cols) >= 3:
        nomor_terbaru_web = cols[2].text.strip()
        print(f"Nomor terbaru di web: {nomor_terbaru_web}")
        print(f"Nomor terakhir di file: {nomor_terakhir_disimpan}")

        # --- LANGKAH 3: Bandingkan ---
        if nomor_terbaru_web != nomor_terakhir_disimpan:
            with open(file_name, "a") as f:
                f.write(f"{nomor_terbaru_web}\n")
            print(f"BERHASIL: Nomor baru {nomor_terbaru_web} telah ditambahkan.")
        else:
            print("INFO: Nomor sudah ada di file. Tidak ada data baru yang ditulis.")

except Exception as e:
    print(f"Terjadi error: {e}")

finally:
    driver.quit()
    print("Selesai.")
