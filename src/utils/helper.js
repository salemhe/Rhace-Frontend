export function capitalize(word) {
  if (!word) return ""; // handle empty strings safely
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const formatNaira = (value) => {
  const nairaSymbol = "\u20A6";

  if (value === null || value === undefined || value === "") {
    return `${nairaSymbol}0.00`;
  }

  const cleaned = String(value).replace(/[,\sNG]/gi, "");
  const num = Math.abs(Number(cleaned));

  if (Number.isNaN(num)) {
    return `${nairaSymbol}0.00`;
  }

  return (
    nairaSymbol +
    num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};
