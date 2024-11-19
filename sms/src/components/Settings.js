import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { refreshAuthToken } from "../api/authService";
import "../styles/components/Settings.css";

const Settings = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [passwordMessage, setPasswordMessage] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [emailMessage, setEmailMessage] = useState("");
	const [emailError, setEmailError] = useState("");
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
				setPasswordMessage("Hasło zostało zmienione pomyślnie.");
				setPasswordError("");
			}
		} catch (error) {
			setPasswordError("Błąd przy zmianie hasła. Sprawdź swoje dane.");
			setPasswordMessage("");
			console.error("Błąd:", error);
		}
	};

	const handleEmailChange = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("accessToken");

		try {
			const response = await axios.post(
				"https://localhost:7099/api/auth/send-confirmation-change-email",
				{ newEmail },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				setEmailMessage(
					"Link do potwierdzenia zmiany adresu e-mail został wysłany."
				);
				setEmailError("");
			}
		} catch (error) {
			if (error.response && error.response.status === 401) {
				console.log(token);
				await refreshAuthToken();
				handleEmailChange(e);
			} else {
				setEmailError(
					"Błąd przy wysyłaniu linku zmiany e-maila. Spróbuj ponownie."
				);
				setEmailMessage("");
				console.error("Błąd:", error);
			}
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
					{passwordMessage && (
						<p className="success-message">{passwordMessage}</p>
					)}
					{passwordError && <p className="error-message">{passwordError}</p>}
				</div>
				<div className="settings-section">
					<h2>Zmiana adresu e-mail</h2>
					<form onSubmit={handleEmailChange} className="change-email-form">
						<label>Nowy adres e-mail:</label>
						<input
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							required
						/>
						<button type="submit">Zmień adres e-mail</button>
					</form>
					{emailMessage && <p className="success-message">{emailMessage}</p>}
					{emailError && <p className="error-message">{emailError}</p>}
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
