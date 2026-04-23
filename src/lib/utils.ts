import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadJson(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(data: any, filename: string) {
  // Simple CSV conversion for line items
  if (!data.line_items || !Array.isArray(data.line_items)) return;

  const headers = ["Description", "Quantity", "Unit Price", "Amount"];
  const rows = data.line_items.map((item: any) => [
    item.description,
    item.quantity,
    item.unit_price,
    item.amount
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row: any) => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
