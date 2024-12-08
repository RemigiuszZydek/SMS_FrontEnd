import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/services/Services.css";
import CreateServiceModal from "./CreateServiceModal";
import ServiceDetailsModal from "./ServiceDetailModal";

const Services = () => {
	const [salons, setSalons] = useState([]);
	const [selectedSalonId, setSelectedSalonId] = useState("");
	const [services, setServices] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedServiceId, setSelectedServiceId] = useState(null); // Używamy tylko ID usługi
	const [error, setError] = useState("");

	// Pobranie listy salonów
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

	// Pobranie listy usług
	const fetchServices = async () => {
		if (!selectedSalonId) {
			setError("Wybierz salon, aby pobrać usługi.");
			return;
		}
		try {
			const url = new URL(`${config.apiUrl}service/`);
			url.searchParams.append("salonId", selectedSalonId);

			const response = await Api.get(url.toString(), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setServices(response.data.data || []);
			setError("");
		} catch (error) {
			handleError(error, "Błąd podczas pobierania listy usług.");
		}
	};

	// Pobierz dane salonów przy montowaniu komponentu
	useEffect(() => {
		fetchSalons();
	}, []);

	// Pobierz usługi po zmianie wybranego salonu
	useEffect(() => {
		fetchServices();
	}, [selectedSalonId]);

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

	// Tworzenie nowej usługi
	const handleCreateService = async (newService) => {
		try {
			await Api.post(`${config.apiUrl}service/create`, newService, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});
			setIsModalOpen(false);
			fetchServices();
		} catch (error) {
			handleError(error, "Nie udało się stworzyć usługi.");
		}
	};

	// Usunięcie usługi
	const handleDeleteService = async (serviceId) => {
		try {
			await Api.delete(`${config.apiUrl}service/${serviceId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			fetchServices();
		} catch (error) {
			handleError(error, "Nie udało się usunąć usługi.");
		}
	};

	// Kliknięcie usługi
	const handleServiceClick = (serviceId) => {
		setSelectedServiceId(serviceId); // Przechowujemy ID usługi
	};

	// Zamknięcie modalu szczegółów
	const closeServiceModal = () => {
		setSelectedServiceId(null); // Resetujemy ID usługi
	};

	return (
		<div className="services-container">
			<h2>Usługi</h2>
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
					<ul className="services-list">
						{services.map((service) => (
							<li key={service.id} className="service-item">
								<span
									className="delete-button"
									onClick={(e) => {
										e.stopPropagation(); // Zapobiega otwarciu modalu po kliknięciu przycisku usuwania
										handleDeleteService(service.id);
									}}
								>
									&times;
								</span>
								<div onClick={() => handleServiceClick(service.id)}>
									<h3>{service.name}</h3>
									<p>Kod: {service.code}</p>
								</div>
							</li>
						))}
					</ul>
					<button onClick={() => setIsModalOpen(true)}>Dodaj Usługę</button>
				</>
			)}
			{isModalOpen && (
				<CreateServiceModal
					salonId={selectedSalonId}
					onClose={() => setIsModalOpen(false)}
					onCreate={handleCreateService}
				/>
			)}
			{selectedServiceId && (
				<ServiceDetailsModal
					serviceId={selectedServiceId}
					salonId={selectedSalonId}
					onClose={closeServiceModal}
					onUpdate={fetchServices}
				/>
			)}
		</div>
	);
};

export default Services;
