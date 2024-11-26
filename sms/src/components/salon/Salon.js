import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/salon/Salon.css";

const daysOfWeek = [
	"Poniedziałek",
	"Wtorek",
	"Środa",
	"Czwartek",
	"Piątek",
	"Sobota",
	"Niedziela",
];

const Salon = () => {
	const { salonId } = useParams();
	const [salon, setSalon] = useState(null);
	const [openingHours, setOpeningHours] = useState([]);
	const [error, setError] = useState("");
	const [editedHour, setEditedHour] = useState({
		dayOfWeek: null,
		openingTime: "",
		closingTime: "",
	});

	useEffect(() => {
		const fetchSalonDetails = async () => {
			try {
				console.log("Fetching salon details...");
				const response = await Api.get(`${config.apiUrl}salon/${salonId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});
				console.log("Salon details response:", response.data);
				setSalon(response.data.data);
				setOpeningHours(response.data.data.openingHours || []);
			} catch (error) {
				if (error.response) {
					console.error("Error fetching salon details:", error.response.data);
					setError(`Błąd: ${error.response.status}`);
				} else if (error.request) {
					console.error("No response from server:", error.request);
					setError("Problem z połączeniem z serwerem.");
				} else {
					console.error("Unexpected error:", error.message);
					setError("Nieoczekiwany błąd.");
				}
			}
		};
		fetchSalonDetails();
	}, [salonId]);

	const handleEditOpeningHour = (dayOfWeek) => {
		const hour = openingHours.find((h) => h.dayOfWeek === dayOfWeek);
		console.log(`Editing opening hours for dayOfWeek: ${dayOfWeek}`, hour);
		setEditedHour({
			dayOfWeek,
			openingTime: hour ? hour.openingTime : "09:00:00",
			closingTime: hour ? hour.closingTime : "17:00:00",
		});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		console.log(`Changing input ${name}:`, value);
		setEditedHour((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveEditedHour = async () => {
		console.log("Saving edited hour:", editedHour);
		try {
			const existingHour = openingHours.find(
				(hour) => hour.dayOfWeek === editedHour.dayOfWeek
			);

			if (existingHour) {
				// Jeśli godziny istnieją, wykonaj PUT
				const response = await Api.put(
					`${config.apiUrl}salon/${salonId}/manage/opening-hours`,
					editedHour,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log("PUT response:", response);

				// Aktualizuj stan openingHours
				setOpeningHours((prevHours) => {
					const updatedHours = [...prevHours];
					const index = updatedHours.findIndex(
						(hour) => hour.dayOfWeek === editedHour.dayOfWeek
					);

					updatedHours[index] = { ...editedHour };

					return updatedHours;
				});
			} else {
				// Jeśli godziny nie istnieją, wykonaj POST
				const response = await Api.post(
					`${config.apiUrl}salon/${salonId}/manage/opening-hours`,
					editedHour,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log("POST response:", response);

				// Dodaj nowe godziny do stanu openingHours
				setOpeningHours((prevHours) => [...prevHours, editedHour]);
			}

			setEditedHour({
				dayOfWeek: null,
				openingTime: "",
				closingTime: "",
			});
		} catch (error) {
			if (error.response) {
				console.error("Error saving opening hours:", error.response.data);
				setError(`Błąd zapisu godzin: ${error.response.status}`);
			} else {
				console.error("No response from server:", error.request);
				setError("Nie udało się zapisać zmian.");
			}
		}
	};

	const handleDeleteOpeningHour = async (dayOfWeek) => {
		console.log(`Deleting opening hours for dayOfWeek: ${dayOfWeek}`);
		try {
			await Api.delete(
				`${config.apiUrl}salon/${salonId}/manage/opening-hours/${dayOfWeek}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			console.log(`Deleted opening hours for dayOfWeek: ${dayOfWeek}`);

			// Usuń godziny z lokalnego stanu
			setOpeningHours((prevHours) =>
				prevHours.filter((hour) => hour.dayOfWeek !== dayOfWeek)
			);
		} catch (error) {
			if (error.response) {
				console.error("Error deleting opening hours:", error.response.data);
				setError(`Błąd usuwania godzin: ${error.response.status}`);
			} else {
				console.error("No response from server:", error.request);
				setError("Nie udało się usunąć godzin.");
			}
		}
	};

	if (error) {
		return (
			<div className="error-container">
				<h3>Błąd</h3>
				<p>{error}</p>
			</div>
		);
	}

	if (!salon) {
		return <div className="loading">Ładowanie danych salonu...</div>;
	}

	return (
		<div>
			<div className="salon-details-container">
				<h2>Szczegóły salonu</h2>
				<div>
					<p>
						<strong>Nazwa:</strong> {salon.name}
					</p>
					<p>
						<strong>Email:</strong> {salon.email}
					</p>
					<p>
						<strong>Telefon:</strong> {salon.phoneNumber || "Brak danych"}
					</p>
					<p>
						<strong>Opis:</strong> {salon.description || "Brak danych"}
					</p>
				</div>
			</div>

			<div className="opening-hours-container">
				<h2>Godziny otwarcia</h2>
				{daysOfWeek.map((day, index) => {
					const hoursForDay = openingHours.find(
						(hour) => hour.dayOfWeek === index
					);
					return (
						<div key={index} className="day-container">
							<h3>{day}</h3>
							{hoursForDay ? (
								<p>
									<strong>Godziny:</strong> {hoursForDay.openingTime} -{" "}
									{hoursForDay.closingTime}
								</p>
							) : (
								<p>Brak ustawionych godzin.</p>
							)}
							<div className="buttons">
								<button onClick={() => handleEditOpeningHour(index)}>
									Edytuj
								</button>
								{hoursForDay && (
									<button
										className="delete-button"
										onClick={() => handleDeleteOpeningHour(index)}
									>
										Usuń
									</button>
								)}
							</div>
							{editedHour.dayOfWeek === index && (
								<div className="edit-form">
									<label>
										Godzina otwarcia:
										<input
											type="time"
											name="openingTime"
											value={editedHour.openingTime}
											onChange={handleInputChange}
										/>
									</label>
									<label>
										Godzina zamknięcia:
										<input
											type="time"
											name="closingTime"
											value={editedHour.closingTime}
											onChange={handleInputChange}
										/>
									</label>
									<button onClick={handleSaveEditedHour}>Zapisz</button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Salon;
