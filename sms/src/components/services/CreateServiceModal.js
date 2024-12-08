import React, { useState } from "react";
import "../../styles/components/services/CreateServiceModal.css";

const CreateServiceModal = ({ salonId, onClose, onCreate }) => {
	const [formData, setFormData] = useState({
		salonId,
		name: "",
		code: "",
		description: "",
		price: "",
		taxRate: 0.23,
		duration: "00:30:00",
		imgUrl: null,
	});
	const [error, setError] = useState("");
	const [detailedErrors, setDetailedErrors] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		if (!formData.name || !formData.price || !formData.code) {
			setError("Wszystkie wymagane pola muszą być wypełnione.");
			setDetailedErrors([]);
			return;
		}

		try {
			await onCreate(formData);
			setError("");
			setDetailedErrors([]);
		} catch (err) {
			// Jeśli wystąpi błąd, wyświetl szczegółowe informacje
			if (err.response) {
				setError(err.response.data.message || "Nie udało się stworzyć usługi.");
				if (err.response.data.errors) {
					setDetailedErrors(
						Object.entries(err.response.data.errors).map(
							([field, messages]) => `${field}: ${messages.join(", ")}`
						)
					);
				} else {
					setDetailedErrors([]);
				}
			} else if (err.request) {
				setError("Brak odpowiedzi od serwera.");
				setDetailedErrors([]);
			} else {
				setError("Wystąpił nieoczekiwany błąd.");
				setDetailedErrors([]);
			}
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Dodaj Usługę</h3>
				{error && <p className="error">{error}</p>}
				{detailedErrors.length > 0 && (
					<ul className="detailed-errors">
						{detailedErrors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				)}
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
					<select
						name="taxRate"
						value={formData.taxRate}
						onChange={handleInputChange}
					>
						<option value="0.23">23%</option>
						<option value="0.08">8%</option>
						<option value="0.05">5%</option>
						<option value="0">0%</option>
					</select>
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
					Link do zdjęcia (opcjonalnie):
					<input
						type="text"
						name="imgUrl"
						value={formData.imgUrl || ""}
						onChange={handleInputChange}
					/>
				</label>
				<div className="buttons">
					<button onClick={handleSubmit}>Dodaj</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default CreateServiceModal;
