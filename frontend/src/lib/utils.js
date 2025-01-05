import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to combine Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to perform GET requests
export async function apiGet(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error;
  }
}

// Function to perform DELETE requests
export async function apiDelete(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during DELETE request:", error);
    throw error;
  }
}
