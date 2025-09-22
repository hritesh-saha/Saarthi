import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TouristHeatmap from "./components/HeatMap/TouristHeatmap";
import MapPage from "./components/HeatMap/MapPage.jsx";
import Contacts from "./components/Contacts.jsx";
import Dashboard from "./components/Dashboard.jsx";

const Home = () => <h2>🏠 Home Page</h2>;
const About = () => <h2>ℹ️ About Page</h2>;

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Navigation */}
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contacts/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
