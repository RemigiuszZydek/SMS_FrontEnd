import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/components/Settings.css";

const Settings = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("authToken");

		try {
			const response = await axios.post(
				"https://localhost:7099/api/auth/change-password",
				{ currentPassword, newPassword },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				setMessage("Hasło zostało zmienione pomyślnie.");
				setError("");
			}
		} catch (error) {
			setError("Błąd przy zmianie hasła. Sprawdź swoje dane.");
			setMessage("");
			console.error("Błąd:", error);
		}
	};

	return (
		<div className="settings-page">
			<button className="back-button" onClick={() => navigate("/dashboard")}>
				← Powrót do Dashboard
			</button>
			<div className="settings-container">
				<h1>Ustawienia</h1>
				<div className="settings-section">
					<h2>Zmiana hasła</h2>
					<form
						onSubmit={handlePasswordChange}
						className="change-password-form"
					>
						<label>Aktualne hasło:</label>
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							required
						/>
						<label>Nowe hasło:</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
						<button type="submit">Zmień hasło</button>
					</form>
					{message && <p className="success-message">{message}</p>}
					{error && <p className="error-message">{error}</p>}
				</div>
				<div className="settings-section">
					<h2>Inne ustawienia</h2>
					<p>Wkrótce dostępne...</p>
				</div>
			</div>
		</div>
	);
};

export default Settings;
