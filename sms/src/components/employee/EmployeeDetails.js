import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import EditEmployeeModal from "./EditEmployeeModal";
import AssignServiceModal from "./AssignServiceModal";
import ViewServicesModal from "./ViewServicesModal";
import "../../styles/components/employee/EmployeeDetails.css";

const EmployeeDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState(null);
	const location = useLocation();
	const salonId = location.state?.salonId || "";
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [currentModal, setCurrentModal] = useState(null);

	const translateColor = (hex) => {
		const colors = [
			{ name: "Niebieski", value: "#0000FF" },
			{ name: "Czerwony", value: "#FF0000" },
			{ name: "Zielony", value: "#00FF00" },
		];
		const color = colors.find(
			(color) => color.value.toUpperCase() === hex.toUpperCase()
		);
		return color ? color.name : "Nieznany kolor";
	};

	const translateStatus = (statusNumber) => {
		const statuses = [
			{ value: 0, name: "Aktywny" },
			{ value: 1, name: "Nieaktywny" },
			{ value: 2, name: "Urlop" },
			{ value: 3, name: "Zwolniony" },
		];
		const status = statuses.find((status) => status.value === statusNumber);
		return status ? status.name : "Nieznany status";
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
		} finally {
			setLoading(false);
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

	if (loading) {
		return <div className="employee-details-loading">Ładowanie danych...</div>;
	}

	const renderModal = () => {
		switch (currentModal) {
			case "edit":
				return (
					<EditEmployeeModal
						employee={employee}
						onClose={() => setCurrentModal(null)}
						onSave={fetchEmployeeDetails}
					/>
				);
			case "assign":
				return (
					<AssignServiceModal
						employeeId={employee.employee.id}
						salonId={salonId}
						onClose={() => setCurrentModal(null)}
					/>
				);
			case "viewServices":
				return (
					<ViewServicesModal
						employeeId={employee.employee.id}
						onClose={() => setCurrentModal(null)}
					/>
				);
			default:
				return null;
		}
	};

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
				<button onClick={() => setCurrentModal("edit")}>Edytuj</button>
				<button onClick={() => setCurrentModal("assign")}>
					Przypisz usługę
				</button>
				<button onClick={() => setCurrentModal("viewServices")}>
					Wyświetl usługi
				</button>
				<button onClick={() => window.history.back()}>Wróć</button>
			</div>
			{renderModal()}
		</div>
	);
};

export default EmployeeDetails;
