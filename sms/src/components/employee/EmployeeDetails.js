import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import EditEmployeeModal from "./EditEmployeeModal";
import "../../styles/components/employee/EmployeeDetails.css";

const EmployeeDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	// Pobranie szczegółów pracownika
	const fetchEmployeeDetails = async () => {
		try {
			const response = await Api.get(`${config.apiUrl}employee/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setEmployee(response.data.data);
		} catch (error) {
			handleError(error, "Nie udało się pobrać danych pracownika.");
		}
	};

	// Obsługa błędów
	const handleError = (error, defaultMessage) => {
		if (error.response) {
			setError(error.response.data.message || defaultMessage);
		} else if (error.request) {
			setError("Brak odpowiedzi od serwera.");
		} else {
			setError(defaultMessage);
		}
	};

	useEffect(() => {
		fetchEmployeeDetails();
	}, [id]);

	if (error) {
		return <div className="employee-details-error">{error}</div>;
	}

	if (!employee) {
		return <div className="employee-details-loading">Ładowanie danych...</div>;
	}

	return (
		<div className="employee-details-container">
			<h2>Szczegóły Pracownika</h2>
			<div className="employee-details">
				<p>
					<strong>Imię:</strong> {employee.employeeProfile.firstName}
				</p>
				<p>
					<strong>Nazwisko:</strong> {employee.employeeProfile.lastName}
				</p>
				<p>
					<strong>Email:</strong> {employee.employeeProfile.email}
				</p>
				<p>
					<strong>Telefon:</strong> {employee.employeeProfile.phoneNumber}
				</p>
				<p>
					<strong>Stanowisko:</strong> {employee.employee.position}
				</p>
				<p>
					<strong>Kolor:</strong> {employee.employee.color}
				</p>
				<p>
					<strong>Data zatrudnienia:</strong> {employee.employee.hireDate}
				</p>
				<p>
					<strong>Data urodzenia:</strong>{" "}
					{employee.employeeProfile.dateOfBirth}
				</p>
			</div>
			<div className="buttons">
				<button onClick={() => setIsEditing(true)}>Edytuj</button>
				<button onClick={() => window.history.back()}>Wróć</button>
			</div>
			{isEditing && (
				<EditEmployeeModal
					employee={employee}
					onClose={() => setIsEditing(false)}
					onSave={fetchEmployeeDetails} // Odśwież dane po zapisaniu
				/>
			)}
		</div>
	);
};

export default EmployeeDetails;
