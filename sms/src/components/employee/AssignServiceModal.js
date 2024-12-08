import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/AssignServiceModal.css";

const AssignServiceModal = ({ employeeId, salonId, onClose }) => {
	const [services, setServices] = useState([]);
	const [expanded, setExpanded] = useState(false); // Kontrola rozwijania listy
	const [selectedService, setSelectedService] = useState(null); // Wybrana usługa
	const [error, setError] = useState("");

	useEffect(() => {
		// Logowanie employeeId podczas montowania komponentu
		console.log("Employee ID przekazany do modalu:", employeeId);

		// Pobierz listę usług
		const fetchServices = async () => {
			try {
				console.log(`Fetching services for salonId: ${salonId}`);
				const response = await Api.get(
					`${config.apiUrl}service/?salonId=${salonId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						},
					}
				);
				console.log("Fetched services:", response.data.data);
				setServices(response.data.data || []);
			} catch (error) {
				if (error.response) {
					console.error("Błąd odpowiedzi API:", error.response.data);
					console.error("Status kod błędu:", error.response.status);
				} else if (error.request) {
					console.error("Brak odpowiedzi od serwera:", error.request);
				} else {
					console.error("Błąd zapytania:", error.message);
				}
				setError("Nie udało się pobrać listy usług.");
			}
		};

		fetchServices();
	}, [salonId, employeeId]);

	// Przypisz usługę
	const handleAssignService = async () => {
		if (!selectedService) {
			console.warn("Żadna usługa nie została wybrana.");
			setError("Musisz wybrać usługę.");
			return;
		}

		console.log("Rozpoczęto przypisywanie usługi...");
		console.log("Employee ID:", employeeId); // Logowanie employeeId
		console.log("Selected Service ID:", selectedService.id);
		console.log("Service Data:", selectedService);

		try {
			const response = await Api.post(
				`${config.apiUrl}employee/${employeeId}/services/${selectedService.id}`,
				{ serviceId: selectedService.id },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Usługa została przypisana pomyślnie:", response.data);
			onClose(); // Zamknij modal po przypisaniu
		} catch (error) {
			console.error("Wystąpił błąd podczas przypisywania usługi:");
			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Status kod błędu:", error.response.status);
			} else if (error.request) {
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				console.error("Błąd zapytania:", error.message);
			}
			setError("Nie udało się przypisać usługi.");
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Przypisz usługę</h3>
				{error && <p className="error">{error}</p>}

				<div className="dropdown">
					<div
						className="dropdown-header"
						onClick={() => setExpanded(!expanded)}
					>
						{selectedService ? selectedService.name : "Wybierz usługę"}
						<span className={`dropdown-icon ${expanded ? "open" : ""}`}>
							&#9660;
						</span>
					</div>
					{expanded && (
						<ul className="dropdown-list">
							{services.map((service) => (
								<li
									key={service.id}
									className="dropdown-item"
									onClick={() => {
										console.log(
											`Wybrano usługę: ${service.name} (ID: ${service.id})`
										);
										setSelectedService(service);
										setExpanded(false);
									}}
								>
									{service.name}
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="buttons">
					<button onClick={handleAssignService}>Przypisz</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default AssignServiceModal;
