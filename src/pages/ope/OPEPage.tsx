import { useTranslation } from "react-i18next";
import { OPEInfo } from '@/components/community/ope/OPEInfo';
import { OPEChart } from '@/components/community/ope/OPEChart';
import { useActiveAccount } from "thirdweb/react";
import { InfoSlider } from '@/components/community/info/InfoSlider';
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Header } from '@/components/common/layout/Header';

export function OPEPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black/20">
      <Header />
      <div className="h-16" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/community")}
            className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 transition-colors border border-purple-500/20"
            title={t("common.back")}
          >
            <IoArrowBack className="w-6 h-6 text-purple-400" />
          </button>
        
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("ope.title")}
          </h1>
        </div>

        {/* OPE 信息和图表 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <OPEInfo />
          <OPEChart />
        </div>

        {/* 当前阶段信息 */}
        <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("ope.currentStage.title")}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("ope.currentStage.stage")}</p>
              <p className="text-xl font-bold text-purple-400">1/4</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("ope.currentStage.currentPrice")}</p>
              <p className="text-xl font-bold text-purple-400">0.1 USDT</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("ope.currentStage.availableSupply")}</p>
              <p className="text-xl font-bold text-purple-400">300,000 OPE</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("ope.currentStage.nextPrice")}</p>
              <p className="text-xl font-bold text-purple-400">1.5 USDT</p>
            </div>
          </div>
        </div>

        {/* 价格阶段表格 */}
        <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("ope.priceStages.title")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left p-4 text-purple-400">{t("ope.priceStages.headers.stage")}</th>
                  <th className="text-left p-4 text-purple-400">{t("ope.priceStages.headers.price")}</th>
                  <th className="text-left p-4 text-purple-400">{t("ope.priceStages.headers.supply")}</th>
                  <th className="text-left p-4 text-purple-400">{t("ope.priceStages.headers.marketCap")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-500/10">
                  <td className="p-4">1</td>
                  <td className="p-4">0.1 USDT</td>
                  <td className="p-4">300,000 OPE</td>
                  <td className="p-4">30,000 USDT</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="p-4">2</td>
                  <td className="p-4">1.5 USDT</td>
                  <td className="p-4">200,000 OPE</td>
                  <td className="p-4">300,000 USDT</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="p-4">3</td>
                  <td className="p-4">3.5 USDT</td>
                  <td className="p-4">150,000 OPE</td>
                  <td className="p-4">525,000 USDT</td>
                </tr>
                <tr>
                  <td className="p-4">4</td>
                  <td className="p-4">6.5 USDT</td>
                  <td className="p-4">100,000 OPE</td>
                  <td className="p-4">650,000 USDT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 用户的 OPE 信息 */}
        {account && (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t("ope.userStatus.title")}
            </h2>
            <InfoSlider address={account.address} />
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}

export default OPEPage; 