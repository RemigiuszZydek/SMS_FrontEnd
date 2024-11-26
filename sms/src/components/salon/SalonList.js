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
				const response = await Api.get(`${config.apiUrl}salon/list`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});
				setSalons(response.data.data);
			} catch (error) {
				console.error("Błąd podczas pobierania salonów:", error);
			}
		};
		fetchSalons();
	}, []);

	const handleDeleteSalon = async (salonId) => {
		try {
			await Api.delete(`${config.apiUrl}salon/${salonId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			// Usuwanie salonu z lokalnego stanu
			setSalons((prevSalons) =>
				prevSalons.filter((salon) => salon.id !== salonId)
			);
		} catch (error) {
			console.error("Błąd podczas usuwania salonu:", error);
		}
	};

	return (
		<div className="salon-list-container">
			<h2>Lista Salonów</h2>
			{salons.length === 0 ? (
				<p>Brak salonów. Kliknij, aby dodać nowy salon.</p>
			) : (
				<ul>
					{salons.map((salon) => (
						<li key={salon.id} className="salon-item">
							<div className="salon-name">
								<span onClick={() => navigate(`/salon/${salon.id}`)}>
									{salon.name}
								</span>
								<button
									className="delete-button"
									onClick={() => handleDeleteSalon(salon.id)}
								>
									&times;
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
			<button onClick={() => navigate("/salon/create")}>Dodaj Salon</button>
		</div>
	);
};

export default SalonList;
