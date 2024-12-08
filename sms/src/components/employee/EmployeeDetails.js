import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import EditEmployeeModal from "./EditEmployeeModal";
import AssignServiceModal from "./AssignServiceModal";
import ViewServicesModal from "./ViewServicesModal"; // Import nowego modalu
import "../../styles/components/employee/EmployeeDetails.css";

const EmployeeDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const location = useLocation();
	const salonId = location.state?.salonId || "";
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [isViewingServices, setIsViewingServices] = useState(false); // Nowy stan dla modalu

	const translateColor = (hex) => {
		const colors = [
			{ name: "Blue", value: "#0000FF" },
			{ name: "Red", value: "#FF0000" },
			{ name: "Green", value: "#00FF00" },
		];

		const color = colors.find(
			(color) => color.value.toUpperCase() === hex.toUpperCase()
		);
		return color ? color.name : "Unknown Color";
	};

	const translateStatus = (statusNumber) => {
		const statuses = [
			{ value: 0, name: "Aktywny" },
			{ value: 1, name: "Nie aktywny" },
			{ value: 2, name: "Urlop" },
			{ value: 3, name: "Zwolniony" },
		];

		const status = statuses.find((status) => status.value === statusNumber);
		return status ? status.name : "Unknown Status";
	};

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
					<strong>Kolor:</strong> {translateColor(employee.employee.color)}
				</p>
				<p>
					<strong>Data zatrudnienia:</strong> {employee.employee.hireDate}
				</p>
				<p>
					<strong>Data urodzenia:</strong>{" "}
					{employee.employeeProfile.dateOfBirth}
				</p>
				<p>
					<strong>Status:</strong>{" "}
					{translateStatus(employee.employee.employmentStatus)}
				</p>
			</div>
			<div className="buttons">
				<button onClick={() => setIsEditing(true)}>Edytuj</button>
				<button onClick={() => setIsAssigning(true)}>Przypisz usługę</button>
				<button onClick={() => setIsViewingServices(true)}>
					Wyświetl usługi
				</button>{" "}
				{/* Nowy przycisk */}
				<button onClick={() => window.history.back()}>Wróć</button>
			</div>
			{isEditing && (
				<EditEmployeeModal
					employee={employee}
					onClose={() => setIsEditing(false)}
					onSave={fetchEmployeeDetails}
				/>
			)}
			{isAssigning && (
				<AssignServiceModal
					employeeId={employee.employee.id}
					salonId={salonId}
					onClose={() => setIsAssigning(false)}
				/>
			)}
			{isViewingServices && (
				<ViewServicesModal
					employeeId={employee.employee.id} // Przekazanie ID pracownika
					onClose={() => setIsViewingServices(false)}
				/>
			)}
		</div>
	);
};

export default EmployeeDetails;
