import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AirdropCalculator } from "@/components/star/ops/AirdropCalculator";
import { IoArrowBack } from "react-icons/io5";

export function OPSSale() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <IoArrowBack className="w-5 h-5" />
            <span>{t("Back")}</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("OPS Presale")}</h1>
            <p className="text-gray-400">{t("Calculate your potential airdrops")}</p>
          </div>
          
          <AirdropCalculator />
        </div>
      </div>
    </div>
  );
}

export default OPSSale; 