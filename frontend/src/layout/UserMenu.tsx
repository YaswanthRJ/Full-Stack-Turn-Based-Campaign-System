import { useEffect } from "react";

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex justify-end"
      onClick={onClose} // click outside closes
    >
      <div
        className="w-64 h-full bg-white shadow-lg p-4"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2" aria-label="Close menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-6 h-6"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <button className="w-full text-left">Profile</button>
          <button className="w-full text-left">Stats</button>
          <button className="w-full text-left">Settings</button>
        </div>
      </div>
    </div>
  );
}