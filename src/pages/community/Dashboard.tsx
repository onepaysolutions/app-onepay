import { useTranslation } from "react-i18next";
import { Header } from '@/components/common/layout/Header';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black/20">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-white">
          {t("Community Dashboard")}
        </h1>
        {/* 添加仪表板内容 */}
      </main>
    </div>
  );
}

export default Dashboard; 