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
            
            # Mengambil Tanggal Result dari Web
            # Struktur ini disesuaikan dengan tampilan Magnum terbaru
            draw_date = soup.find('div', class_='result-date').text.strip() if soup.find('div', class_='result-date') else "Tanggal Tidak Ditemukan"
            
            # Mengambil 1st, 2nd, 3rd Prize
            p1 = soup.select_one('.p1-no').text.strip() if soup.select_one('.p1-no') else "----"
            p2 = soup.select_one('.p2-no').text.strip() if soup.select_one('.p2-no') else "----"
            p3 = soup.select_one('.p3-no').text.strip() if soup.select_one('.p3-no') else "----"
            
            # Mengambil Special & Consolation (Mengumpulkan semua angka di dalam list)
            special_numbers = [div.text.strip() for div in soup.select('.special-no')]
            consolation_numbers = [div.text.strip() for div in soup.select('.consolation-no')]
            
            # Format teks yang akan disimpan
            content = f"Tanggal Result: {draw_date}\n"
            content += f"1st Prize: {p1}\n"
            content += f"2nd Prize: {p2}\n"
            content += f"3rd Prize: {p3}\n"
            content += f"Special: {', '.join(special_numbers)}\n"
            content += f"Consolation: {', '.join(consolation_numbers)}\n"
            content += "-"*30 + "\n"
            
            # Simpan ke file
            with open("data_keluaran_magnum.txt", "a") as f:
                f.write(content)
            print(f"Berhasil update data tanggal: {draw_date}")
            
    except Exception as e:
        print(f"Terjadi kesalahan saat ambil data: {e}")

if __name__ == "__main__":
    scrape_magnum()
