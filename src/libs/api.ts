import axios from "axios";
import type { Category, PaginatedProductResponse } from "./types";

const API_URL = import.meta.env.VITE_PRODUCTS_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
});

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProducts = async (page: number, perPage: number, groupBy?: string): Promise<PaginatedProductResponse> => {
  try {
    const response = await api.get<PaginatedProductResponse>("/products", {
      params: { perPage, page, groupBy },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
