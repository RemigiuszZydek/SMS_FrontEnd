import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import AssignEmployeeModal from "./AssignEmployeeModal";
import RemoveEmployeeModal from "./RemoveEmployeeModal";
import "../../styles/components/services/ServiceDetailModal.css";

const ServiceDetailsModal = ({ serviceId, salonId, onClose, onUpdate }) => {
	const [serviceDetails, setServiceDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false); // Nowy tryb do usuwania pracownika
	const [formData, setFormData] = useState({});

	useEffect(() => {
		const fetchServiceDetails = async () => {
			try {
				const response = await Api.get(`${config.apiUrl}service/${serviceId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});
				setServiceDetails(response.data.data);
				setFormData(response.data.data);
				setError("");
			} catch (error) {
				setError("Nie udało się pobrać szczegółów usługi.");
			} finally {
				setLoading(false);
			}
		};

		fetchServiceDetails();
	}, [serviceId]);

	const translateIsActive = (isActive) => {
		return isActive ? "Aktywny" : "Nieaktywny";
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveChanges = async () => {
		const patchData = Object.keys(formData)
			.filter((key) => key !== "id")
			.map((key) => ({
				path: `/${key}`,
				op: "replace",
				value: formData[key],
			}));

		try {
			await Api.patch(`${config.apiUrl}service/${serviceId}`, patchData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});
			setServiceDetails(formData);
			setIsEditing(false);
			onUpdate();
		} catch (error) {
			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Status kod błędu:", error.response.status);
			} else if (error.request) {
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				console.error("Błąd zapytania:", error.message);
			}
			setError("Nie udało się zapisać zmian.");
		}
	};

	if (loading) {
		return (
			<div className="modal">
				<div className="modal-content">
					<p>Ładowanie szczegółów usługi...</p>
					<button onClick={onClose}>&times;</button>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="modal">
				<div className="modal-content">
					<p className="error">{error}</p>
					<button onClick={onClose}>&times;</button>
				</div>
			</div>
		);
	}

	return (
		<div className="modal">
			<div className="modal-content">
				{isEditing ? (
					<>
						<h3>Edytuj Szczegóły Usługi</h3>
						<label>
							Nazwa:
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Kod:
							<input
								type="text"
								name="code"
								value={formData.code}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Opis:
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Cena:
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Podatek:
							<input
								type="number"
								step="0.01"
								name="taxRate"
								value={formData.taxRate}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Czas trwania:
							<input
								type="time"
								name="duration"
								value={formData.duration}
								onChange={handleInputChange}
							/>
						</label>
						<label>
							Zdjęcie URL:
							<input
								type="text"
								name="imgUrl"
								value={formData.imgUrl || ""}
								onChange={handleInputChange}
							/>
						</label>
						<div className="buttons">
							<button onClick={handleSaveChanges}>Zapisz</button>
							<button onClick={() => setIsEditing(false)}>Anuluj</button>
						</div>
					</>
				) : (
					<>
						<h3>Szczegóły Usługi</h3>
						<p>
							<strong>Nazwa:</strong> {serviceDetails.name}
						</p>
						<p>
							<strong>Kod:</strong> {serviceDetails.code}
						</p>
						<p>
							<strong>Opis:</strong> {serviceDetails.description}
						</p>
						<p>
							<strong>Cena:</strong> {serviceDetails.price} PLN
						</p>
						<p>
							<strong>Podatek:</strong> {serviceDetails.taxRate * 100}%
						</p>
						<p>
							<strong>Czas trwania:</strong> {serviceDetails.duration}
						</p>
						<p>
							<strong>Zdjęcie URL:</strong> {serviceDetails.imgUrl || "Brak"}
						</p>
						<p>
							<strong>Status:</strong>{" "}
							{translateIsActive(serviceDetails.isActive)}
						</p>
						<div className="buttons">
							<button onClick={() => setIsEditing(true)}>Edytuj</button>
							<button onClick={() => setIsAssigning(true)}>
								Przypisz pracownika
							</button>
							<button onClick={() => setIsRemoving(true)}>
								Usuń pracownika
							</button>
							<button onClick={onClose}>Zamknij</button>
						</div>
					</>
				)}
				{isAssigning && (
					<AssignEmployeeModal
						serviceId={serviceId}
						salonId={salonId}
						onClose={() => setIsAssigning(false)}
					/>
				)}
				{isRemoving && (
					<RemoveEmployeeModal
						serviceId={serviceId}
						salonId={salonId}
						onClose={() => setIsRemoving(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default ServiceDetailsModal;
