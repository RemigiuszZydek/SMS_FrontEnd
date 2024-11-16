import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/Dashboard.css";

const Dashboard = () => {
	const navigate = useNavigate();

	return (
		<div className="dashboard-container">
			<h1>Witaj na stronie głównej!</h1>
			<div className="dashboard-windows">
				<div className="window" onClick={() => navigate("/profile")}>
					<h2>Profil</h2>
					<p>Przejdź do swojego profilu</p>
				</div>
				<div className="window" onClick={() => navigate("/settings")}>
					<h2>Ustawienia</h2>
					<p>Zarządzaj swoimi ustawieniami</p>
				</div>
				<div className="window" onClick={() => navigate("/invoices")}>
					<h2>Faktury</h2>
					<p>Przeglądaj swoje faktury</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
