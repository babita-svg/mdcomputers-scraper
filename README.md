# MDComputers Product Scraper 🛒

A fast, modular Python web scraper for [MDComputers.in](https://mdcomputers.in) search results. Extracts product names, selling prices, MRPs, discount percentages, stock availability, direct URLs, thumbnail images, and brands with pagination and export capabilities.

---

## ⚡ Quick Start

### 1. Installation
Clone the repository and install required dependencies:

```bash
git clone https://github.com/<your-username>/mdcomputers-scraper.git
cd mdcomputers-scraper
pip install -r requirements.txt
```

### 2. Basic Usage

Scrape external hard drives (default search query):
```bash
python mdcomputers_scraper.py --search "external harddrive"
```

Save results to a CSV file across 2 pages:
```bash
python mdcomputers_scraper.py -s "external harddrive" -p 2 -o harddrives.csv
```

Save results as JSON:
```bash
python mdcomputers_scraper.py -s "rtx 4070" -p 1 -o rtx_gpus.json --format json
```

---

## ⚙️ CLI Options & Arguments

| Flag | Long Flag | Default | Description |
|---|---|---|---|
| `-s` | `--search` | `"external harddrive"` | Query keywords to search on MDComputers |
| `-p` | `--pages` | `1` | Number of result pages to crawl |
| `-o` | `--output` | `mdcomputers_products.csv` | Output file destination (`.csv` or `.json`) |
| `-f` | `--format` | `csv` or `json` | Format specifier (auto-inferred from filename) |
| `-d` | `--delay` | `1.5` | Polite delay in seconds between page requests |

---

## 📊 Extracted Data Schema

Each scraped record contains:

```json
{
  "product_id": "18492",
  "title": "Western Digital Elements 2TB USB 3.0 Portable External Hard Drive (WDBU6Y0020BBK-WESN)",
  "brand": "Western Digital",
  "price_inr": 5890,
  "mrp_inr": 8900,
  "discount_percent": 33.8,
  "stock_status": "In Stock",
  "product_url": "https://mdcomputers.in/index.php?route=product/product&product_id=18492",
  "image_url": "https://mdcomputers.in/image/cache/catalog/hdd/western-digital/wdbu6y0020bbk-wesn-500x500.jpg",
  "description": "2TB Capacity, USB 3.0 & 2.0 Compatibility, Fast Data Transfers, High Capacity in a Compact Design"
}
```

---

## 🚀 How to Push to GitHub

You can publish this project to GitHub using standard Git commands:

```bash
# 1. Initialize git in this directory
git init

# 2. Add all files
git add .

# 3. Commit files
git commit -m "feat: initial commit of MDComputers Python scraper"

# 4. Set default branch to main
git branch -M main

# 5. Create a new GitHub repository and link it
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/mdcomputers-scraper.git

# 6. Push code to GitHub
git push -u origin main
```

*(Tip: In Google AI Studio, you can also click the top-right Settings/Export menu to directly export this repository to your connected GitHub account!)*
