import { Routes, Route } from 'react-router-dom'; // Import Routes and Route

import RoomsPage from '../pages/RoomsPage';
import Error404Page from '../pages/errors/Error404';
import ReactExamplePage from '../pages/ReactExample';
import LoginPage from '../pages/LoginPage';
import BigRoomIcon from '../assets/rooms/components/BigRoom';
import RootRedirector from '../pages/RootRedirector';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirector />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/rooms" element={<RoomsPage />} />

      <Route path="/react" element={<ReactExamplePage />} />

      <Route path="/svg-test" element={<BigRoomIcon/>} />

      {/* Catch-all for 404 */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default AppRouter;
