import React, { useState } from "react";

const AvailabilityEditor = ({ availability, onSave, onDelete, onClose }) => {
	const [editedAvailability, setEditedAvailability] = useState({
		start: availability.start,
		end: availability.end,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedAvailability((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = () => {
		onSave(editedAvailability);
		onClose();
	};

	const handleDelete = () => {
		onDelete(availability);
		onClose();
	};

	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				backgroundColor: "white",
				padding: "20px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
				borderRadius: "8px",
				zIndex: 1000,
			}}
		>
			<h2>Edycja dostępności</h2>
			<form>
				<div style={{ marginBottom: "15px" }}>
					<label>
						Data początkowa:
						<input
							type="datetime-local"
							name="start"
							value={
								editedAvailability.start.toISOString().slice(0, -1) // Format dla input
							}
							onChange={handleInputChange}
						/>
					</label>
				</div>
				<div style={{ marginBottom: "15px" }}>
					<label>
						Data końcowa:
						<input
							type="datetime-local"
							name="end"
							value={
								editedAvailability.end.toISOString().slice(0, -1) // Format dla input
							}
							onChange={handleInputChange}
						/>
					</label>
				</div>
			</form>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<button
					onClick={handleSave}
					style={{ backgroundColor: "#4CAF50", color: "white" }}
				>
					Zapisz
				</button>
				<button
					onClick={handleDelete}
					style={{ backgroundColor: "#f44336", color: "white" }}
				>
					Usuń
				</button>
				<button onClick={onClose}>Anuluj</button>
			</div>
		</div>
	);
};

export default AvailabilityEditor;
