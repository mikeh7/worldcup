import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  visible: boolean;
  onSubmit: (name: string) => void;
}

// Only letters, capped at 12 characters.
function clean(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").slice(0, 12);
}

export default function NameEntry({ visible, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset + focus whenever the panel reappears for the next player.
  useEffect(() => {
    if (visible) {
      setValue("");
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [visible]);

  function submit() {
    const name = clean(value);
    if (name.length === 0) return;
    onSubmit(name);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="name-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="name-panel"
            initial={{ y: 24, scale: 0.5 }}
            animate={{ y: 0, scale: 0.6 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <input
              id="player-name"
              ref={inputRef}
              className="name-input"
              aria-label="Player name"
              value={value}
              maxLength={12}
              type="text"
              name="dt-player-field"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              placeholder="FIRST NAME"
              onChange={(e) => setValue(clean(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            <div className="name-hint">12 letters max · press Enter</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
