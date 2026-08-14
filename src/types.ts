export interface ScrapedProduct {
  product_id: string;
  title: string;
  brand: string;
  price_inr: number;
  mrp_inr: number;
  discount_percent: number;
  stock_status: 'In Stock' | 'Out of Stock' | 'Pre-order';
  product_url: string;
  image_url: string;
  description: string;
}

export interface ScraperConfig {
  searchTerm: string;
  pages: number;
  outputFormat: 'csv' | 'json';
  delay: number;
  timeout: number;
  userAgent: string;
}

export type ActiveTab = 'code' | 'preview' | 'github' | 'architecture';
