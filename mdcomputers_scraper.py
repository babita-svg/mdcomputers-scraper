"""
MDComputers Product Scraper
===========================
A robust Python script to scrape product details from MDComputers (https://mdcomputers.in)
based on search terms with pagination support, error handling, and CSV/JSON export.

Usage:
    python mdcomputers_scraper.py --search "external harddrive" --pages 2 --output results.csv
    python mdcomputers_scraper.py -s "graphics card" -p 1 -o gpus.json --format json
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
    print("Error: Required packages missing. Please run:")
    print("  pip install requests beautifulsoup4 pandas lxml")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("MDComputersScraper")


class MDComputersScraper:
    """Scraper class for mdcomputers.in search queries."""

    BASE_URL = "https://mdcomputers.in"
    SEARCH_ENDPOINT = "https://mdcomputers.in/index.php"

    def __init__(self, delay: float = 1.5, timeout: int = 15):
        """
        Initialize the scraper with polite crawl delay and user session headers.
        """
        self.delay = delay
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://mdcomputers.in/",
            "Connection": "keep-alive",
        })

    def build_search_url(self, search_term: str, page: int = 1) -> str:
        """Construct the search URL with query parameters."""
        encoded_term = quote_plus(search_term.strip())
        if page > 1:
            return f"{self.BASE_URL}/index.php?route=product/search&search={encoded_term}&page={page}"
        return f"{self.BASE_URL}/index.php?route=product/search&search={encoded_term}"

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch HTML content from URL and return parsed BeautifulSoup object."""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.exceptions.HTTPError as err:
            logger.error(f"HTTP Error for {url}: {err}")
        except requests.exceptions.RequestException as err:
            logger.error(f"Network/Connection error: {err}")
        return None

    def clean_price(self, price_str: Optional[str]) -> Optional[int]:
        """Extract clean integer price in INR from strings like '₹ 7,499' or 'Rs. 7499'."""
        if not price_str:
            return None
        digits_only = re.sub(r"[^\d]", "", price_str)
        return int(digits_only) if digits_only else None

    def parse_product_card(self, card) -> Optional[Dict]:
        """Extract all product fields from an individual HTML product item container."""
        try:
            # 1. Product Title and Link
            title_elem = card.select_one("h4 a") or card.select_one(".title a") or card.select_one(".name a")
            if not title_elem:
                return None
            
            title = title_elem.get_text(strip=True)
            relative_link = title_elem.get("href", "")
            product_url = urljoin(self.BASE_URL, relative_link)

            # 2. Product Image
            img_elem = card.select_one(".image img") or card.select_one("img.img-responsive") or card.select_one("img")
            image_url = ""
            if img_elem:
                image_url = img_elem.get("data-src") or img_elem.get("src") or ""
                if image_url and not image_url.startswith("http"):
                    image_url = urljoin(self.BASE_URL, image_url)

            # 3. Pricing (Special / Selling Price vs MRP / Old Price)
            price_container = card.select_one(".price")
            price_new_elem = card.select_one(".price-new") or card.select_one(".price .price-new")
            price_old_elem = card.select_one(".price-old") or card.select_one(".price .price-old")

            if price_new_elem:
                selling_price_raw = price_new_elem.get_text(strip=True)
                mrp_raw = price_old_elem.get_text(strip=True) if price_old_elem else selling_price_raw
            elif price_container:
                # If there's no separate discount tags, the price text inside .price is current price
                selling_price_raw = price_container.get_text(strip=True).split("\n")[0]
                mrp_raw = selling_price_raw
            else:
                selling_price_raw = ""
                mrp_raw = ""

            price_inr = self.clean_price(selling_price_raw)
            mrp_inr = self.clean_price(mrp_raw) or price_inr

            # Calculate discount percentage
            discount_percent = 0
            if mrp_inr and price_inr and mrp_inr > price_inr:
                discount_percent = round(((mrp_inr - price_inr) / mrp_inr) * 100, 1)

            # 4. Stock / Availability Status
            # Check for stock badges or 'Out of stock' indicators
            stock_elem = card.select_one(".stock") or card.select_one(".label-stock") or card.select_one(".availability")
            btn_cart = card.select_one("button[onclick*='cart.add']") or card.select_one(".addToCart")
            
            card_text = card.get_text(separator=" ", strip=True).lower()
            if stock_elem:
                stock_status = stock_elem.get_text(strip=True)
            elif "out of stock" in card_text:
                stock_status = "Out of Stock"
            elif btn_cart and "disabled" in btn_cart.attrs:
                stock_status = "Out of Stock"
            else:
                stock_status = "In Stock"

            # 5. Product Specs / Short Description
            desc_elem = card.select_one(".description") or card.select_one(".short-description")
            description = desc_elem.get_text(strip=True) if desc_elem else ""

            # 6. Extract Model / Brand if present
            brand_elem = card.select_one(".brand") or card.select_one(".manufacturer a")
            brand = brand_elem.get_text(strip=True) if brand_elem else "N/A"

            # 7. Extract Product ID from URL or attributes
            prod_id_match = re.search(r"product_id=(\d+)", product_url)
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
            logger.warning(f"Error parsing product item: {e}")
            return None

    def scrape(self, search_term: str, max_pages: int = 1) -> List[Dict]:
        """
        Scrape search results across multiple pages.

        :param search_term: Search query (e.g. 'external harddrive')
        :param max_pages: Maximum number of result pages to crawl
        :return: List of product dictionaries
        """
        all_products: List[Dict] = []
        seen_urls = set()

        logger.info(f"Starting scrape for query: '{search_term}' (Max pages: {max_pages})")

        for page in range(1, max_pages + 1):
            url = self.build_search_url(search_term, page=page)
            soup = self.fetch_page(url)

            if not soup:
                logger.warning(f"Skipping page {page} due to fetch error.")
                break

            # Find product cards across common OpenCart layout selectors
            cards = (
                soup.select(".product-layout")
                or soup.select(".product-item-container")
                or soup.select(".product-thumb")
                or soup.select(".product-grid-item")
            )

            if not cards:
                # Check if there is a 'no results' notice
                no_results = soup.select_one(".content-empty") or soup.find(
                    string=re.compile(r"There is no product that matches", re.I)
                )
                if no_results:
                    logger.info("No matching products found on MDComputers for this query.")
                else:
                    logger.info(f"No product cards detected on page {page}. Terminating crawl.")
                break

            logger.info(f"Found {len(cards)} product cards on page {page}.")

            page_count = 0
            for card in cards:
                product_data = self.parse_product_card(card)
                if product_data and product_data["product_url"] not in seen_urls:
                    seen_urls.add(product_data["product_url"])
                    all_products.append(product_data)
                    page_count += 1

            logger.info(f"Successfully extracted {page_count} items from page {page}.")

            # Check if there is a next page
            pagination_next = soup.select_one(".pagination li.active + li a") or soup.select_one("ul.pagination a[rel='next']")
            if not pagination_next and page < max_pages:
                logger.info("Reached the last page of search results.")
                break

            if page < max_pages:
                time.sleep(self.delay)

        logger.info(f"Scraping completed! Total unique products gathered: {len(all_products)}")
        return all_products

    def save_to_csv(self, products: List[Dict], filepath: str):
        """Save scraped results to CSV file."""
        if not products:
            logger.warning("No products to save.")
            return
        fieldnames = list(products[0].keys())
        with open(filepath, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(products)
        logger.info(f"Saved {len(products)} records to CSV: {filepath}")

    def save_to_json(self, products: List[Dict], filepath: str):
        """Save scraped results to JSON file."""
        with open(filepath, mode="w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(products)} records to JSON: {filepath}")


def main():
    parser = argparse.ArgumentParser(
        description="Scrape product listings from MDComputers.in based on a search term."
    )
    parser.add_argument(
        "-s", "--search",
        type=str,
        default="external harddrive",
        help="Search query to scrape (e.g. 'external harddrive', 'rtx 4060', 'ddr5 ram')",
    )
    parser.add_argument(
        "-p", "--pages",
        type=int,
        default=1,
        help="Number of pages to scrape (default: 1)",
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="mdcomputers_products.csv",
        help="Output filename (e.g. results.csv or results.json)",
    )
    parser.add_argument(
        "-f", "--format",
        choices=["csv", "json"],
        default=None,
        help="Output format. Inferred from output filename if omitted.",
    )
    parser.add_argument(
        "-d", "--delay",
        type=float,
        default=1.5,
        help="Polite request delay in seconds between pages (default: 1.5)",
    )

    args = parser.parse_args()

    # Determine format
    fmt = args.format
    if not fmt:
        fmt = "json" if args.output.lower().endswith(".json") else "csv"

    scraper = MDComputersScraper(delay=args.delay)
    products = scraper.scrape(args.search, max_pages=args.pages)

    if not products:
        print("\nNo products found. Please check your query or internet connection.")
        return

    # Print clean preview table
    print("\n" + "=" * 80)
    print(f" SCRAPE RESULTS PREVIEW ({len(products)} products found for '{args.search}')")
    print("=" * 80)
    for idx, p in enumerate(products[:5], 1):
        price_display = f"₹{p['price_inr']:,}" if p['price_inr'] else "N/A"
        mrp_display = f"₹{p['mrp_inr']:,}" if p['mrp_inr'] else ""
        disc = f"(-{p['discount_percent']}%)" if p['discount_percent'] > 0 else ""
        print(f"{idx}. {p['title'][:65]}")
        print(f"   Price: {price_display} {mrp_display} {disc} | Status: {p['stock_status']}")
        print(f"   URL:   {p['product_url']}")
        print("-" * 80)

    if len(products) > 5:
        print(f"... and {len(products) - 5} more items.\n")

    # Export
    if fmt == "json":
        scraper.save_to_json(products, args.output)
    else:
        scraper.save_to_csv(products, args.output)

    print(f"\n[DONE] Successfully exported results to '{args.output}'")


if __name__ == "__main__":
    main()
