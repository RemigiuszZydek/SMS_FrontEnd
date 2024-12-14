import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import config from "../../config";
import RegisterCustomerModal from "./RegisterCustomerModal";
import EditCustomerModal from "./EditCustomerModal"; // Import EditCustomerModal
import "../../styles/components/customer/Customers.css";

const Customers = () => {
	const [salons, setSalons] = useState([]);
	const [selectedSalonId, setSelectedSalonId] = useState("");
	const [customers, setCustomers] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Stan modalu edycji
	const [selectedCustomer, setSelectedCustomer] = useState(null); // Wybrany klient
	const [error, setError] = useState("");
	const navigate = useNavigate();

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

	const handleDeleteCustomer = async (customerId) => {
		try {
			await Api.delete(`${config.apiUrl}customer/${customerId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			fetchCustomers();
		} catch (error) {
			handleError(error, "Nie udało się usunąć klienta.");
		}
	};

	const handleError = (error, defaultMessage) => {
		if (error.response) {
			setError(error.response.data.message || defaultMessage);
		} else if (error.request) {
			setError("Brak odpowiedzi od serwera.");
		} else {
			setError(defaultMessage);
		}
	};

	const handleAddCustomer = () => {
		setIsModalOpen(false);
		fetchCustomers();
	};

	const handleCustomerClick = (customer) => {
		setSelectedCustomer(customer); // Ustaw wybranego klienta
		setIsEditModalOpen(true); // Otwórz modal edycji
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
								onClick={() => handleCustomerClick(customer)} // Przekaż klienta do funkcji
							>
								<div className="customer-name">
									<p>
										{customer.firstName} {customer.lastName}
									</p>
									<button
										className="delete-button"
										onClick={(e) => {
											e.stopPropagation();
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
					selectedSalonId={selectedSalonId}
				/>
			)}
			{isEditModalOpen && selectedCustomer && (
				<EditCustomerModal
					customer={selectedCustomer}
					onClose={() => setIsEditModalOpen(false)}
					onSave={fetchCustomers} // Odśwież listę klientów po zapisaniu
				/>
			)}
		</div>
	);
};

export default Customers;
