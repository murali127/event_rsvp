import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to combine Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to perform GET requests with optional authentication
export async function apiGet(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies in the request
    });

    console.log("Response Details:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch: ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during GET request:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export async function apiDelete(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies in the request
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
