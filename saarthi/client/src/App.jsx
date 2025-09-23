import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TouristHeatmap from "./components/HeatMap/TouristHeatmap";
import MapPage from "./components/HeatMap/MapPage.jsx";
import Contacts from "./components/Contacts.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { FiCompass } from "react-icons/fi";

const Home = () => <h2>🏠 Home Page</h2>;
const About = () => <h2>ℹ️ About Page</h2>;

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // delete the token
    navigate("/"); // redirect to home
  };

  return (
    <BrowserRouter>
      <div>
        {/* Navigation */}
        <nav className="flex items-center justify-between bg-white dark:bg-gray-800 px-8 py-4 rounded-lg shadow-sm">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex flex-row gap-3">
            <FiCompass className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
            <span className="text-xl font-bold text-gray-800 dark:text-white tracking-wide mb-3">
              Saarthi
            </span>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-12">
            {token ? (
              <Link
                to="/dashboard"
                className="text-gray-700 cursor-pointer dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Home
              </Link>
            ) : (
              <span className="text-gray-400 cursor-not-allowed font-medium">
                Home
              </span>
            )}
            {/* <Link
          to="/signup"
          className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Sign Up
        </Link> */}
            <button
          onClick={handleLogout}
          className="text-gray-700 cursor-pointer dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Log Out
        </button>
            {/* <Link
          to="/about"
          className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          About
        </Link> */}
            {/* <Link
          to="/contact"
          className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          Contact
        </Link> */}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contacts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
