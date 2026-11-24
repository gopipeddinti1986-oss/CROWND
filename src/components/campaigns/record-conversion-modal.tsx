"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordOrderConversionAction } from "@/lib/conversions/actions";
import { Loader2, CheckCircle2, AlertCircle, X, Plus } from "lucide-react";

interface RecordConversionModalProps {
  campaignId: string;
  campaignTitle: string;
}

export function RecordConversionModal({ campaignId, campaignTitle }: RecordConversionModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(orderAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid order amount.");
      return;
    }

    if (!orderNumber.trim()) {
      setError("Order number is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await recordOrderConversionAction({
        campaignId,
        orderNumber: orderNumber.trim(),
        orderAmount: amount,
        referralCode: referralCode.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setOrderNumber("");
          setOrderAmount("");
          setReferralCode("");
          setNotes("");
          router.refresh();
        }, 1500);
      } else {
        setError(res.error || "Failed to record order.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        Log Order Conversion
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded border border-border bg-surface p-6 shadow-xl duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1 border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Log Order Conversion</h2>
              <p className="text-xs text-muted">
                Record a verified sale for &quot;{campaignTitle}&quot; to calculate creator
                commission.
              </p>
            </div>

            {success ? (
              <div className="space-y-2 py-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-serif text-base font-bold text-foreground">Order Recorded</h3>
                <p className="text-xs text-muted">
                  Commission calculated and logged in the rewards escrow ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {error && (
                  <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="orderNum"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Order Number / Receipt # *
                  </label>
                  <Input
                    id="orderNum"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. ORD-98421"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="orderAmt"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Order Total ($ USD) *
                  </label>
                  <Input
                    id="orderAmt"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="e.g. 89.50"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="refCode"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Creator Referral Code (Optional)
                  </label>
                  <Input
                    id="refCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="e.g. CW-maya-X821"
                    className="mt-1"
                  />
                  <span className="text-[11px] text-muted">
                    Leave blank if organic, or enter creator code for direct attribution.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Notes
                  </label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional details..."
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      "Record Conversion"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
