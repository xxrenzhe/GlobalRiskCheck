"use client";

import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

const isDevtoolsOpen = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const widthThreshold = 160;
  const heightThreshold = 160;
  return (
    window.outerWidth - window.innerWidth > widthThreshold ||
    window.outerHeight - window.innerHeight > heightThreshold
  );
};

export default function SecurityLayer({ children }: Props) {
  const [blocked, setBlocked] = useState(false);
  const enabled = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isDevShortcut =
        key === "f12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key));

      if (isDevShortcut) {
        event.preventDefault();
        setBlocked(true);
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }
          if (node.tagName === "SCRIPT") {
            const src = (node as HTMLScriptElement).src || "";
            const allowlisted =
              src.includes("/_next/") ||
              src.includes("vercel") ||
              src.includes("scan-core") ||
              src === "";
            if (!allowlisted) {
              setBlocked(true);
            }
          }
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    const interval = window.setInterval(() => {
      if (isDevtoolsOpen()) {
        setBlocked(true);
      }
    }, 1200);

    return () => {
      observer.disconnect();
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.clearInterval(interval);
    };
  }, [enabled]);

  if (blocked) {
    return <div className="fixed inset-0 z-[9999] bg-white" />;
  }

  return <>{children}</>;
}
