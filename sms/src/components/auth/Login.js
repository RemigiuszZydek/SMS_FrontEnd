import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, sendResetPasswordToken } from "../../api/authService";
import "../../styles/components/auth/Login.css";
import decodeAccessToken from "../../api/decodeAccessToken";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);
	const [resetEmail, setResetEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [showResetPassword, setShowResetPassword] = useState(false);
	const navigate = useNavigate();

	const validateForm = () => {
		const errors = [];
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			errors.push("Nieprawidłowy adres e-mail.");
		}
		if (formData.password.length < 8) {
			errors.push("Hasło musi mieć co najmniej 8 znaków.");
		}
		return errors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = validateForm();
		if (errors.length > 0) {
			setValidationErrors(errors);
			return;
		}
		setValidationErrors([]);
		try {
			const response = await signIn(formData);

			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("refreshToken", response.data.refreshToken);
			localStorage.setItem(
				"accessTokenExpiration",
				response.data.accessTokenExpiration
			);
			const roles = decodeAccessToken(localStorage.getItem("accessToken"));
			localStorage.setItem("roles", roles);
			console.log(roles);
			navigate("/dashboard");
		} catch (err) {
			console.error("Błąd logowania:", err);
			setError(
				"Logowanie nie powiodło się. Sprawdź swoje dane i spróbuj ponownie."
			);
		}
	};

	const handleResetPassword = async () => {
		try {
			const response = await sendResetPasswordToken({
				email: resetEmail,
				newPassword: newPassword,
			});
			setResetMessage(response.message);
		} catch (err) {
			console.error("Błąd wysyłania tokena resetowania hasła:", err);
			setResetMessage(
				"Wystąpił problem podczas wysyłania tokena resetowania hasła."
			);
		}
	};

	return (
		<div className="login-container">
			{!showResetPassword ? (
				<>
					<h2>Logowanie</h2>
					{validationErrors.length > 0 && (
						<div className="validation-errors">
							{validationErrors.map((err, index) => (
								<p key={index} className="error">
									{err}
								</p>
							))}
						</div>
					)}
					<form onSubmit={handleSubmit} className="login-form">
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Email"
							required
						/>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Hasło"
							required
						/>
						<button type="submit">Zaloguj</button>
					</form>
					{error && <p className="error">{error}</p>}
					<button
						className="forgot-password-button"
						onClick={() => setShowResetPassword(true)}
					>
						Nie pamiętam hasła
					</button>
				</>
			) : (
				<div className="reset-password">
					<h3>Resetowanie hasła</h3>
					<input
						type="email"
						value={resetEmail}
						onChange={(e) => setResetEmail(e.target.value)}
						placeholder="Podaj swój email"
						required
					/>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="Podaj nowe hasło"
						required
					/>
					<button onClick={handleResetPassword}>
						Wyślij token resetowania
					</button>
					{resetMessage && <p className="message">{resetMessage}</p>}
					<button
						className="back-to-login-button"
						onClick={() => setShowResetPassword(false)}
					>
						Powrót do logowania
					</button>
				</div>
			)}
		</div>
	);
};

export default Login;
