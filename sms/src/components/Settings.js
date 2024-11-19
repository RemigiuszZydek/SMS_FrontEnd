import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from '../config';
import Api from "../api/Api";
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

	const handlePasswordChange = async (e) => { //przenieś do auth
		e.preventDefault();
		try {
			
			const response = await Api.post(`${config.apiUrl}auth/change-password`, {
				currentPassword,
				newPassword,
			  });

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

	const handleEmailChange = async (e) => { //przenieś do auth
		e.preventDefault();
		try {
			const response = await Api.post(`${config.apiUrl}auth/send-confirmation-change-email`,
			{
				newEmail
			});

			if (response.status === 200) {
				setEmailMessage("Link do potwierdzenia zmiany adresu e-mail został wysłany.");
				setEmailError("");
			}
		} catch (error) {
			setEmailError("Błąd przy wysyłaniu linku zmiany e-maila. Spróbuj ponownie.");
			setEmailMessage("");
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
