import React, { useState } from "react";

const AvailabilityEditor = ({
	availability,
	onSave,
	onDelete,
	onClose,
	onCopy,
}) => {
	const [editedAvailability, setEditedAvailability] = useState({
		startTime: new Date(availability.start).toTimeString().slice(0, 5), // Pobieramy godzinę w formacie HH:mm
		endTime: new Date(availability.end).toTimeString().slice(0, 5), // Pobieramy godzinę w formacie HH:mm
	});

	// Dodajemy zakres kopiowania
	const [copyRange, setCopyRange] = useState({ start: "", end: "" });

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedAvailability((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRangeChange = (e) => {
		const { name, value } = e.target;
		setCopyRange((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = () => {
		const date = new Date(availability.start).toISOString().split("T")[0]; // Data w formacie YYYY-MM-DD
		const updatedAvailability = {
			start: new Date(`${date}T${editedAvailability.startTime}`),
			end: new Date(`${date}T${editedAvailability.endTime}`),
		};
		onSave({ ...availability, ...updatedAvailability });
		onClose();
	};

	const handleDelete = () => {
		onDelete(availability);
		onClose();
	};

	const handleCopy = () => {
		if (!copyRange.start || !copyRange.end) {
			alert("Proszę wybrać zakres dat, na które chcesz skopiować dostępność.");
			return;
		}

		// Wywołujemy funkcję `onCopy` z zakresem dat i edytowaną dostępnością
		onCopy(copyRange, {
			startTime: editedAvailability.startTime,
			endTime: editedAvailability.endTime,
		});
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
						Godzina początkowa:
						<input
							type="time"
							name="startTime"
							value={editedAvailability.startTime}
							onChange={handleInputChange}
						/>
					</label>
				</div>
				<div style={{ marginBottom: "15px" }}>
					<label>
						Godzina końcowa:
						<input
							type="time"
							name="endTime"
							value={editedAvailability.endTime}
							onChange={handleInputChange}
						/>
					</label>
				</div>
				<div style={{ marginBottom: "15px" }}>
					<h3>Skopiuj dostępność na inne dni</h3>
					<label>
						Data początkowa:
						<input
							type="date"
							name="start"
							value={copyRange.start}
							onChange={handleRangeChange}
						/>
					</label>
					<label style={{ marginLeft: "10px" }}>
						Data końcowa:
						<input
							type="date"
							name="end"
							value={copyRange.end}
							onChange={handleRangeChange}
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
				<button
					onClick={handleCopy}
					style={{ backgroundColor: "#2196F3", color: "white" }}
				>
					Skopiuj
				</button>
				<button onClick={onClose}>Anuluj</button>
			</div>
		</div>
	);
};

export default AvailabilityEditor;
