import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import SalonList from "./components/salon/SalonList";
import CreateSalon from "./components/salon/CreateSalon";
import Employee from "./components/employee/Employees";
import EmployeeDetails from "./components/employee/EmployeeDetails";
import Services from "./components/services/Services";
import Products from "./components/products/Products";
import Salon from "./components/salon/Salon";

const App = () => {
	const location = useLocation();
	const sidebarRoutes = [
		"/dashboard",
		"/settings",
		"/salon",
		"/employee",
		"/services",
		"/products",
	];

	const showSidebar = sidebarRoutes.some((route) =>
		location.pathname.startsWith(route)
	);

	console.log("showSidebar:", showSidebar, "currentPath:", location.pathname);

	return (
		<div
			className={`app-container ${showSidebar ? "with-sidebar" : "no-sidebar"}`}
		>
			{showSidebar && <Sidebar />}
			<div className="content-container">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/salon" element={<SalonList />} />
					<Route path="/salon/create" element={<CreateSalon />} />
					<Route path="/employee" element={<Employee />} />
					<Route path="/employee/:id" element={<EmployeeDetails />} />
					<Route path="/services" element={<Services />} />
					<Route path="/products" element={<Products />} />
					<Route path="/salon/:salonId" element={<Salon />} />
				</Routes>
			</div>
		</div>
	);
};

const AppWrapper = () => (
	<Router>
		<App />
	</Router>
);

export default AppWrapper;
