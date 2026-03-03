import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime, timedelta

def get_data_by_date(target_date):
    # Format URL: https://4dno.org/past-result-history/DD-MM-YYYY
    url = f"https://4dno.org/past-result-history/{target_date}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return
            
        soup = BeautifulSoup(response.text, 'html.parser')
        # Mencari semua blok hasil (biasanya dalam class card atau col)
        results = soup.select('.card-body') 
        
        for res in results:
            title = res.text
            
            # 1. LOGIKA UNTUK MAGNUM
            if "MAGNUM 4D" in title:
                save_to_file("data_keluaran_magnum.txt", target_date, res)
            
            # 2. LOGIKA UNTUK DA MA CAI (KUDA)
            elif "DA MA CAI 1+3D" in title:
                save_to_file("data_keluaran_kuda.txt", target_date, res)
                
            # 3. LOGIKA UNTUK SPORTS TOTO
            elif "SPORTS TOTO 4D" in title:
                save_to_file("data_keluaran_toto.txt", target_date, res)

    except Exception as e:
        print(f"Error pada tanggal {target_date}: {e}")

def save_to_file(filename, date, soup_element):
    # Mengambil angka berdasarkan posisi atau class di web 4dno
    # Kode ini akan kita pertajam setelah tes jalan pertama
    numbers = [n.text.strip() for n in soup_element.select('.number-display')] 
    
    content = f"Tanggal Result: {date}\n"
    # Misal urutan: 1st, 2nd, 3rd, lalu sisanya special & consolation
    if len(numbers) >= 3:
        content += f"1st Prize: {numbers[0]}\n"
        content += f"2nd Prize: {numbers[1]}\n"
        content += f"3rd Prize: {numbers[2]}\n"
        content += f"Special: {', '.join(numbers[3:13])}\n"
        content += f"Consolation: {', '.join(numbers[13:])}\n"
        content += "-"*30 + "\n"
        
        with open(filename, "a") as f:
            f.write(content)

# FUNGSI UTAMA: Menarik data dari Jan 2025 sampai sekarang
def run_history_scraper():
    start_date = datetime(2025, 1, 1)
    end_date = datetime.now()
    
    current = start_date
    while current <= end_date:
        date_str = current.strftime("%d-%m-%Y")
        print(f"Sedang menarik data: {date_str}")
        get_data_by_date(date_str)
        
        # Jeda 1 detik agar tidak dianggap serangan (anti-ban)
        time.sleep(1)
        current += timedelta(days=1)

if __name__ == "__main__":
    # Jalankan penarik sejarah
    run_history_scraper()
