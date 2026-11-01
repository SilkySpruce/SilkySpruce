"use client";
import { useState } from 'react';
import { deleteUserAccount } from '@/app/actions/deleteAccount';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/lib/supabase';

export default function DeleteAccountFlow() {
  const { user, logoutUser } = useUserStore();
  const [stage, setStage] = useState(0);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setStage(0);
    setReason("");
    setConfirmText("");
  };

  const executeDeletion = async () => {
    if (!user) return;
    setIsDeleting(true);
    
    const result = await deleteUserAccount(user.id);
    if (result.success) {
      await supabase.auth.signOut();
      logoutUser();
      window.location.href = '/';
    } else {
      alert(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex justify-end">
      {/* Stage 0: The easily overlooked trigger */}
      <button 
        onClick={() => setStage(1)}
        className="text-xs text-[#4b5563] hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer"
      >
        Request account deletion
      </button>

      {/* The Gauntlet Modal */}
      {stage > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] p-8 max-w-md w-full text-center">
            
            {/* Stage 1: The Guilt Trip */}
            {stage === 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white">Are you absolutely sure?</h3>
                <p className="text-[#9ca3af] text-sm">
                  If you delete your account, you will instantly lose your <strong>{user?.loyaltyPoints || 0} Spruce Loyalty Points</strong>. This action cannot be undone.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <button onClick={handleClose} className="bg-[#788E7D] text-white p-3 font-semibold w-full hover:bg-[#687C6D]">
                    Keep My Account & Points
                  </button>
                  <button onClick={() => setStage(2)} className="bg-transparent text-[#6b7280] p-3 text-sm hover:text-white">
                    I understand, proceed to deletion
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2: The Mandatory Survey */}
            {stage === 2 && (
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-xl font-bold text-white text-center">We hate to see you go.</h3>
                <p className="text-[#9ca3af] text-sm text-center mb-2">Please tell us why you are leaving so we can improve.</p>
                
                <div className="flex flex-col gap-2">
                  {["Products are too expensive", "I found another brand", "I get too many emails", "Other"].map(r => (
                    <label key={r} className="flex items-center gap-3 text-sm text-[#d1d5db] cursor-pointer p-2 border border-[#2A2A2A] hover:border-[#788E7D]">
                      <input type="radio" name="reason" value={r} onChange={(e) => setReason(e.target.value)} className="accent-[#788E7D]" />
                      {r}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button onClick={handleClose} className="text-[#9ca3af] text-sm bg-transparent border-none cursor-pointer">Cancel</button>
                  <div className="flex gap-4 items-center">
                    <button 
                      onClick={() => setStage(3)} 
                      className="text-[#9ca3af] text-sm hover:text-white bg-transparent border-none cursor-pointer"
                    >
                      Skip
                    </button>
                    <button 
                      onClick={() => setStage(3)} 
                      disabled={!reason}
                      className="text-[#ef4444] text-sm disabled:opacity-30 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer font-semibold"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: The Final Friction */}
            {stage === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#ef4444]">Final Confirmation</h3>
                <p className="text-[#9ca3af] text-sm">
                  To permanently delete your account and all associated order history, please type <strong>DELETE</strong> below.
                </p>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="bg-transparent border border-[#2A2A2A] p-3 text-center text-white focus:border-[#ef4444] outline-none"
                />
                <div className="flex flex-col gap-2 mt-4">
                  <button 
                    onClick={executeDeletion}
                    disabled={confirmText !== "DELETE" || isDeleting}
                    className="bg-[#ef4444] text-white p-3 font-semibold w-full hover:bg-[#dc2626] disabled:opacity-30"
                  >
                    {isDeleting ? "DELETING..." : "PERMANENTLY DELETE ACCOUNT"}
                  </button>
                  <button onClick={handleClose} className="text-[#9ca3af] text-sm p-2 mt-2 bg-transparent border-none cursor-pointer">
                    Nevermind, take me back
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}