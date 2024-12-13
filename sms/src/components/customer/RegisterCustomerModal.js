import React, { useState } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/customer/RegisterCustomerModal.css";

const RegisterCustomerModal = ({ onClose, onAddCustomer, selectedSalonId }) => {
	const [newCustomer, setNewCustomer] = useState({
		firstName: "",
		lastName: "",
		gender: 0,
		phoneNumber: "",
		email: "",
		notes: "",
	});
	const [error, setError] = useState("");
	const [detailedErrors, setDetailedErrors] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCustomer((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRegisterCustomer = async () => {
		try {
			const response = await Api.post(
				`${config.apiUrl}customer`,
				{
					...newCustomer,
					salonId: selectedSalonId || localStorage.getItem("selectedSalonId"),
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			onAddCustomer(response.data.data);
			setError("");
			setDetailedErrors([]);
			onClose();
		} catch (error) {
			setError(
				error.response?.data?.message || "Nie udało się zarejestrować klienta."
			);
			if (error.response?.data?.errors) {
				setDetailedErrors(
					Object.entries(error.response.data.errors).map(
						([field, messages]) => `${field}: ${messages.join(", ")}`
					)
				);
			} else {
				setDetailedErrors([]);
			}
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Rejestracja Klienta</h3>
				{error && <p className="error">{error}</p>}
				{detailedErrors.length > 0 && (
					<ul className="detailed-errors">
						{detailedErrors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				)}
				<label>
					Imię:
					<input
						type="text"
						name="firstName"
						value={newCustomer.firstName}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Nazwisko:
					<input
						type="text"
						name="lastName"
						value={newCustomer.lastName}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Płeć:
					<select
						name="gender"
						value={newCustomer.gender}
						onChange={(e) =>
							setNewCustomer((prev) => ({
								...prev,
								gender: parseInt(e.target.value),
							}))
						}
					>
						<option value={0}>Mężczyzna</option>
						<option value={1}>Kobieta</option>
					</select>
				</label>
				<label>
					Numer telefonu:
					<input
						type="text"
						name="phoneNumber"
						value={newCustomer.phoneNumber}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Email:
					<input
						type="email"
						name="email"
						value={newCustomer.email}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Notatki:
					<textarea
						name="notes"
						value={newCustomer.notes}
						onChange={handleInputChange}
					/>
				</label>
				<div className="buttons">
					<button onClick={handleRegisterCustomer}>Zarejestruj</button>
					<button onClick={onClose}>Anuluj</button>
				</div>
			</div>
		</div>
	);
};

export default RegisterCustomerModal;
