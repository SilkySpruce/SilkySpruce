"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Theme – matched to the Silky Spruce storefront (near-black + sage green). */
/*  Tweak these values if any shade looks slightly off.                       */
/* -------------------------------------------------------------------------- */
const THEME = {
  overlay: "rgba(0, 0, 0, 0.65)",
  surface: "#111111", // same as the page / navbar background
  border: "#2a2a2a", // thin divider lines like the navbar border
  title: "#ffffff",
  text: "#9ca3af", // muted grey used for descriptions
  accent: "#7d8c7a", // sage green (ADD TO CART button / price)
  accentHover: "#8c9b89",
  accentText: "#111111",
};

type AlertOptions = {
  title?: string;
  buttonLabel?: string;
};

type AlertState = {
  message: string;
  title: string;
  buttonLabel: string;
  resolve: () => void;
};

type AlertContextValue = {
  /** Shows the themed alert. The promise resolves when the user dismisses it. */
  showAlert: (message: string, options?: AlertOptions) => Promise<void>;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used inside <AlertProvider>");
  }
  return ctx;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const showAlert = useCallback(
    (message: string, options: AlertOptions = {}) =>
      new Promise<void>((resolve) => {
        setAlertState({
          message,
          title: options.title ?? "Notice",
          buttonLabel: options.buttonLabel ?? "OK",
          resolve,
        });
      }),
    []
  );

  const close = useCallback(() => {
    setHovered(false);
    setAlertState((current) => {
      current?.resolve();
      return null;
    });
  }, []);

  // Focus the button, close on Escape/Enter, and lock page scroll while open.
  useEffect(() => {
    if (!alertState) return;

    buttonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [alertState, close]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {alertState && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "12vh",
            background: THEME.overlay,
            fontFamily: "inherit", // picks up your Inter font from <body>
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="site-alert-title"
            aria-describedby="site-alert-message"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(460px, calc(100vw - 32px))",
              background: THEME.surface,
              border: `1px solid ${THEME.border}`,
              borderRadius: 0, // square corners like the site's buttons
              padding: "28px 32px 28px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <h2
              id="site-alert-title"
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: THEME.title,
              }}
            >
              {alertState.title}
            </h2>

            <p
              id="site-alert-message"
              style={{
                margin: "12px 0 0",
                fontSize: 16,
                lineHeight: 1.6,
                color: THEME.text,
                wordBreak: "break-word",
              }}
            >
              {alertState.message}
            </p>

            <button
              ref={buttonRef}
              type="button"
              onClick={close}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                cursor: "pointer",
                display: "block",
                width: "100%",
                marginTop: 28,
                padding: "14px 24px",
                border: "none",
                borderRadius: 0,
                background: hovered ? THEME.accentHover : THEME.accent,
                color: THEME.accentText,
                fontFamily: "inherit",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                outline: `2px solid ${THEME.title}`,
                outlineOffset: 3,
                transition: "background 0.15s ease",
              }}
            >
              {alertState.buttonLabel}
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}