import React, { useState } from "react";
import { register } from "../../api/authService";
import "../../styles/components/auth/Register.css";

const Register = ({ onRegisterSuccess }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		phoneNumber: "",
	});

	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);

	const validateForm = () => {
		const errors = [];
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			errors.push("Nieprawidłowy adres e-mail.");
		}
		// Password validation
		if (formData.password.length < 8) {
			errors.push("Hasło musi mieć co najmniej 8 znaków.");
		}
		if (!/[A-Z]/.test(formData.password)) {
			errors.push("Hasło musi zawierać co najmniej jedną dużą literę.");
		}
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
			errors.push("Hasło musi zawierać co najmniej jeden znak specjalny.");
		}
		// Phone number validation
		if (!/^\d+$/.test(formData.phoneNumber)) {
			errors.push("Numer telefonu może zawierać tylko cyfry.");
		}
		return errors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
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
			const response = await register(formData);
			if (onRegisterSuccess) onRegisterSuccess();
		} catch (err) {
			console.error("Błąd rejestracji:", err);
			if (err.response && err.response.data.errors) {
				// Przykład obsługi błędu dla zduplikowanego emaila
				if (err.response.data.errors.DuplicateEmail) {
					setError("Podany adres email jest już zajęty.");
				} else {
					setError("Rejestracja nie powiodła się. Spróbuj ponownie.");
				}
			} else {
				setError("Rejestracja nie powiodła się. Spróbuj ponownie.");
			}
		}
	};

	return (
		<div className="register-container">
			<h2>Rejestracja</h2>
			{validationErrors.length > 0 && (
				<div className="validation-errors">
					{validationErrors.map((err, index) => (
						<p key={index} className="error">
							{err}
						</p>
					))}
				</div>
			)}
			<form onSubmit={handleSubmit} className="registration-form">
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
				<input
					type="text"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					placeholder="Numer telefonu"
					required
				/>
				<button type="submit">Zarejestruj</button>
			</form>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default Register;
