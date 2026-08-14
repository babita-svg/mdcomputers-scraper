import { ScraperConfig } from '../types';

export function generatePythonScript(config: ScraperConfig): string {
  return `"""
MDComputers Product Scraper
===========================
Generated Python script to scrape product details from MDComputers (https://mdcomputers.in)
Search query: "${config.searchTerm}"
"""

import argparse
import csv
import json
import logging
import re
import sys
import time
from typing import Dict, List, Optional
from urllib.parse import quote_plus, urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: Missing dependencies. Please execute: pip install -r requirements.txt")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("MDComputersScraper")


class MDComputersScraper:
    """Scraper class for MDComputers e-commerce search results."""

    BASE_URL = "https://mdcomputers.in"

    def __init__(self, delay: float = ${config.delay}, timeout: int = ${config.timeout}):
        self.delay = delay
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "${config.userAgent}",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://mdcomputers.in/",
            "Connection": "keep-alive",
        })

    def build_search_url(self, search_term: str, page: int = 1) -> str:
        """Construct the search endpoint URL."""
        encoded_term = quote_plus(search_term.strip())
        if page > 1:
            return f"{self.BASE_URL}/index.php?route=product/search&search={encoded_term}&page={page}"
        return f"{self.BASE_URL}/index.php?route=product/search&search={encoded_term}"

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch HTML and parse using BeautifulSoup."""
        try:
            logger.info(f"Fetching URL: {url}")
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.exceptions.HTTPError as err:
            logger.error(f"HTTP error occurred: {err}")
        except requests.exceptions.RequestException as err:
            logger.error(f"Request failed: {err}")
        return None

    def clean_price(self, price_str: Optional[str]) -> Optional[int]:
        """Extract clean integer INR price from string representations."""
        if not price_str:
            return None
        digits_only = re.sub(r"[^\\d]", "", price_str)
        return int(digits_only) if digits_only else None

    def parse_product_card(self, card) -> Optional[Dict]:
        """Extract attributes from single product card."""
        try:
            # Title & Link
            title_elem = card.select_one("h4 a") or card.select_one(".title a") or card.select_one(".name a")
            if not title_elem:
                return None
            
            title = title_elem.get_text(strip=True)
            relative_link = title_elem.get("href", "")
            product_url = urljoin(self.BASE_URL, relative_link)

            # Image
            img_elem = card.select_one(".image img") or card.select_one("img.img-responsive") or card.select_one("img")
            image_url = ""
            if img_elem:
                image_url = img_elem.get("data-src") or img_elem.get("src") or ""
                if image_url and not image_url.startswith("http"):
                    image_url = urljoin(self.BASE_URL, image_url)

            # Price extraction (Selling Price vs MRP)
            price_container = card.select_one(".price")
            price_new_elem = card.select_one(".price-new")
            price_old_elem = card.select_one(".price-old")

            if price_new_elem:
                selling_price_raw = price_new_elem.get_text(strip=True)
                mrp_raw = price_old_elem.get_text(strip=True) if price_old_elem else selling_price_raw
            elif price_container:
                selling_price_raw = price_container.get_text(strip=True).split("\\n")[0]
                mrp_raw = selling_price_raw
            else:
                selling_price_raw = ""
                mrp_raw = ""

            price_inr = self.clean_price(selling_price_raw)
            mrp_inr = self.clean_price(mrp_raw) or price_inr

            # Calculate Discount %
            discount_percent = 0
            if mrp_inr and price_inr and mrp_inr > price_inr:
                discount_percent = round(((mrp_inr - price_inr) / mrp_inr) * 100, 1)

            # Stock Status
            stock_elem = card.select_one(".stock") or card.select_one(".label-stock")
            btn_cart = card.select_one("button[onclick*='cart.add']")
            card_text = card.get_text(separator=" ", strip=True).lower()

            if stock_elem:
                stock_status = stock_elem.get_text(strip=True)
            elif "out of stock" in card_text:
                stock_status = "Out of Stock"
            elif btn_cart and "disabled" in btn_cart.attrs:
                stock_status = "Out of Stock"
            else:
                stock_status = "In Stock"

            # Brand & Description
            brand_elem = card.select_one(".brand") or card.select_one(".manufacturer a")
            brand = brand_elem.get_text(strip=True) if brand_elem else "N/A"

            desc_elem = card.select_one(".description") or card.select_one(".short-description")
            description = desc_elem.get_text(strip=True) if desc_elem else ""

            # Product ID
            prod_id_match = re.search(r"product_id=(\\d+)", product_url)
            product_id = prod_id_match.group(1) if prod_id_match else None

            return {
                "product_id": product_id,
                "title": title,
                "brand": brand,
                "price_inr": price_inr,
                "mrp_inr": mrp_inr,
                "discount_percent": discount_percent,
                "stock_status": stock_status,
                "product_url": product_url,
                "image_url": image_url,
                "description": description,
            }
        except Exception as e:
            logger.warning(f"Error parsing item: {e}")
            return None

    def scrape(self, search_term: str, max_pages: int = ${config.pages}) -> List[Dict]:
        all_products: List[Dict] = []
        seen_urls = set()

        logger.info(f"Initiating scrape for: '{search_term}' (Pages: {max_pages})")

        for page in range(1, max_pages + 1):
            url = self.build_search_url(search_term, page=page)
            soup = self.fetch_page(url)

            if not soup:
                logger.warning(f"Failed to fetch page {page}.")
                break

            cards = (
                soup.select(".product-layout")
                or soup.select(".product-item-container")
                or soup.select(".product-thumb")
            )

            if not cards:
                logger.info(f"No products found on page {page}. Ending crawl.")
                break

            logger.info(f"Detected {len(cards)} items on page {page}.")
            page_extracted = 0

            for card in cards:
                item = self.parse_product_card(card)
                if item and item["product_url"] not in seen_urls:
                    seen_urls.add(item["product_url"])
                    all_products.append(item)
                    page_extracted += 1

            logger.info(f"Extracted {page_extracted} unique products from page {page}.")

            if page < max_pages:
                time.sleep(self.delay)

        return all_products

    def export(self, products: List[Dict], filepath: str, fmt: str = "${config.outputFormat}"):
        if not products:
            logger.warning("No products to export.")
            return

        if fmt == "json":
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(products, f, indent=2, ensure_ascii=False)
        else:
            with open(filepath, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=list(products[0].keys()))
                writer.writeheader()
                writer.writerows(products)

        logger.info(f"Saved {len(products)} products to {filepath}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape MDComputers products.")
    parser.add_argument("-s", "--search", default="${config.searchTerm}", help="Search term")
    parser.add_argument("-p", "--pages", type=int, default=${config.pages}, help="Number of pages")
    parser.add_argument("-o", "--output", default="mdcomputers_${config.searchTerm.toLowerCase().replace(/\\s+/g, '_')}.${config.outputFormat}", help="Output file")
    parser.add_argument("-f", "--format", choices=["csv", "json"], default="${config.outputFormat}", help="File format")
    args = parser.parse_args()

    scraper = MDComputersScraper(delay=${config.delay})
    results = scraper.scrape(args.search, max_pages=args.pages)
    scraper.export(results, args.output, fmt=args.format)
    print(f"\\nDone! Scraped {len(results)} items into '{args.output}'.")
`;
}
