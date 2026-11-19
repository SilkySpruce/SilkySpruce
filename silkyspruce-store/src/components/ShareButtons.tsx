"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  path: string; // e.g. `/shop/${product.slug}` or `/blog/${post.slug}`
  shareText?: string;
  label?: string;
}

export default function ShareButtons({
  title,
  path,
  shareText,
  label = "Share",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    const baseUrl =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://silkyspruce.com";
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const handleWhatsAppShare = () => {
    const url = getFullUrl();
    const message = shareText
      ? `${shareText}\n\n${url}`
      : `Check out ${title} from Silky Spruce:\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const url = getFullUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeOrXShare = async () => {
    const url = getFullUrl();
    const text = shareText || `${title} — Silky Spruce`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch {
        // User cancelled share sheet
        return;
      }
    }

    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-5 mt-5 border-t border-[#2A2A2A]">
      <span className="text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-semibold mr-1">
        {label}:
      </span>

      {/* WhatsApp Share */}
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-[#111111] transition-colors cursor-pointer"
      >
        <MessageCircle size={15} strokeWidth={2} />
        WhatsApp
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
          copied
            ? "border-[#D4AF37] bg-[#D4AF37] text-[#111111]"
            : "border-[#2A2A2A] text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
        }`}
      >
        {copied ? (
          <>
            <Check size={15} strokeWidth={2} />
            Copied!
          </>
        ) : (
          <>
            <Link2 size={15} strokeWidth={2} />
            Copy Link
          </>
        )}
      </button>

      {/* Native Share Sheet (Mobile) / X (Desktop) */}
      <button
        type="button"
        onClick={handleNativeOrXShare}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border border-[#2A2A2A] text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer"
        aria-label="More share options"
      >
        <Share2 size={15} strokeWidth={2} />
        More
      </button>
    </div>
  );
}