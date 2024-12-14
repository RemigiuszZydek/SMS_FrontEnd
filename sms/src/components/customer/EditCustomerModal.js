import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/customer/EditCustomerModal.css";

const EditCustomerModal = ({ customer, onClose, onSave }) => {
	// Inicjalizacja formData
	const [formData, setFormData] = useState(() => {
		// Logowanie danych klienta podczas otwierania modalu
		console.log("Pobrane dane klienta:", customer);
		return {
			firstName: customer.firstName,
			lastName: customer.lastName,
			email: customer.email,
			phoneNumber: customer.phoneNumber,
			gender: customer.gender,
			notes: customer.notes || "",
			isActive: 1, // Domyślna wartość aktywności
		};
	});
	const [error, setError] = useState("");

	const genders = [
		{ label: "Mężczyzna", value: 0 },
		{ label: "Kobieta", value: 1 },
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const updatedFormData = {
				...prev,
				[name]: value,
			};
			// Logowanie zmian w danych formularza
			console.log("Aktualizacja formData:", updatedFormData);
			return updatedFormData;
		});
	};

	const handleSaveChanges = async () => {
		try {
			const patchData = [
				{ path: "/firstName", op: "replace", value: formData.firstName || "" },
				{ path: "/lastName", op: "replace", value: formData.lastName || "" },
				{ path: "/email", op: "replace", value: formData.email || "" },
				{
					path: "/phoneNumber",
					op: "replace",
					value: formData.phoneNumber || "",
				},
				{ path: "/gender", op: "replace", value: formData.gender },
				{
					path: "/notes",
					op: "replace",
					value: formData.notes !== null ? formData.notes : "",
				},
				{ path: "/isActive", op: "replace", value: formData.isActive },
			];

			// Logowanie danych wysyłanych do API
			console.log("Dane wysyłane do API:", patchData);

			// Wysyłanie żądania PATCH do API
			const response = await Api.patch(
				`${config.apiUrl}customer/${customer.id}`,
				patchData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			// Logowanie odpowiedzi serwera
			console.log("Odpowiedź serwera:", response.data);

			onSave(); // Odśwież dane nadrzędne
			onClose(); // Zamknij modal
		} catch (error) {
			console.error("Błąd podczas aktualizacji klienta:", error);

			if (error.response) {
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Kod statusu:", error.response.status);
			}

			setError("Nie udało się zapisać zmian.");
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Edytuj Klienta</h3>
				{error && <p className="error">{error}</p>}
				<label>
					Imię:
					<input
						type="text"
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Nazwisko:
					<input
						type="text"
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Email:
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Telefon:
					<input
						type="text"
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Płeć:
					<select
						name="gender"
						value={formData.gender}
						onChange={handleInputChange}
					>
						{genders.map((gender) => (
							<option key={gender.value} value={gender.value}>
								{gender.label}
							</option>
						))}
					</select>
				</label>
				<label>
					Notatki:
					<textarea
						name="notes"
						value={formData.notes}
						onChange={handleInputChange}
					/>
				</label>
				<div className="buttons">
					<button onClick={handleSaveChanges}>Zapisz</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default EditCustomerModal;
