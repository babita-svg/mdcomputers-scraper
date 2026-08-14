# MDComputers Product Scraper

A simple Python web scraper that searches MDComputers for a product term and extracts product details from the search results.

## Assignment

Write a Python script to scrape product details from MDComputers for a search term.

Example search URL:
`https://mdcomputers.in/?route=product/search&search=external%20harddrive`

## What it extracts

- Product ID
- Product name/title
- Brand
- Selling price (INR)
- MRP
- Discount percentage
- Stock status
- Product URL
- Product image URL
- Short description

## Requirements

- Python 3.9+
- `requests`
- `beautifulsoup4`

Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the default example search:

```bash
python mdcomputers_scraper.py
```

Search for a specific product:

```bash
python mdcomputers_scraper.py --search "external harddrive"
```

Scrape multiple result pages and save JSON:

```bash
python mdcomputers_scraper.py --search "graphics card" --pages 2 --output results.json --format json
```

Save CSV output:

```bash
python mdcomputers_scraper.py --search "ddr5 ram" --output results.csv
```

## Options

| Option | Description | Default |
|---|---|---|
| `-s, --search` | Product search term | `external harddrive` |
| `-p, --pages` | Maximum pages to scrape | `1` |
| `-o, --output` | Output filename | `mdcomputers_products.csv` |
| `-f, --format` | `csv` or `json` | Inferred from filename |
| `-d, --delay` | Delay between pages in seconds | `1.5` |

## Project Structure

```text
mdcomputers-scraper/
├── mdcomputers_scraper.py
├── requirements.txt
├── README.md
└── .gitignore
```

The repository intentionally contains only the files needed to run and understand the Python scraping assignment; the previous frontend/demo files have been removed.

## Notes

The scraper uses a session with a browser-like User-Agent, handles request errors, supports pagination, avoids duplicate product URLs, and exports the collected data to CSV or JSON. Use a reasonable request delay and comply with the target website's terms and applicable rules.
