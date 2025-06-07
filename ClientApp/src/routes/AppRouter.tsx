import { Routes, Route, Navigate } from "react-router-dom"; // Import Routes and Route

import RoomsPage from "../pages/RoomsPage";
import Error404Page from "../pages/errors/Error404";
import LoginPage from "../pages/LoginPage";
import DoomPage from "../pages/DoomPage";
import LoginManagerPage from "../pages/manager/ManagerLoginPage";
import ManagerMainPage from "../pages/manager/ManagerMainPage";
import ManagerRoomsPage from "../pages/manager/RoomsPage";
import MyBookingsPage from "../pages/MyBookingsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/rooms" element={<RoomsPage />} />

      <Route path="/my-bookings" element={<MyBookingsPage />} />

      <Route path="/doom" element={<DoomPage />} />

      <Route path="/manager/login" element={<LoginManagerPage />} />

      <Route path="/manager/main-page" element={<ManagerMainPage />} />

      <Route path="/manager/room-page" element={<ManagerRoomsPage />} />

      {/* Catch-all for 404 */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default AppRouter;
