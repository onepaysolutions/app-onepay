import { useTranslation } from "react-i18next";

interface InfoSectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function InfoSection({ title, description, icon }: InfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-purple-800/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        {icon && <div className="text-2xl">{icon}</div>}
        <h3 className="text-xl font-bold">
          {t('components:info.section.title', { title })}
        </h3>
      </div>
      <p className="text-gray-300">
        {t('components:info.section.description', { description })}
      </p>
    </div>
  );
}