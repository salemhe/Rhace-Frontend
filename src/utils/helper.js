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

// Helper function to format offer text
export const formatOfferText = (offer) => {
  if (!offer) return "";

  // Check if the string contains any digits
  const hasNumber = /\d/.test(offer);

  // If it contains numbers but doesn't already end with "% off" or similar, append "% off"
  if (hasNumber) {
    // Check if it already ends with percentage or off indicator
    const hasPercentIndicator = /%\s*off$|%\s*off\s*$/i.test(offer);
    const hasPercentSymbol = /%$/.test(offer);

    if (!hasPercentIndicator) {
      if (hasPercentSymbol) {
        // If it ends with %, add " off"
        return `${offer.trim()} off`;
      } else {
        // Otherwise add "% off"
        return `${offer.trim()}% off`;
      }
    }
  }

  // If no numbers found or already formatted, return as is
  return offer;
};
