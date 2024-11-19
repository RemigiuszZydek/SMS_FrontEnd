import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/components/salon/CreateSalon.css";

const CreateSalon = () => {
	const [salonName, setSalonName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleCreate = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"https://localhost:7099/api/salon/create",
				{ name: salonName, phoneNumber, email },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);
			if (response.status === 201) {
				setMessage("Salon został pomyślnie utworzony!");
				setSalonName("");
				setPhoneNumber("");
				setEmail("");
			}
		} catch (error) {
			console.error("Błąd przy tworzeniu salonu:", error);
			if (error.response) {
				console.error("Dane odpowiedzi:", error.response.data);
				console.error("Status:", error.response.status);
				console.error("Nagłówki:", error.response.headers);
			} else if (error.request) {
				console.error(
					"Żądanie zostało wysłane, ale brak odpowiedzi:",
					error.request
				);
			} else {
				console.error("Błąd konfiguracji żądania:", error.message);
			}
			setMessage("Wystąpił problem podczas tworzenia salonu.");
		}
	};

	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<div className="create-salon-container">
			<h2>Dodaj Salon</h2>
			<form onSubmit={handleCreate}>
				<input
					type="text"
					value={salonName}
					onChange={(e) => setSalonName(e.target.value)}
					placeholder="Nazwa salonu"
					required
				/>
				<input
					type="text"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder="Numer telefonu"
					required
				/>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Adres e-mail"
					required
				/>
				<button type="submit">Utwórz Salon</button>
				<button type="button" onClick={handleCancel} className="cancel-button">
					Anuluj
				</button>
			</form>
			{message && <p className="message">{message}</p>}
		</div>
	);
};

export default CreateSalon;
