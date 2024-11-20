import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/salon/Salon.css";

const Salon = () => {
	const { salonId } = useParams();
	const [salon, setSalon] = useState(null);
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [editDetails, setEditDetails] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		description: "",
	});

	useEffect(() => {
		const fetchSalonDetails = async () => {
			try {
				const response = await Api.get(`${config.apiUrl}salon/${salonId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});
				setSalon(response.data.data);
				setEditDetails({
					name: response.data.data.name || "",
					email: response.data.data.email || "",
					phoneNumber: response.data.data.phoneNumber || "",
					description: response.data.data.description || "",
				});
			} catch (error) {
				if (error.response) {
					setError(`Błąd: ${error.response.status}`);
				} else if (error.request) {
					setError("Problem z połączeniem z serwerem.");
				} else {
					setError("Nieoczekiwany błąd.");
				}
			}
		};
		fetchSalonDetails();
	}, [salonId]);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleSaveChanges = async () => {
		const patchData = [
			{ path: "/name", op: "replace", value: editDetails.name },
			{ path: "/email", op: "replace", value: editDetails.email },
			{ path: "/phoneNumber", op: "replace", value: editDetails.phoneNumber },
			{ path: "/description", op: "replace", value: editDetails.description },
		];

		try {
			await Api.patch(
				`${config.apiUrl}salon/${salonId}/manage/update-details`,
				patchData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			// Zaktualizuj szczegóły salonu po pomyślnej edycji
			setSalon(editDetails);
			setIsEditing(false);
		} catch (error) {
			if (error.response) {
				setError(`Błąd: ${error.response.status}`);
			} else {
				setError("Nie udało się zapisać zmian.");
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
		<div className="salon-details-container">
			<h2>Szczegóły salonu</h2>
			{isEditing ? (
				<div className="edit-form">
					<label>
						Nazwa:
						<input
							type="text"
							name="name"
							value={editDetails.name}
							onChange={handleInputChange}
						/>
					</label>
					<label>
						Email:
						<input
							type="email"
							name="email"
							value={editDetails.email}
							onChange={handleInputChange}
						/>
					</label>
					<label>
						Telefon:
						<input
							type="text"
							name="phoneNumber"
							value={editDetails.phoneNumber}
							onChange={handleInputChange}
						/>
					</label>
					<label>
						Opis:
						<textarea
							name="description"
							value={editDetails.description}
							onChange={handleInputChange}
						/>
					</label>
					<div className="buttons">
						<button onClick={handleSaveChanges}>Zapisz zmiany</button>
						<button onClick={handleEditToggle}>Anuluj</button>
					</div>
				</div>
			) : (
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
					<button onClick={handleEditToggle}>Edytuj</button>
				</div>
			)}
		</div>
	);
};

export default Salon;
