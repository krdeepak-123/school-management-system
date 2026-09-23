import { useState, useEffect, useCallback } from "react";

// Capture beforeinstallprompt as early as possible so early events aren't missed
let globalDeferredPrompt = null;
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    notifyListeners();
  });
}

function checkIsStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    (typeof document !== "undefined" &&
      document.referrer &&
      document.referrer.startsWith("android-app://"))
  );
}

function checkIsIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  const isIOSPlatform = /iphone|ipad|ipod/i.test(ua);
  const isIPadOS = ua.includes("Mac") && "ontouchend" in document;
  return isIOSPlatform || isIPadOS;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(checkIsStandalone);
  const [isIOS] = useState(checkIsIOS);

  useEffect(() => {
    const updateState = () => {
      setDeferredPrompt(globalDeferredPrompt);
      setIsInstalled(checkIsStandalone());
    };

    listeners.add(updateState);

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        globalDeferredPrompt = null;
        notifyListeners();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      listeners.delete(updateState);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Show installation if not already installed and either native prompt exists or iOS instructions can be shown
  const isInstallable = !isInstalled && (Boolean(deferredPrompt) || isIOS);

  const promptInstall = useCallback(async () => {
    if (isInstalled) {
      return { outcome: "already_installed" };
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        notifyListeners();

        if (choice && choice.outcome === "accepted") {
          return { outcome: "accepted" };
        }
        return { outcome: "dismissed" };
      } catch (err) {
        console.error("Install prompt error:", err);
        return { outcome: "error", error: err };
      }
    }

    if (isIOS) {
      return { outcome: "ios_instructions" };
    }

    return { outcome: "unavailable" };
  }, [deferredPrompt, isInstalled, isIOS]);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    promptInstall,
  };
}

export default usePWAInstall;
