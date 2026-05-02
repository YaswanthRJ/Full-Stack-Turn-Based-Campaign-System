import { useNavigate, useLocation } from "react-router-dom";

type HeaderProps = {
  onMenuClick: () => void;
};

const ROOT_ROUTES = ["/"];

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = !ROOT_ROUTES.includes(location.pathname);

  function handleBack() {
    navigate("/")
  }

  return (
    <header
      className="p-3 w-full shadow-lg border-b border-purple-500/20"
      style={{
        background: "linear-gradient(135deg, #0d001f 0%, #1a0033 100%)",
      }}
    >
      <div className="flex items-center justify-between text-white">
        {/* Back */}
        {canGoBack ? (
          <button
            onClick={handleBack}
            className="p-1 rounded-md hover:bg-purple-500/20 text-purple-300 transition"
          >
            ←
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Title - commented out */}
        {/* <h1 className="font-black text-sm tracking-widest uppercase text-purple-200">
          FSTBCS
        </h1> */}

        {/* Menu */}
        <button
          onClick={onMenuClick}
          className="p-1 rounded-md hover:bg-purple-500/20 text-purple-300 transition"
        >
          ☰
        </button>
      </div>
    </header>
  );
}