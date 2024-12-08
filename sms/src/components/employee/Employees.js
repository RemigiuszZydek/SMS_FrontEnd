import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import do nawigacji
import Api from "../../api/Api";
import config from "../../config";
import RegisterEmployeeModal from "./RegisterEmployeeModal";
import "../../styles/components/employee/Employees.css";

const Employees = () => {
	const [salons, setSalons] = useState([]);
	const [selectedSalonId, setSelectedSalonId] = useState("");
	const [employees, setEmployees] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate(); // Hook do nawigacji

	// Fetch salon list on component mount
	const fetchSalons = async () => {
		try {
			const response = await Api.get(`${config.apiUrl}salon/list`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setSalons(response.data.data || []);
		} catch (error) {
			handleError(error, "Błąd podczas pobierania listy salonów.");
		}
	};

	// Fetch employees when a salon is selected
	const fetchEmployees = async () => {
		if (!selectedSalonId) return;
		try {
			const url = new URL(`${config.apiUrl}employee/get-all`);
			url.searchParams.append("salonId", selectedSalonId);

			const response = await Api.get(url.toString(), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setEmployees(response.data.data || []);
		} catch (error) {
			handleError(error, "Błąd podczas pobierania listy pracowników.");
		}
	};

	useEffect(() => {
		fetchSalons();
	}, []);

	useEffect(() => {
		fetchEmployees();
	}, [selectedSalonId]);

	// Delete an employee
	const handleDeleteEmployee = async (employeeId) => {
		try {
			await Api.delete(`${config.apiUrl}employee/${employeeId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			fetchEmployees();
		} catch (error) {
			handleError(error, "Nie udało się usunąć pracownika.");
		}
	};

	// Handle API errors
	const handleError = (error, defaultMessage) => {
		if (error.response) {
			setError(error.response.data.message || defaultMessage);
		} else if (error.request) {
			setError("Brak odpowiedzi od serwera.");
		} else {
			setError(defaultMessage);
		}
	};

	// Add a new employee to the list
	const handleAddEmployee = (newEmployee) => {
		setIsModalOpen(false);
		fetchEmployees();
	};

	// Handle employee click
	const handleEmployeeClick = (employeeId) => {
		navigate(`/employee/${employeeId}`, {
			state: { salonId: selectedSalonId },
		}); // Przekierowanie do strony pracownika
	};

	return (
		<div className="employee-list-container">
			<h2>Pracownicy</h2>
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
			{selectedSalonId && (
				<>
					{error && <p className="error">{error}</p>}
					<ul>
						{employees.map((employee) => (
							<li
								key={employee.id}
								className="employee-item"
								onClick={() => handleEmployeeClick(employee.id)} // Obsługa kliknięcia
							>
								<div className="employee-name">
									<p>
										{employee.firstName} {employee.lastName}
									</p>
									<button
										className="delete-button"
										onClick={(e) => {
											e.stopPropagation(); // Zapobiegaj propagacji kliknięcia
											handleDeleteEmployee(employee.id);
										}}
									>
										&times;
									</button>
								</div>
							</li>
						))}
					</ul>
					<button onClick={() => setIsModalOpen(true)}>Dodaj Pracownika</button>
				</>
			)}
			{isModalOpen && (
				<RegisterEmployeeModal
					selectedSalonId={selectedSalonId}
					onClose={() => setIsModalOpen(false)}
					onAddEmployee={handleAddEmployee}
				/>
			)}
		</div>
	);
};

export default Employees;
