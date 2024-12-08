import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/services/AssignEmployeeModal.css";

const AssignEmployeeModal = ({ serviceId, salonId, onClose }) => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null); // Wybrany pracownik
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(false); // Kontrola dropdown listy

	// Pobranie listy pracowników
	const fetchEmployees = async () => {
		try {
			console.log(`Fetching employees for salonId: ${salonId}`);
			const response = await Api.get(
				`${config.apiUrl}employee/get-all?salonId=${salonId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			console.log("Fetched employees:", response.data.data);
			setEmployees(response.data.data || []);
			setError("");
		} catch (error) {
			if (error.response) {
				console.error("API response error:", error.response.data);
				console.error("API response status:", error.response.status);
			} else if (error.request) {
				console.error("No response received from server:", error.request);
			} else {
				console.error("Error during request:", error.message);
			}
			setError("Nie udało się pobrać listy pracowników.");
		} finally {
			console.log("Finished fetching employees.");
			setLoading(false);
		}
	};

	// Przypisz usługę do pracownika
	const handleAssignEmployee = async () => {
		if (!selectedEmployee) {
			console.warn("No employee selected.");
			setError("Musisz wybrać pracownika.");
			return;
		}

		console.log("Starting service assignment...");
		console.log(`Service ID: ${serviceId}`);
		console.log(`Selected Employee:`, selectedEmployee);

		try {
			const response = await Api.post(
				`${config.apiUrl}employee/${selectedEmployee.id}/services/${serviceId}`,
				null,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Service successfully assigned to employee:", response.data);
			onClose(); // Zamknij modal po przypisaniu
		} catch (error) {
			console.error("Error during service assignment:");
			if (error.response) {
				console.error("API response error:", error.response.data);
				console.error("API response status:", error.response.status);
			} else if (error.request) {
				console.error("No response received from server:", error.request);
			} else {
				console.error("Error during request:", error.message);
			}
			setError("Nie udało się przypisać pracownika.");
		} finally {
			console.log("Finished service assignment attempt.");
		}
	};

	useEffect(() => {
		console.log("Modal mounted. Fetching employees...");
		fetchEmployees();
	}, [salonId]);

	if (loading) {
		return (
			<div className="modal">
				<div className="modal-content">
					<p>Ładowanie listy pracowników...</p>
					<button onClick={onClose}>&times;</button>
				</div>
			</div>
		);
	}

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Przypisz pracownika</h3>
				{error && <p className="error">{error}</p>}
				<div className="dropdown">
					<div
						className="dropdown-header"
						onClick={() => {
							console.log("Dropdown toggled:", !expanded);
							setExpanded(!expanded);
						}}
					>
						{selectedEmployee
							? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
							: "Wybierz pracownika"}
						<span className={`dropdown-icon ${expanded ? "open" : ""}`}>
							&#9660;
						</span>
					</div>
					{expanded && (
						<ul className="dropdown-list">
							{employees.map((employee) => (
								<li
									key={employee.id}
									className="dropdown-item"
									onClick={() => {
										console.log(
											`Employee selected: ${employee.firstName} ${employee.lastName} (ID: ${employee.id})`
										);
										setSelectedEmployee(employee);
										setExpanded(false);
									}}
								>
									{employee.firstName} {employee.lastName}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="buttons">
					<button onClick={handleAssignEmployee}>Przypisz</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default AssignEmployeeModal;
