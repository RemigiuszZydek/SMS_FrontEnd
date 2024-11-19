import React from "react";
import SalonList from "./SalonList";
import "../../styles/components/salon/Salon.css";

const Salon = () => {
	return (
		<div className="salon-container">
			<h2>Salony</h2>
			<SalonList />
		</div>
	);
};

export default Salon;
