function exportToCSV(expenses, filename = "expenses.csv") {
  if (!expenses.length) return;

  const headers = ["Date", "Description", "Category", "Amount"];

  const rows = expenses.map((e) => [
    e.date.split("T")[0],
    `"${(e.description || "").replace(/"/g, '""')}"`,
    `"${(e.category_name || "Uncategorized").replace(/"/g, '""')}"`,
    parseFloat(e.amount).toFixed(2),
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default exportToCSV;