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
          className="fixed inset-0 z-50 bg-black/50 flex justify-end"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-64 h-full p-4 text-white"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            style={{
              background:
                "linear-gradient(180deg, #5b21b6, #86198f, #3730a3)",
            }}
          >
            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 hover:rotate-90 transition"
              >
                ✕
              </button>
            </div>

            {/* Menu */}
            <div className="mt-6 space-y-4">
              {["Profile", "Stats", "Settings"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-left px-3 py-2 rounded-lg 
                  bg-white/10 hover:bg-white/20 
                  hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]
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