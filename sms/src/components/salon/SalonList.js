import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/components/salon/SalonList.css";

const SalonList = () => {
	const [salons, setSalons] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSalons = async () => {
			try {
				const response = await axios.get(
					"https://localhost:7099/api/salon/list",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						},
					}
				);
				setSalons(response.data.data); // Pobierz listę salonów z odpowiedzi
			} catch (error) {
				console.error("Błąd podczas pobierania salonów:", error);
			}
		};
		fetchSalons();
	}, []);

	return (
		<div className="salon-list-container">
			<h2>Lista Salonów</h2>
			{salons.length === 0 ? (
				<p>Brak salonów. Kliknij, aby dodać nowy salon.</p>
			) : (
				<ul>
					{salons.map((salon) => (
						<li key={salon.id}>{salon.name}</li>
					))}
				</ul>
			)}
			<button onClick={() => navigate("/salons/create")}>Dodaj Salon</button>
		</div>
	);
};

export default SalonList;
