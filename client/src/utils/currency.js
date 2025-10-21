export function formatINR(amount) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return '₹0.00';
  return numericAmount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}
