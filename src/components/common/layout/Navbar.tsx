import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-purple-500/20">
      
    </nav>
  );
}

export default Navbar;