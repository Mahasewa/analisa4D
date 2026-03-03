import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime, timedelta

def get_data_by_date(target_date):
    url = f"https://4dno.org/past-result-history/{target_date}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return
            
        soup = BeautifulSoup(response.text, 'html.parser')
        # Mencari semua blok kartu hasil (Magnum, Toto, Kuda)
        results = soup.select('.card') 
        
        for res in results:
            title = res.get_text().upper()
            
            # Cari sel tabel yang berisi angka 4 digit
            cells = res.find_all('td')
            numbers = [c.get_text(strip=True) for c in cells if c.get_text(strip=True).isdigit() and len(c.get_text(strip=True)) == 4]
            
            if len(numbers) >= 3:
                # Tentukan nama file berdasarkan judul di kartu
                filename = ""
                if "MAGNUM 4D" in title:
                    filename = "data_keluaran_magnum.txt"
                elif "DA MA CAI 1+3D" in title:
                    filename = "data_keluaran_kuda.txt"
                elif "SPORTS TOTO 4D" in title:
                    filename = "data_keluaran_toto.txt"
                
                if filename:
                    save_to_file(filename, target_date, numbers)

    except Exception as e:
        print(f"Error pada tanggal {target_date}: {e}")

def save_to_file(filename, date, numbers):
    # Format data: 1st, 2nd, 3rd, Special (10 angka), Consolation (10 angka)
    content = f"Tanggal Result: {date}\n"
    content += f"1st Prize: {numbers[0]}\n"
    content += f"2nd Prize: {numbers[1]}\n"
    content += f"3rd Prize: {numbers[2]}\n"
    
    special = numbers[3:13]
    consolation = numbers[13:23]
    
    content += f"Special: {', '.join(special)}\n"
    content += f"Consolation: {', '.join(consolation)}\n"
    content += "-"*30 + "\n"
    
    with open(filename, "a") as f:
        f.write(content)
    print(f"Berhasil simpan {filename} - {date}")

def run_history_scraper():
    # TEST: Tarik data Februari 2026 saja
    start_date = datetime(2026, 2, 1)
    end_date = datetime(2026, 2, 28)
    
    current = start_date
    while current <= end_date:
        date_str = current.strftime("%d-%m-%Y")
        print(f"Mengecek: {date_str}")
        get_data_by_date(date_str)
        
        time.sleep(1) # Jeda agar aman
        current += timedelta(days=1)

if __name__ == "__main__":
    run_history_scraper()
