import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def diagnosa_total():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        url = "https://4dno.org/past-results-history/01-03-2026"
        print(f"--- DIAGNOSA START: {url} ---")
        driver.get(url)
        time.sleep(20) 
        
        # Ambil SEMUA elemen teks di halaman tanpa kecuali
        print("Mencetak isi teks yang tertangkap di layar:")
        elements = driver.find_elements(By.TAG_NAME, "td")
        
        if not elements:
            # Jika td tidak ada, coba ambil semua div
            elements = driver.find_elements(By.TAG_NAME, "div")

        semua_teks = []
        for e in elements:
            t = e.text.strip()
            if t:
                semua_teks.append(t)
        
        print(f"Total elemen teks ditemukan: {len(semua_teks)}")
        print(f"Isi mentah: {semua_teks[:50]}") # Cetak 50 kata pertama

    except Exception as e:
        print(f"Error Diagnosa: {e}")
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    diagnosa_total()
