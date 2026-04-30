import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type HeaderProps = {
  onMenuClick: () => void;
};

const ROOT_ROUTES = ["/"];

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = !ROOT_ROUTES.includes(location.pathname);

  function handleBack() {
    if (canGoBack) navigate(-1);
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-3 w-full shadow-lg border-b border-white/10"
      style={{
        background:
          "linear-gradient(90deg, #5b21b6, #86198f, #3730a3)",
      }}
    >
      <div className="flex items-center justify-between text-white">
        
        {/* Back */}
        {canGoBack ? (
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-md hover:bg-white/20"
          >
            ←
          </motion.button>
        ) : (
          <div className="w-5" />
        )}

        {/* Title */}
        <h1 className="font-black text-sm tracking-widest uppercase">
          
        </h1>

        {/* Menu */}
        <motion.button
          onClick={onMenuClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 rounded-md hover:bg-white/20"
        >
          ☰
        </motion.button>
      </div>
    </motion.header>
  );
}