"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateCampaignStatusAction } from "@/lib/campaigns/actions";
import type { CampaignStatus } from "@/lib/types/database";
import { Play, Pause, CheckCircle2, Loader2, AlertCircle, Archive } from "lucide-react";

interface CampaignStatusControlProps {
  campaignId: string;
  currentStatus: CampaignStatus;
}

export function CampaignStatusControl({ campaignId, currentStatus }: CampaignStatusControlProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransition = async (target: CampaignStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateCampaignStatusAction(campaignId, target);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Failed to update status.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {currentStatus === "draft" && (
          <Button
            size="sm"
            variant="primary"
            disabled={loading}
            onClick={() => handleTransition("active")}
            className="gap-1 text-xs"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            Publish Campaign
          </Button>
        )}

        {currentStatus === "active" && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => handleTransition("paused")}
              className="gap-1 text-xs"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
              Pause Campaign
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={loading}
              onClick={() => handleTransition("completed")}
              className="gap-1 text-xs text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3 w-3" />
              Mark Completed
            </Button>
          </>
        )}

        {currentStatus === "paused" && (
          <>
            <Button
              size="sm"
              variant="primary"
              disabled={loading}
              onClick={() => handleTransition("active")}
              className="gap-1 text-xs"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              Resume Campaign
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={loading}
              onClick={() => handleTransition("completed")}
              className="gap-1 text-xs"
            >
              <CheckCircle2 className="h-3 w-3" />
              Mark Completed
            </Button>
          </>
        )}

        {currentStatus === "completed" && (
          <Button
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={() => handleTransition("archived")}
            className="gap-1 text-xs text-muted"
          >
            <Archive className="h-3 w-3" />
            Archive
          </Button>
        )}
      </div>
    </div>
  );
}
