import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Salon from "./components/salon/Salon";
import CreateSalon from "./components/salon/CreateSalon";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/profile" element={<div>Profil</div>} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/invoices" element={<div>Faktury</div>} />
				<Route path="/salon" element={<Salon />} />
				<Route path="/salons/create" element={<CreateSalon />} />
			</Routes>
		</Router>
	);
}

export default App;
