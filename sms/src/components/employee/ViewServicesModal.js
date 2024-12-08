import React, { useEffect, useState } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/ViewServicesModal.css";

const ViewServicesModal = ({ employeeId, onClose }) => {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchServices = async () => {
		try {
			console.log(`Fetching services for employeeId: ${employeeId}`);
			const response = await Api.get(
				`${config.apiUrl}employee/${employeeId}/services`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			console.log("Fetched services:", response.data.data);
			setServices(response.data.data || []);
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
			setError("Nie udało się pobrać usług.");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveService = async (serviceId) => {
		try {
			console.log(
				`Removing service with ID: ${serviceId} for employee: ${employeeId}`
			);
			await Api.delete(
				`${config.apiUrl}employee/${employeeId}/services/${serviceId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			setServices((prevServices) =>
				prevServices.filter((service) => service.id !== serviceId)
			);
			console.log("Service removed successfully.");
		} catch (error) {
			console.error("Error removing service:");
			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Status kod błędu:", error.response.status);
			} else if (error.request) {
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				console.error("Błąd zapytania:", error.message);
			}
			setError("Nie udało się usunąć usługi.");
		}
	};

	useEffect(() => {
		fetchServices();
	}, [employeeId]);

	if (loading) {
		return (
			<div className="modal">
				<div className="modal-content">
					<p>Ładowanie usług...</p>
					<button onClick={onClose}>&times;</button>
				</div>
			</div>
		);
	}

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Usługi przypisane do pracownika</h3>
				{error && <p className="error">{error}</p>}
				<ul className="service-list">
					{services.map((service) => (
						<li key={service.id} className="service-item">
							<span className="service-name">{service.name}</span>
							<button
								className="remove-button"
								onClick={() => handleRemoveService(service.id)}
								aria-label="Usuń usługę"
							>
								&times;
							</button>
						</li>
					))}
				</ul>
				<div className="buttons">
					<button onClick={onClose}>Zamknij</button>
				</div>
			</div>
		</div>
	);
};

export default ViewServicesModal;
