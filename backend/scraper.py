import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/120.0.0.0 Safari/537.36"
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()  # this raises 403 if forbidden

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract title
        title_tag = soup.find("h1", {"id": "firstHeading"})
        title = title_tag.text.strip() if title_tag else "Untitled Article"

        # Extract main content paragraphs
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            raise Exception("Couldn't find content section on Wikipedia page")

        paragraphs = content_div.find_all("p")
        text = " ".join(p.get_text() for p in paragraphs)
        clean_text = " ".join(text.split())

        return {"title": title, "content": clean_text}

    except Exception as e:
        print(f"Error scraping Wikipedia: {e}")
        return None
