import React from "react";
import { useNavigate } from "react-router-dom";
import SalonList from "./SalonList";
import "../../styles/components/salon/Salon.css";

const Salon = () => {
	const navigate = useNavigate();

	const handleAddSalon = () => {
		navigate("/salons/create");
	};

	return (
		<div className="salon-container">
			<h2>Salony</h2>
			<SalonList />
		</div>
	);
};

export default Salon;
