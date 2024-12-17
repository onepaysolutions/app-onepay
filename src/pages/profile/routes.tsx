import { Route, Routes } from 'react-router-dom';
import { ProfileLayout } from './ProfileLayout';
import { ProfileInfo } from './sections/ProfileInfo';
import { EventSection } from './sections/EventSection';
import { UpdatesSection } from './sections/UpdatesSection';
import { NotificationSection } from './sections/NotificationSection';

export function ProfileRoutes() {
  return (
    <Routes>
      <Route element={<ProfileLayout />}>
        <Route index element={<ProfileInfo />} />
        <Route path="events" element={<EventSection />} />
        <Route path="updates" element={<UpdatesSection />} />
        <Route path="notifications" element={<NotificationSection />} />
      </Route>
    </Routes>
  );
} 