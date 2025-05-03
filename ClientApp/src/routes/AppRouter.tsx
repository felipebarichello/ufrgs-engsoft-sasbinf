import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes and Route

import RoomsPage from '../pages/RoomsPage';
import Error404Page from '../pages/errors/Error404';
import ReactExamplePage from '../pages/ReactExample';
import LoginPage from '../pages/LoginPage';
import BigRoom from '../assets/rooms/components/BigRoom';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/rooms" element={<RoomsPage />} />

      <Route path="/react" element={<ReactExamplePage />} />

      <Route path="/svg-test" element={<BigRoom/>} />

      {/* Catch-all for 404 */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default AppRouter;
