import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/Dashboard.css";

const Dashboard = () => {
	const navigate = useNavigate();

	return (
		<div className="dashboard-container">
			<h1>Witaj na stronie głównej!</h1>
			<div className="dashboard-windows">
				<div className="window" onClick={() => navigate("/settings")}>
					<h2>Ustawienia</h2>
					<p>Zarządzaj swoimi ustawieniami</p>
				</div>
				<div className="window" onClick={() => navigate("/salon")}>
					<h2>Salon</h2>
					<p>Zarządzaj salonami</p>
				</div>
				<div className="window" onClick={() => navigate("/employee")}>
					<h2>Pracownicy</h2>
					<p>Zarządzaj pracownikami</p>
				</div>
				<div className="window" onClick={() => navigate("/services")}>
					<h2>Usługi</h2>
					<p>Zarządzaj usługami</p>
				</div>
				<div className="window" onClick={() => navigate("/products")}>
					<h2>Produkty</h2>
					<p>Zarządzaj produktami</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
