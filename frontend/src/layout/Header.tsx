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
    if (canGoBack) {
      navigate(-1);
    }
  }

  return (
    <header className="bg-white p-2 w-full">
      <div className="flex items-center justify-between">
        {canGoBack ? (
          <button onClick={handleBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-5" />
        )}

        <button onClick={onMenuClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-5 h-5"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}