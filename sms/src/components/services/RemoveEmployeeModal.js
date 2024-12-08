import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/services/RemoveEmployeeModal.css";

const RemoveEmployeeModal = ({ serviceId, salonId, onClose }) => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null); // Wybrany pracownik do usunięcia
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(false); // Kontrola dropdown listy

	// Pobranie przypisanych pracowników
	const fetchAssignedEmployees = async () => {
		try {
			const response = await Api.get(
				`${config.apiUrl}service/${serviceId}/employees`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			setEmployees(response.data.data || []);
			setError("");
		} catch (error) {
			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Status kod błędu:", error.response.status);
			} else if (error.request) {
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				console.error("Błąd zapytania:", error.message);
			}
			setError("Nie udało się pobrać listy przypisanych pracowników.");
		} finally {
			setLoading(false);
		}
	};

	// Usuń przypisanego pracownika
	const handleRemoveEmployee = async () => {
		if (!selectedEmployee) {
			setError("Musisz wybrać pracownika do usunięcia.");
			return;
		}

		try {
			const response = await Api.delete(
				`${config.apiUrl}employee/${selectedEmployee.id}/services/${serviceId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			console.log("Pracownik został usunięty pomyślnie:", response.data);
			onClose(); // Zamknij modal po usunięciu
		} catch (error) {
			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Status kod błędu:", error.response.status);
			} else if (error.request) {
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				console.error("Błąd zapytania:", error.message);
			}
			setError("Nie udało się usunąć pracownika.");
		}
	};

	useEffect(() => {
		fetchAssignedEmployees();
	}, [serviceId]);

	if (loading) {
		return (
			<div className="modal">
				<div className="modal-content">
					<p>Ładowanie przypisanych pracowników...</p>
					<button onClick={onClose}>&times;</button>
				</div>
			</div>
		);
	}

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Usuń przypisanego pracownika</h3>
				{error && <p className="error">{error}</p>}
				<div className="dropdown">
					<div
						className="dropdown-header"
						onClick={() => setExpanded(!expanded)}
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
					<button onClick={handleRemoveEmployee}>Usuń</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default RemoveEmployeeModal;
