import { Routes, Route, Navigate } from "react-router-dom"; // Import Routes and Route

import RoomsPage from "../pages/RoomsPage";
import Error404Page from "../pages/errors/Error404";
import LoginPage from "../pages/LoginPage";
import DoomPage from "../pages/DoomPage";
import LoginManagerPage from "../pages/manager/ManagerLoginPage";
import ManagerMainPage from "../pages/manager/ManagerMainPage";
import ManagerRoomsPage from "../pages/manager/RoomsPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ManagerMembersPage from "../pages/manager/MembersPage";
import NotificationsPage from "../pages/NotificationsPage";
import HistoryPage from "../pages/HistoryPage";
function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/rooms" replace />} />

			<Route path="/login" element={<LoginPage />} />

			<Route path="/rooms" element={<RoomsPage />} />

			<Route path="/my-bookings" element={<MyBookingsPage />} />

			<Route path="/notifications" element={<NotificationsPage />} />

			<Route path="/history" element={<HistoryPage />} />
		
			<Route path="/doom" element={<DoomPage />} />

      		<Route path="/manager" element={<Navigate to="/manager/login" replace />} />

      		<Route path="/manager/login" element={<LoginManagerPage />} />
			
			<Route path="/manager/main-page" element={<ManagerMainPage />} />

			<Route path="/manager/rooms-page" element={<ManagerRoomsPage />} />

			<Route path="/manager/members-page" element={<ManagerMembersPage />} />

			{/* Catch-all for 404 */}
			<Route path="*" element={<Error404Page />} />
		</Routes>
	);
}

export default AppRouter;
