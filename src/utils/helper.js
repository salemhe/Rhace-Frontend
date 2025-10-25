export function capitalize(word) {
  if (!word) return ''; // handle empty strings safely
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
