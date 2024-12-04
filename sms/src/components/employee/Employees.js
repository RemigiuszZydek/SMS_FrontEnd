import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/Employees.css";

const Employees = () => {
	const [salons, setSalons] = useState([]); // Lista salonów
	const [selectedSalonId, setSelectedSalonId] = useState(""); // Wybrany salon
	const [employees, setEmployees] = useState([]); // Lista pracowników
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newEmployee, setNewEmployee] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		code: "",
		color: "Blue", // Domyślny kolor
		hireDate: "",
		dateOfBirth: "", // Dodane pole daty urodzenia
		position: "Manager", // Domyślne stanowisko
	});
	const [error, setError] = useState("");

	// Hardcoded values for Position and Color
	const positions = ["Manager", "Assistant", "Cleaner"];
	const colors = [
		{ name: "Blue", value: "#0000FF" },
		{ name: "Red", value: "#FF0000" },
		{ name: "Green", value: "#00FF00" },
	];

	// Pobranie listy salonów przy załadowaniu komponentu
	useEffect(() => {
		const fetchSalons = async () => {
			try {
				console.log("Fetching salons...");
				const response = await Api.get(`${config.apiUrl}salon/list`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});
				console.log("Salons fetched successfully:", response.data);
				setSalons(response.data.data || []); // Zapisz listę salonów
			} catch (error) {
				handleError(error, "Błąd podczas pobierania listy salonów.");
			}
		};
		fetchSalons();
	}, []);

	// Pobranie pracowników dla wybranego salonu
	useEffect(() => {
		if (!selectedSalonId) return;

		const fetchEmployees = async () => {
			try {
				console.log(`Fetching employees for salonId: ${selectedSalonId}`);

				// Tworzenie poprawnego URL z parametrami
				const url = new URL(`${config.apiUrl}employee/get-all`);
				url.searchParams.append("salonId", selectedSalonId);

				// Log URL przed wysłaniem żądania
				console.log("Request URL:", url.toString());

				const response = await Api.get(url.toString(), {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});

				// Log odpowiedzi
				console.log("API Response:", response.data);

				if (response.data && response.data.data) {
					setEmployees(response.data.data);
					console.log(response.data.data);
				} else {
					console.warn("No employees data found in the response.");
					setEmployees([]); // Ustaw pustą listę, jeśli brak danych
				}
			} catch (error) {
				handleError(error, "Błąd podczas pobierania listy pracowników.");
			}
		};

		fetchEmployees();
	}, [selectedSalonId]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		// Jeśli zmieniany jest kolor, ustaw jego wartość HEX zamiast nazwy
		if (name === "color") {
			const selectedColor = colors.find((color) => color.name === value);
			setNewEmployee((prev) => ({
				...prev,
				[name]: selectedColor ? selectedColor.value : value,
			}));
		} else {
			setNewEmployee((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleRegisterEmployee = async () => {
		console.log("Attempting to register employee:", newEmployee);

		try {
			// Krok 1: Rejestracja użytkownika
			const userResponse = await Api.post(
				`${config.apiUrl}auth/register-employee`,
				{
					email: newEmployee.email,
					phoneNumber: newEmployee.phoneNumber,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("User registered successfully:", userResponse.data);

			// Pobierz userId z odpowiedzi
			const userIdFromResponse = userResponse.data.id;

			// Krok 2: Tworzenie pracownika
			const employeeResponse = await Api.post(
				`${config.apiUrl}employee/create`,
				{
					firstName: newEmployee.firstName,
					lastName: newEmployee.lastName,
					email: newEmployee.email,
					phoneNumber: newEmployee.phoneNumber,
					code: newEmployee.code,
					color: newEmployee.color,
					hireDate: newEmployee.hireDate,
					dateOfBirth: newEmployee.dateOfBirth, // Przekazanie daty urodzenia
					position: newEmployee.position,
					userId: userIdFromResponse, // Użyj userId z poprzedniego kroku
					salonId: selectedSalonId, // Użyj wybranego salonu
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Employee created successfully:", employeeResponse.data);

			// Aktualizacja listy pracowników
			setEmployees((prev) => [...prev, employeeResponse.data.data]);

			// Resetowanie formularza i zamknięcie modalu
			setNewEmployee({
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				code: "",
				color: "Blue",
				hireDate: "",
				dateOfBirth: "", // Reset daty urodzenia
				position: "Manager",
			});
			setIsModalOpen(false);
		} catch (error) {
			handleError(error, "Nie udało się zarejestrować pracownika.");
		}
	};

	const handleError = (error, defaultMessage) => {
		if (error.response) {
			console.error("API Error - Response:", error.response.data);
			console.error("Status Code:", error.response.status);
			console.error("Headers:", error.response.headers);

			// Log szczegółowych informacji
			if (error.response.data.message) {
				console.error("Error Message:", error.response.data.message);
			}
			if (error.response.data.errors) {
				console.error("Validation Errors:", error.response.data.errors);
			}

			setError(error.response.data.message || defaultMessage);
		} else if (error.request) {
			console.error("API Error - No response:", error.request);
			setError("Brak odpowiedzi od serwera.");
		} else {
			console.error("Unexpected error:", error.message);
			setError(defaultMessage);
		}
	};
	return (
		<div className="employee-list-container">
			<h2>Pracownicy</h2>

			{/* Wybór salonu */}
			<label>
				Wybierz salon:
				<select
					name="salonId"
					value={selectedSalonId}
					onChange={(e) => setSelectedSalonId(e.target.value)}
				>
					<option value="">Wybierz salon</option>
					{salons.map((salon) => (
						<option key={salon.id} value={salon.id}>
							{salon.name}
						</option>
					))}
				</select>
			</label>

			{/* Lista pracowników */}
			{selectedSalonId && (
				<>
					{error && <p className="error">{error}</p>}
					<ul>
						{employees.map((employee) => (
							<li key={employee.id} className="employee-item">
								<p>
									{employee.firstName} {employee.lastName}
								</p>
							</li>
						))}
					</ul>
					<button onClick={() => setIsModalOpen(true)}>Dodaj Pracownika</button>
				</>
			)}

			{/* Modal do dodawania pracownika */}
			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<h3>Dodaj Pracownika</h3>
						{error && <p className="error">{error}</p>}
						<label>
							Imię:
							<input
								type="text"
								name="firstName"
								value={newEmployee.firstName}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Nazwisko:
							<input
								type="text"
								name="lastName"
								value={newEmployee.lastName}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Email:
							<input
								type="email"
								name="email"
								value={newEmployee.email}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Numer telefonu:
							<input
								type="text"
								name="phoneNumber"
								value={newEmployee.phoneNumber}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Kod:
							<input
								type="text"
								name="code"
								value={newEmployee.code}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Stanowisko:
							<select
								name="position"
								value={newEmployee.position}
								onChange={handleInputChange}
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
								onChange={handleInputChange}
							>
								{colors.map((color) => (
									<option key={color.value} value={color.value}>
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
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Data urodzenia:
							<input
								type="date"
								name="dateOfBirth"
								value={newEmployee.dateOfBirth}
								onChange={handleInputChange}
							/>
						</label>
						<div className="buttons">
							<button onClick={handleRegisterEmployee}>Zarejestruj</button>
							<button onClick={() => setIsModalOpen(false)}>Anuluj</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Employees;
