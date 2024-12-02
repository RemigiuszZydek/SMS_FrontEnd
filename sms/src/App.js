import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Salon from "./components/salon/Salon";
import CreateSalon from "./components/salon/CreateSalon";
import Employee from "./components/employee/Employees";
import Services from "./components/services/Services";
import Products from "./components/products/Products";
import SalonList from "./components/salon/SalonList";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/salon" element={<SalonList />} />
				<Route path="/salon/create" element={<CreateSalon />} />
				<Route path="/employee" element={<Employee />} />
				<Route path="/services" element={<Services />} />
				<Route path="/services" element={<Products />} />
				<Route path="/salon/:salonId" element={<Salon />} />
			</Routes>
		</Router>
	);
}

export default App;
