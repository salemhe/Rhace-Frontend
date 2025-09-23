import { useLocation } from "react-router";

export function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}