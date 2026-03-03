import requests
from bs4 import BeautifulSoup

def scrape_magnum():
    url = "https://www.magnum4d.my/en/results"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Ambil Tanggal (mencari div dengan class result-date)
            date_element = soup.find('div', class_='result-date')
            draw_date = date_element.text.strip() if date_element else "Tanggal Tidak Ditemukan"
            
            # Ambil Top 3 Prize
            p1 = soup.select_one('.p1-no').text.strip() if soup.select_one('.p1-no') else "----"
            p2 = soup.select_one('.p2-no').text.strip() if soup.select_one('.p2-no') else "----"
            p3 = soup.select_one('.p3-no').text.strip() if soup.select_one('.p3-no') else "----"
            
            # Ambil Special & Consolation (Mengumpulkan semua angka)
            special_list = [n.text.strip() for n in soup.select('.special-no')]
            consolation_list = [n.text.strip() for n in soup.select('.consolation-no')]
            
            special_str = ", ".join(special_list) if special_list else "----"
            consolation_str = ", ".join(consolation_list) if consolation_list else "----"
            
            # Format rapi untuk file .txt
            content = (
                f"Tanggal Result: {draw_date}\n"
                f"1st Prize: {p1}\n"
                f"2nd Prize: {p2}\n"
                f"3rd Prize: {p3}\n"
                f"Special: {special_str}\n"
                f"Consolation: {consolation_str}\n"
                f"{'-'*30}\n"
            )
            
            with open("data_keluaran_magnum.txt", "a") as f:
                f.write(content)
            print(f"Berhasil simpan data tanggal {draw_date}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scrape_magnum()
