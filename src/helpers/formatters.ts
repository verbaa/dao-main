export const formatTokenAmount = (amount: string | number) => {
  const num = Number(amount);

  if (isNaN(num)) return "0.00";

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);
};