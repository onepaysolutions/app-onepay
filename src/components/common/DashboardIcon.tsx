import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { Link } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";

export function DashboardIcon() {
  const { t } = useTranslation();
  const address = useActiveAccount();

  if (!address) return null;

  return (
    <Link
      to="/profile"
      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-900/30"
      title={t("Profile")}
    >
      <IoPersonOutline className="w-5 h-5" />
      <span className="hidden md:inline text-sm">
        {address?.address.slice(0, 6)}...{address?.address.slice(-4)}
      </span>
    </Link>
  );
}