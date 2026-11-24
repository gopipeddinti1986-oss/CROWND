"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ExternalLink, DollarSign, Briefcase, AlertCircle } from "lucide-react";
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/notifications/actions";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const res = await getNotificationsAction();
    if (res.success && res.data) {
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationReadAction(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "payout_received":
      case "conversion_attributed":
        return <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "application_accepted":
      case "application_received":
        return <Briefcase className="h-4 w-4 text-accent" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded p-1.5 text-muted transition-colors hover:bg-stone-100 hover:text-foreground dark:hover:bg-stone-800"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 z-50 mt-2 w-80 rounded border border-border bg-surface shadow-lg duration-150 sm:w-96">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-serif text-xs font-bold text-foreground">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-border/50 max-h-80 divide-y overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition-colors ${
                    n.is_read
                      ? "bg-surface opacity-75 hover:bg-stone-50 dark:hover:bg-stone-900"
                      : "bg-stone-100/60 font-medium dark:bg-stone-800/60"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold leading-none text-foreground">
                          {n.title}
                        </span>
                        <span className="text-[10px] font-normal text-muted">
                          {new Date(n.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted">{n.message}</p>
                      <div className="flex items-center justify-between pt-1">
                        {n.action_url ? (
                          <Link
                            href={n.action_url}
                            onClick={() => {
                              if (!n.is_read) handleMarkAsRead(n.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline"
                          >
                            View details
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        ) : (
                          <span />
                        )}

                        {!n.is_read && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(n.id)}
                            className="text-[10px] text-muted hover:text-foreground"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
