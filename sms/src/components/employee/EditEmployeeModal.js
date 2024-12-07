import React, { useState } from "react";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/employee/EditEmployeeModal.css";

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
	const [formData, setFormData] = useState({
		firstName: employee.employeeProfile.firstName,
		lastName: employee.employeeProfile.lastName,
		email: employee.employeeProfile.email,
		phoneNumber: employee.employeeProfile.phoneNumber,
		position: employee.employee.position,
		color: employee.employee.color,
		hireDate: employee.employee.hireDate,
		dateOfBirth: employee.employeeProfile.dateOfBirth,
	});
	const [error, setError] = useState("");

	const positions = ["Manager", "Assistant", "Cleaner"];
	const colors = [
		{ name: "Blue", value: "#0000FF" },
		{ name: "Red", value: "#FF0000" },
		{ name: "Green", value: "#00FF00" },
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveChanges = async () => {
		try {
			await Api.put(
				`${config.apiUrl}employee/${employee.employee.id}`,
				{
					employeeProfile: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						phoneNumber: formData.phoneNumber,
						dateOfBirth: formData.dateOfBirth,
					},
					employee: {
						position: formData.position,
						color: formData.color,
						hireDate: formData.hireDate,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			onClose();
			onSave();
		} catch (error) {
			console.error(error);
			setError("Nie udało się zapisać zmian.");
		}
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h3>Edytuj Pracownika</h3>
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
					Stanowisko:
					<select
						name="position"
						value={formData.position}
						onChange={handleInputChange}
					>
						{positions.map((position) => (
							<option key={position} value={position}>
								{position}
							</option>
						))}
					</select>
				</label>
				<label>
					Preferowany kolor:
					<select
						name="color"
						value={formData.color}
						onChange={(e) => {
							const selectedColor = colors.find(
								(c) => c.name === e.target.value
							);
							setFormData((prev) => ({
								...prev,
								color: selectedColor.value,
							}));
						}}
					>
						{colors.map((color) => (
							<option key={color.value} value={color.name}>
								{color.name}
							</option>
						))}
					</select>
				</label>
				<label>
					Data zatrudnienia:
					<input
						type="date"
						name="hireDate"
						value={formData.hireDate}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Data urodzenia:
					<input
						type="date"
						name="dateOfBirth"
						value={formData.dateOfBirth}
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

export default EditEmployeeModal;
