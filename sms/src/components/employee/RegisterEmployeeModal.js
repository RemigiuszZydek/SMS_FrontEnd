import React, { useState } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/RegisterEmployeeModal.css";

const RegisterEmployeeModal = ({ selectedSalonId, onClose, onAddEmployee }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [newUser, setNewUser] = useState({
		email: "",
		phoneNumber: "",
	});
	const [newEmployee, setNewEmployee] = useState({
		firstName: "",
		lastName: "",
		code: "",
		color: "#0000FF", // Domyślny kolor jako hex
		hireDate: "",
		dateOfBirth: "",
		position: "Manager",
		email: "",
		phoneNumber: "",
	});
	const [error, setError] = useState("");
	const [detailedErrors, setDetailedErrors] = useState([]);
	const [userId, setUserId] = useState(null);

	const positions = ["Manager", "Assistant", "Cleaner"];
	const colors = [
		{ name: "Blue", value: "#0000FF" },
		{ name: "Red", value: "#FF0000" },
		{ name: "Green", value: "#00FF00" },
	];

	const handleInputChange = (e, setState) => {
		const { name, value } = e.target;
		setState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRegisterUser = async () => {
		try {
			const userResponse = await Api.post(
				`${config.apiUrl}auth/register-employee`,
				{
					email: newUser.email,
					phoneNumber: newUser.phoneNumber,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			setUserId(userResponse.data.id);
			setError("");
			setDetailedErrors([]);
			setNewEmployee((prev) => ({
				...prev,
				email: newUser.email,
				phoneNumber: newUser.phoneNumber,
			}));
			setCurrentStep(2);
		} catch (error) {
			processError(error, "Nie udało się zarejestrować użytkownika.");
		}
	};

	const handleRegisterEmployee = async () => {
		try {
			const employeeResponse = await Api.post(
				`${config.apiUrl}employee/create`,
				{
					...newEmployee,
					userId: userId,
					salonId: selectedSalonId,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			onAddEmployee(employeeResponse.data.data);
			setError("");
			setDetailedErrors([]);
			onClose();
		} catch (error) {
			processError(error, "Nie udało się zarejestrować pracownika.");
		}
	};

	const processError = (error, defaultMessage) => {
		console.error("Error details:", error);
		if (error.response) {
			const { data, status, headers } = error.response;
			console.group("API Error Response");
			console.log("Status:", status);
			console.log("Headers:", headers);
			console.log("Response Data:", data);
			console.groupEnd();
			setError(data.message || defaultMessage);
			if (data.errors) {
				setDetailedErrors(
					Object.entries(data.errors).map(
						([field, messages]) => `${field}: ${messages.join(", ")}`
					)
				);
			} else {
				setDetailedErrors([]);
			}
		} else if (error.request) {
			console.group("API Error Request");
			console.error("No response received:", error.request);
			console.groupEnd();
			setError("Brak odpowiedzi od serwera.");
			setDetailedErrors([]);
		} else {
			console.group("Unexpected Error");
			console.error("Error Message:", error.message);
			console.groupEnd();
			setError(defaultMessage);
			setDetailedErrors([]);
		}
	};

	const renderStep1 = () => (
		<>
			<h3>Rejestracja Użytkownika</h3>
			{error && <p className="error">{error}</p>}
			{detailedErrors.length > 0 && (
				<ul className="detailed-errors">
					{detailedErrors.map((err, idx) => (
						<li key={idx}>{err}</li>
					))}
				</ul>
			)}
			<label>
				Email:
				<input
					type="email"
					name="email"
					value={newUser.email}
					onChange={(e) => handleInputChange(e, setNewUser)}
				/>
			</label>
			<label>
				Numer telefonu:
				<input
					type="text"
					name="phoneNumber"
					value={newUser.phoneNumber}
					onChange={(e) => handleInputChange(e, setNewUser)}
				/>
			</label>
			<div className="buttons">
				<button onClick={handleRegisterUser}>Dalej</button>
				<button onClick={onClose}>Anuluj</button>
			</div>
		</>
	);

	const renderStep2 = () => (
		<>
			<h3>Dodaj Pracownika</h3>
			{error && <p className="error">{error}</p>}
			{detailedErrors.length > 0 && (
				<ul className="detailed-errors">
					{detailedErrors.map((err, idx) => (
						<li key={idx}>{err}</li>
					))}
				</ul>
			)}
			<label>
				Imię:
				<input
					type="text"
					name="firstName"
					value={newEmployee.firstName}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				/>
			</label>
			<label>
				Nazwisko:
				<input
					type="text"
					name="lastName"
					value={newEmployee.lastName}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				/>
			</label>
			<label>
				Kod:
				<input
					type="text"
					name="code"
					value={newEmployee.code}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				/>
			</label>
			<label>
				Stanowisko:
				<select
					name="position"
					value={newEmployee.position}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				>
					{positions.map((position) => (
						<option key={position} value={position}>
							{position}
						</option>
					))}
				</select>
			</label>
			<label>
				Preferowany kolor:
				<select
					name="color"
					value={newEmployee.color}
					onChange={(e) => {
						const selectedColor = colors.find((c) => c.name === e.target.value);
						handleInputChange(
							{ target: { name: "color", value: selectedColor.value } },
							setNewEmployee
						);
					}}
				>
					{colors.map((color) => (
						<option key={color.value} value={color.name}>
							{color.name}
						</option>
					))}
				</select>
			</label>
			<label>
				Data zatrudnienia:
				<input
					type="date"
					name="hireDate"
					value={newEmployee.hireDate}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				/>
			</label>
			<label>
				Data urodzenia:
				<input
					type="date"
					name="dateOfBirth"
					value={newEmployee.dateOfBirth}
					onChange={(e) => handleInputChange(e, setNewEmployee)}
				/>
			</label>
			<div className="buttons">
				<button onClick={handleRegisterEmployee}>Zarejestruj</button>
				<button onClick={() => setCurrentStep(1)}>Wróć</button>
			</div>
		</>
	);

	return (
		<div className="modal">
			<div className="modal-content">
				{currentStep === 1 ? renderStep1() : renderStep2()}
			</div>
		</div>
	);
};

export default RegisterEmployeeModal;
