import { Routes, Route } from 'react-router-dom'; // Import Routes and Route

import RoomsPage from '../pages/RoomsPage';
import Error404Page from '../pages/errors/Error404';
import ReactExamplePage from '../pages/ReactExample';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomsPage />} />

      <Route path="/react" element={<ReactExamplePage />} /> {/* Example of another route */}

      {/* Catch-all for 404 */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default AppRouter;
