import React, { useMemo, useState, useEffect } from "react";
import MapPage from "./HeatMap/MapPage.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// --- ICONS ---
const UsersIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AlertTriangleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// --- CARD COMPONENT ---
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div
      className={`p-3 rounded-full ${colorClass
        .replace("text", "bg")
        .replace("-500", "-100")} dark:${colorClass
        .replace("text", "bg")
        .replace("-500", "-900/50")}`}
    >
      {React.cloneElement(icon, { className: `h-6 w-6 ${colorClass}` })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  </div>
);

const SOS_API = "http://localhost:5000/auth/users/so";

// const Dashboard = () => {
//   const [peopleLocations, setPeopleLocations] = useState([]);

//   // Mock data generation (could later come from API)
//   useEffect(() => {
//     const generateMockPeople = (count) =>
//       Array.from({ length: count }, () => [22.57 + (Math.random() - 0.5) * 0.1, 88.36 + (Math.random() - 0.5) * 0.1]);

//     setPeopleLocations(generateMockPeople(1200));
//   }, []);

//   const totalTourists = peopleLocations.length;
//   const touristsInRedZone = Math.floor(totalTourists * 0.05);
//   const touristsInSafeZone = totalTourists - touristsInRedZone;

//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Authority Dashboard</h1>
//           <p className="text-md text-gray-600 dark:text-gray-400">Real-time Tourist Tracking & Safety Monitoring</p>
//         </header>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           <StatCard title="Total Tourists" value={totalTourists} icon={<UsersIcon />} colorClass="text-blue-500" />
//           <StatCard title="Tourists in Red Area" value={touristsInRedZone} icon={<AlertTriangleIcon />} colorClass="text-red-500" />
//           <StatCard title="Tourists in Safe Area" value={touristsInSafeZone} icon={<ShieldCheckIcon />} colorClass="text-green-500" />
//         </div>

//         {/* MapPage */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <MapPage peopleLocations={peopleLocations} />
//         </div>
//       </div>
//     </div>
//   );
// };
const Dashboard = () => {
  const [totalTourists, setTotalTourists] = useState(0);
  const [lastAlertUser, setLastAlertUser] = useState("tourist");

  const touristsInRedZone = Math.floor(totalTourists * 0.05);
  const touristsInSafeZone = totalTourists - touristsInRedZone;

   // Poll for SOS alerts every 2–3 seconds
useEffect(() => {
  let lastAlertedUser = null; // local variable to track last toast

  const interval = setInterval(async () => {
    try {
      const res = await axios.get(SOS_API);
      const alerts = res.data;

      if (alerts && alerts.length > 0) {
        const latestUsername = alerts[0]?.username || "Tourist";

        // Only show toast if username changed
        if (lastAlertedUser !== latestUsername) {
          lastAlertedUser = latestUsername; // update local tracker
          setLastAlertUser(latestUsername); // update state if needed

          toast.info(
            `🚨 New SOS from ${latestUsername} at ${
              alerts[0]?.location
                ? `Latitude: ${alerts[0].location.latitude}, Longitude: ${alerts[0].location.longitude}`
                : "Kolkata"
            }`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
      }
    } catch (err) {
      console.error("Error fetching SOS alerts:", err);
    }
  }, 2500);

  return () => clearInterval(interval);
}, []);



  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 shadow-md">
          <h1 className="text-4xl font-extrabold text-white">
            Authority Dashboard
          </h1>
          <p className="mt-2 text-lg text-blue-100">
            Real-time Tourist Tracking & Safety Monitoring
          </p>
        </header>

        {/* Stat Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Tourists"
              value={totalTourists}
              icon={<UsersIcon />}
              colorClass="text-blue-500"
            />
            <StatCard
              title="Tourists in Red Area"
              value={touristsInRedZone}
              icon={<AlertTriangleIcon />}
              colorClass="text-red-500"
            />
            <StatCard
              title="Tourists in Safe Area"
              value={touristsInSafeZone}
              icon={<ShieldCheckIcon />}
              colorClass="text-green-500"
            />
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b-2 border-blue-500 inline-block">
            Tourist Heatmap
          </h2>

          <MapPage onUpdateTotal={setTotalTourists} />
        </section>
      </div>
    </div>
    // <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
    //   <div className="max-w-7xl mx-auto">
    //     {/* Header */}
    //     <header className="mb-6">
    //       <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Authority Dashboard</h1>
    //       <p className="text-md text-gray-600 dark:text-gray-400">Real-time Tourist Tracking & Safety Monitoring</p>
    //     </header>

    //     {/* Stat Cards */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    //       <StatCard title="Total Tourists" value={totalTourists} icon={<UsersIcon />} colorClass="text-blue-500" />
    //       <StatCard title="Tourists in Red Area" value={touristsInRedZone} icon={<AlertTriangleIcon />} colorClass="text-red-500" />
    //       <StatCard title="Tourists in Safe Area" value={touristsInSafeZone} icon={<ShieldCheckIcon />} colorClass="text-green-500" />
    //     </div>

    //     {/* MapPage */}
    //     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    //       <MapPage onUpdateTotal={setTotalTourists} />
    //     </div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
