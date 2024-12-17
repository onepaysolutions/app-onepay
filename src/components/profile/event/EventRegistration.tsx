import { useTranslation } from "react-i18next";
import { FiUsers, FiCalendar, FiMapPin } from 'react-icons/fi';

export function EventRegistration() {
  const events = [
    {
      id: 1,
      title: 'Community AMA Session',
      date: '2024-01-20',
      time: '19:00 UTC',
      location: 'Discord',
      status: 'upcoming',
      participants: 156,
      maxParticipants: 200,
      type: 'Community'
    },
    {
      id: 2,
      title: 'Technical Workshop: Web3 Development',
      date: '2024-01-25',
      time: '15:00 UTC',
      location: 'Zoom',
      status: 'upcoming',
      participants: 85,
      maxParticipants: 100,
      type: 'Workshop'
    }
  ];

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="bg-purple-900/20 rounded-xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <span className="text-sm text-purple-400">{event.type}</span>
            </div>
            <span className="px-2 py-1 bg-purple-600/20 rounded-full text-xs text-purple-400">
              {event.status}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FiCalendar className="text-purple-400" />
              <span>{event.date} {event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FiMapPin className="text-purple-400" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FiUsers className="text-purple-400" />
              <span>{event.participants}/{event.maxParticipants} participants</span>
            </div>
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors">
            Register Now
          </button>
        </div>
      ))}
    </div>
  );
} 