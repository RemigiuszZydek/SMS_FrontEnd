import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/salon/SalonList.css";

const SalonList = () => {
	const [salons, setSalons] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSalons = async () => {
			try {
				const response = await Api.get(`${config.apiUrl}salon/list`);
				setSalons(response.data.data);
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
					{salons.map((salon) => {
						return (
							<li
								key={salon.id}
								className="salon-item"
								onClick={() => navigate(`/salon/${salon.id}`)}
							>
								{salon.name}
							</li>
						);
					})}
				</ul>
			)}
			<button onClick={() => navigate("/salon/create")}>Dodaj Salon</button>
		</div>
	);
};

export default SalonList;
