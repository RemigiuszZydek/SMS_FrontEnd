import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import RegisterCustomerModal from "./RegisterCustomerModal";
import "../../styles/components/customer/Customers.css";

const Customers = () => {
	const [salons, setSalons] = useState([]); // Lista salonów
	const [selectedSalonId, setSelectedSalonId] = useState(""); // Wybrany salon
	const [customers, setCustomers] = useState([]); // Lista klientów
	const [isModalOpen, setIsModalOpen] = useState(false); // Stan modalu
	const [error, setError] = useState(""); // Obsługa błędów
	const navigate = useNavigate(); // Hook do nawigacji

	// Pobierz listę salonów
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

	// Pobierz listę klientów
	const fetchCustomers = async () => {
		if (!selectedSalonId) return;
		try {
			const response = await Api.get(
				`${config.apiUrl}customer/salon/${selectedSalonId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			setCustomers(response.data.data || []);
		} catch (error) {
			handleError(error, "Błąd podczas pobierania listy klientów.");
		}
	};

	useEffect(() => {
		fetchSalons();
	}, []);

	useEffect(() => {
		fetchCustomers();
	}, [selectedSalonId]);

	// Usuń klienta
	const handleDeleteCustomer = async (customerId) => {
		try {
			await Api.delete(`${config.apiUrl}customer/${customerId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			fetchCustomers(); // Odśwież listę klientów
		} catch (error) {
			handleError(error, "Nie udało się usunąć klienta.");
		}
	};

	// Obsługa błędów API
	const handleError = (error, defaultMessage) => {
		if (error.response) {
			setError(error.response.data.message || defaultMessage);
		} else if (error.request) {
			setError("Brak odpowiedzi od serwera.");
		} else {
			setError(defaultMessage);
		}
	};

	// Dodaj nowego klienta
	const handleAddCustomer = (newCustomer) => {
		setIsModalOpen(false);
		fetchCustomers();
	};

	// Obsługa kliknięcia w klienta
	const handleCustomerClick = (customerId) => {
		navigate(`/customer/${customerId}`); // Przekierowanie do szczegółów klienta
	};

	return (
		<div className="customer-list-container">
			<h2>Klienci</h2>
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
					<ul>
						{customers.map((customer) => (
							<li
								key={customer.id}
								className="customer-item"
								onClick={() => handleCustomerClick(customer.id)} // Obsługa kliknięcia w klienta
							>
								<div className="customer-name">
									<p>
										{customer.firstName} {customer.lastName}
									</p>
									<button
										className="delete-button"
										onClick={(e) => {
											e.stopPropagation(); // Zapobiegaj propagacji kliknięcia
											handleDeleteCustomer(customer.id);
										}}
									>
										&times;
									</button>
								</div>
							</li>
						))}
					</ul>
					<button onClick={() => setIsModalOpen(true)}>Dodaj Klienta</button>
				</>
			)}
			{isModalOpen && (
				<RegisterCustomerModal
					onClose={() => setIsModalOpen(false)}
					onAddCustomer={handleAddCustomer}
					selectedSalonId={selectedSalonId} // Przekazanie salonId do modalu
				/>
			)}
		</div>
	);
};

export default Customers;
