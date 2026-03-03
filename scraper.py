import requests

def scrape_magnum():
    # Jalur API resmi untuk mengambil hasil terbaru
    url = "https://www.magnum4d.my/api/draw-results?draw_date=" 
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            
            # Mengambil data dari struktur JSON API
            draw_date = data.get('draw_date', 'Tanggal Tidak Ada')
            p1 = data.get('first_prize', '----')
            p2 = data.get('second_prize', '----')
            p3 = data.get('third_prize', '----')
            
            # Mengambil Special dan Consolation
            special = data.get('special_prizes', [])
            consolation = data.get('consolation_prizes', [])
            
            content = (
                f"Tanggal Result: {draw_date}\n"
                f"1st Prize: {p1}\n"
                f"2nd Prize: {p2}\n"
                f"3rd Prize: {p3}\n"
                f"Special: {', '.join(special)}\n"
                f"Consolation: {', '.join(consolation)}\n"
                f"{'-'*30}\n"
            )
            
            with open("data_keluaran_magnum.txt", "a") as f:
                f.write(content)
            print(f"Berhasil! Data tanggal {draw_date} sudah masuk.")
        else:
            print(f"Gagal akses API. Kode Status: {response.status_code}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scrape_magnum()
