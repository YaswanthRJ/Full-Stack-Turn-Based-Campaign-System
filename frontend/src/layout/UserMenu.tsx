import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type UserMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function UserMenu({ open, onClose }: UserMenuProps) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 flex justify-end"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-64 h-full p-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: "linear-gradient(180deg, #0d001f 0%, #1a0033 100%)",
              borderLeft: "1px solid #7c3aed33",
            }}
          >
            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-purple-400 hover:text-purple-200 hover:rotate-90 transition"
              >
                ✕
              </button>
            </div>

            {/* Menu */}
            <div className="mt-6 space-y-1">
              {["Profile", "Stats", "Settings"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-left px-4 py-3 rounded-lg 
                  text-purple-200 font-medium
                  transition"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}