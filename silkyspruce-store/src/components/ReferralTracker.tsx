"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "silky_referral_code";
const EXPIRY_KEY = "silky_referral_expiry";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function getSavedReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  const code = localStorage.getItem(STORAGE_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!code || !expiry) return null;
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }
  return code;
}

export function clearSavedReferralCode() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim().length >= 4) {
      localStorage.setItem(STORAGE_KEY, ref.trim().toUpperCase());
      localStorage.setItem(EXPIRY_KEY, String(Date.now() + THIRTY_DAYS_MS));
    }
  }, [searchParams]);

  return null;
}