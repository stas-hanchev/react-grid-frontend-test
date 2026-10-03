export interface Category {
  _id: string;
  id: number;
  parentId: number | null;
  name: string;
  level: number;
  path: string;
  sortOrder: number;
  slug: string;
  isActive: boolean;
  productCount: number;
  totalStock: number;
  avgPrice: number;
}

export interface Stock {
  quantity: number;
  reserved: number;
  reorderLevel: number;
  warehouse: string;
}

export interface Sales {
  unitsSold: number;
  revenue: number;
  lastMonthUnits: number;
}

export interface Supplier {
  name: string;
  country: string;
  contactEmail: string;
}

export interface Dimensions {
  widthCm: number;
  heightCm: number;
  depthCm: number;
  weightKg: number;
}

export interface Spec {
  key: string;
  value: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type ProductStatus =
  | 'active'
  | 'draft'
  | 'out_of_stock'
  | 'discontinued';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  categoryLeaf: string;
  categoryId: number;
  status: ProductStatus;
  owner: string;
  currency: string;
  price: number;
  cost: number;
  discountPercent: number;
  rating: number | null; // null, якщо товар ще не продавався
  reviewsCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isTaxable: boolean;
  tags: string[];
  description: string | null;
  stock: Stock;
  sales: Sales;
  supplier: Supplier;
  dimensions: Dimensions;
  specs: Spec[];
  reviews: Review[];
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  lastRestockedAt: string | null;
}

export interface GetProductsParams {
  page: number; // 1-based, як на бекенді
  perPage: number;
  categoryId?: number;
}

export interface PaginatedProductResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  products: Product[];
}
