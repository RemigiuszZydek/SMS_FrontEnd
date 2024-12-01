import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/Employees.css";

const Employees = () => {
	const [employees, setEmployees] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newEmployee, setNewEmployee] = useState({
		email: "",
		phoneNumber: "",
	});
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				console.log("Fetching employees...");
				const response = await Api.get(
					`${config.apiUrl}salon/{salonId}/employees`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						},
					}
				);
				console.log("Employees fetched successfully:", response.data);
				setEmployees(response.data.data);
			} catch (error) {
				if (error.response) {
					// Logowanie szczegółów odpowiedzi serwera
					console.error(
						"Error fetching employees - Response:",
						error.response.data
					);
					console.error("Status:", error.response.status);
					console.error("Headers:", error.response.headers);
					setError("Błąd podczas pobierania listy pracowników.");
				} else if (error.request) {
					// Brak odpowiedzi od serwera
					console.error(
						"Error fetching employees - No response:",
						error.request
					);
					setError(
						"Brak odpowiedzi od serwera podczas pobierania listy pracowników."
					);
				} else {
					// Inny problem
					console.error("Error fetching employees - Message:", error.message);
					setError("Nieoczekiwany błąd podczas pobierania listy pracowników.");
				}
			}
		};
		fetchEmployees();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewEmployee((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRegisterEmployee = async () => {
		console.log("Attempting to register employee:", newEmployee);
		try {
			const response = await Api.post(
				`${config.apiUrl}auth/register-employee`,
				newEmployee,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Employee registered successfully:", response.data);
			setEmployees((prev) => [...prev, response.data.data]);
			setIsModalOpen(false); // Zamknij okno po sukcesie
			setNewEmployee({ email: "", phoneNumber: "" }); // Wyczyść formularz
		} catch (error) {
			if (error.response) {
				// Logowanie szczegółów odpowiedzi serwera
				console.error(
					"Error registering employee - Response:",
					error.response.data
				);
				console.error("Status:", error.response.status);
				console.error("Headers:", error.response.headers);
				setError(`Błąd: ${error.response.data.message}`);
			} else if (error.request) {
				// Brak odpowiedzi od serwera
				console.error(
					"Error registering employee - No response:",
					error.request
				);
				setError("Brak odpowiedzi od serwera podczas rejestracji pracownika.");
			} else {
				// Inny problem
				console.error("Error registering employee - Message:", error.message);
				setError("Nieoczekiwany błąd podczas rejestracji pracownika.");
			}
		}
	};

	return (
		<div className="employee-list-container">
			<h2>Pracownicy</h2>
			{error && <p className="error">{error}</p>}
			<ul>
				{employees.map((employee) => (
					<li key={employee.id} className="employee-item">
						<p>{employee.email}</p>
					</li>
				))}
			</ul>
			<button onClick={() => setIsModalOpen(true)}>Dodaj Pracownika</button>

			{/* Modal do dodawania pracownika */}
			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<h3>Dodaj Pracownika</h3>
						{error && <p className="error">{error}</p>}
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
