import React, { useState } from "react";
import { signIn } from "../../api/authService";
import "../../styles/components/auth/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);
	const navigate = useNavigate();

	// Walidacja formularza
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

	// Obsługa zmiany wartości w formularzu
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Obsługa wysyłania formularza
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
			console.log(response);

			// Zapisz tokeny w localStorage
			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("refreshToken", response.data.refreshToken);

			// Przekierowanie na Dashboard
			navigate("/dashboard");
		} catch (err) {
			console.error("Błąd logowania:", err);
			setError(
				"Logowanie nie powiodło się. Sprawdź swoje dane i spróbuj ponownie."
			);
		}
	};

	return (
		<div className="login-container">
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
		</div>
	);
};

export default Login;
