import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/profile" element={<div>Profil</div>} />
				<Route path="/settings" element={<div>Ustawienia</div>} />
				<Route path="/invoices" element={<div>Faktury</div>} />
			</Routes>
		</Router>
	);
}

export default App;
