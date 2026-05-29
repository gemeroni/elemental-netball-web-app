import React, { useEffect, useState } from "react";

/**
 * ReadAloud — a small tap-to-listen button.
 *
 * Uses the browser's built-in Web Speech API (window.speechSynthesis), so it
 * needs no library, no audio files and no network. This removes the "you must
 * be able to read" barrier for young / pre-reading / processing-difference
 * users: any text block can be spoken on demand.
 *
 * Behaviour: tap to speak, tap again to stop. Starting a new one cancels any
 * speech already playing, so rapid taps never queue up. If the browser has no
 * speech support, the button simply doesn't render (graceful degradation).
 */

const speechSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

interface ReadAloudProps {
  /** The text to be spoken. */
  text: string;
  /** Accessible label for the button. Defaults to "Read aloud". */
  label?: string;
  /** Extra classes (e.g. to override the default 32px size). */
  className?: string;
  /** Icon size in px. Defaults to 16. */
  size?: number;
}

export const ReadAloud: React.FC<ReadAloudProps> = ({
  text,
  label = "Read aloud",
  className = "h-8 w-8",
  size = 16,
}) => {
  const [speaking, setSpeaking] = useState(false);

  // If the button unmounts (switching position, tab or game step), stop talking.
  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, []);

  if (!speechSupported) return null;

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = () => {
    window.speechSynthesis.cancel(); // never let taps stack up
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // a touch slower, easier for young listeners
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speak())}
      aria-label={speaking ? "Stop reading" : label}
      aria-pressed={speaking}
      title={speaking ? "Stop reading" : label}
      data-testid="button-read-aloud"
      className={`inline-flex shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        speaking
          ? "bg-white text-black border-white"
          : "bg-transparent text-muted-foreground border-white/15 hover:text-white hover:border-white/40"
      } ${className}`}
    >
      {speaking ? (
        /* Stop (square) — also signals "currently reading" */
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        /* Speaker with sound waves */
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </button>
  );
};
