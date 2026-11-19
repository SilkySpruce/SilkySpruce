"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Copy, Gift, MessageCircle, Users } from "lucide-react";

interface ReferralCardProps {
  userId: string;
  userEmail: string;
}

export default function ReferralCard({ userId }: ReferralCardProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [successfulCount, setSuccessfulCount] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReferralData() {
      if (!userId) return;

      // 1. Fetch or generate user's referral_code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", userId)
        .single();

      let code = profile?.referral_code;

      if (!code) {
        code = `SILKY-${userId.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
        await supabase
          .from("profiles")
          .update({ referral_code: code })
          .eq("id", userId);
      }

      setReferralCode(code);

      // 2. Count successful referrals & total bonus points earned
      const { data: refs } = await supabase
        .from("referrals")
        .select("points_awarded")
        .eq("referrer_id", userId);

      if (refs) {
        setSuccessfulCount(refs.length);
        setPointsEarned(
          refs.reduce((sum, r) => sum + (r.points_awarded || 0), 0)
        );
      }

      setLoading(false);
    }

    loadReferralData();
  }, [userId]);

  const referralUrl =
    typeof window !== "undefined" && referralCode
      ? `${window.location.origin}/?ref=${referralCode}`
      : `https://silkyspruce.com/?ref=${referralCode}`;

  const handleCopy = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const msg = `I love Silky Spruce's natural plant-based skincare! Use my link to shop and earn 100 bonus loyalty points on your first order:\n\n${referralUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <div className="border border-[#2A2A2A] bg-[#141414] p-6 text-sm text-gray-400">
        Loading your referral link...
      </div>
    );
  }

  return (
    <div className="border border-[#D4AF37]/35 bg-[#141414] p-6 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-2">
          <Gift size={14} /> Refer &amp; Earn Loyalty Points
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Give 100 Points, Get 100 Points
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Share your personal link with friends. When they place their first
          order on Silky Spruce, you both earn{" "}
          <span className="text-[#D4AF37] font-semibold">
            100 bonus loyalty points
          </span>
          .
        </p>
      </div>

      {/* Link Copy Box */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          readOnly
          value={referralUrl}
          className="flex-1 bg-[#111111] border border-[#2A2A2A] px-4 py-3 text-sm text-gray-200 select-all outline-none"
        />

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={15} /> Copied!
            </>
          ) : (
            <>
              <Copy size={15} /> Copy Link
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <MessageCircle size={15} /> Share
        </button>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-[#D4AF37]" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Friends Referred
            </p>
            <p className="text-lg font-bold text-white">{successfulCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Gift size={18} className="text-[#D4AF37]" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Bonus Points Earned
            </p>
            <p className="text-lg font-bold text-[#D4AF37]">
              {pointsEarned.toLocaleString()} pts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}