import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GuestList from "./pages/GuestList";
import AddGuest from "./pages/AddGuest";
import GuestDetail from "./pages/GuestDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Redirect root to guests */}
          <Route path="/" element={<Navigate to="/guests" replace />} />

          {/* Guest routes */}
          <Route path="/guests" element={<GuestList />} />
          <Route path="/guests/new" element={<AddGuest />} />
          <Route path="/guests/:id" element={<GuestDetail />} />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/guests"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go to Guest List
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
