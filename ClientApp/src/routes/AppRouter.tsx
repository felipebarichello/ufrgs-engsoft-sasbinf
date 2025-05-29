import { Routes, Route, Navigate } from "react-router-dom"; // Import Routes and Route

import RoomsPage from "../pages/RoomsPage";
import Error404Page from "../pages/errors/Error404";
import ReactExamplePage from "../pages/ReactExample";
import LoginPage from "../pages/LoginPage";
import DoomPage from "../pages/DoomPage";
import LoginManagerPage from "../pages/manager/ManagerLoginPage";
import ManagerMainPage from "../pages/manager/ManagarMainPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/rooms" element={<RoomsPage />} />

      <Route path="/doom" element={<DoomPage />} />

      <Route path="/react" element={<ReactExamplePage />} />

      <Route path="/manager/login" element={<LoginManagerPage />} />

      <Route path="/manager/main-page" element={<ManagerMainPage />} />

      {/* Catch-all for 404 */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default AppRouter;
