import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400 mb-8">{t("errors.pageNotFound")}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 
              rounded-lg text-white font-medium transition-colors"
          >
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 