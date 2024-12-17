import { useTranslation } from "react-i18next";

export function CompanyUpdates() {
  const { t } = useTranslation();

  const updates = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'New Partnership Announcement',
      content: 'We are excited to announce our new partnership with...',
      type: 'partnership'
    },
    // ... 更多更新
  ];

  return (
    <div className="space-y-4">
      {updates.map(update => (
        <div key={update.id} className="bg-purple-900/20 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{update.title}</h3>
            <span className="text-sm text-gray-400">{update.date}</span>
          </div>
          <p className="text-gray-300">{update.content}</p>
        </div>
      ))}
    </div>
  );
} 