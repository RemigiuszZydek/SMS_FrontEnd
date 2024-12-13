import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Api from "../../api/Api";
import config from "../../config";
import "../../styles/components/calendar/EmployeeScheduleCalendar.css";

const localizer = momentLocalizer(moment);

const EmployeeScheduleCalendar = () => {
	const [salons, setSalons] = useState([]); // Lista salonów
	const [selectedSalonId, setSelectedSalonId] = useState(null); // Wybrany salon
	const [employees, setEmployees] = useState([]); // Lista pracowników
	const [services, setServices] = useState([]); // Lista usług pracownika
	const [events, setEvents] = useState([]); // Wydarzenia w kalendarzu
	const [selectedSlot, setSelectedSlot] = useState(null); // Wybrany slot w kalendarzu
	const [modalOpen, setModalOpen] = useState(false); // Stan modalu
	const [taskDetails, setTaskDetails] = useState({}); // Szczegóły zadania
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false); // Stan ładowania usług

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
			console.error("Błąd pobierania salonów:", error);
			setError("Nie udało się pobrać listy salonów.");
		}
	};

	// Pobierz listę pracowników dla wybranego salonu
	const fetchEmployees = async (salonId) => {
		if (!salonId) return;
		try {
			const response = await Api.get(
				`${config.apiUrl}employee/get-all?salonId=${salonId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			setEmployees(response.data.data || []);
		} catch (error) {
			console.error("Błąd pobierania pracowników:", error);
			setError("Nie udało się pobrać listy pracowników.");
		}
	};

	// Pobierz listę usług dla wybranego pracownika
	const fetchServices = async (employeeId) => {
		setServices([]); // Resetuj listę usług przed pobraniem nowych
		if (!employeeId) return;
		setLoading(true);
		try {
			const response = await Api.get(
				`${config.apiUrl}employee/${employeeId}/services`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);
			setServices(response.data.data || []);
			console.log("Fetched services:", response.data.data); // Debugowanie
		} catch (error) {
			console.error("Błąd pobierania usług:", error);
			setError("Nie udało się pobrać usług.");
		} finally {
			setLoading(false);
		}
	};

	// Obsługa wyboru salonu
	const handleSalonSelect = (salonId) => {
		setSelectedSalonId(salonId);
		fetchEmployees(salonId);
	};

	// Obsługa wyboru slotu
	const handleSelectSlot = (slotInfo) => {
		setSelectedSlot(slotInfo);
		setTaskDetails({
			date: moment(slotInfo.start).format("YYYY-MM-DD"),
			startTime: moment(slotInfo.start).format("HH:mm"),
		});
		setModalOpen(true);
	};

	// Obsługa zapisywania zadania
	const handleSaveTask = async () => {
		try {
			const { startTime, date, serviceDuration, servicePrice, serviceId } =
				taskDetails;
			const endTime = moment(`${date}T${startTime}`)
				.add(moment.duration(serviceDuration))
				.format("YYYY-MM-DDTHH:mm:ss");

			const appointmentData = {
				salonId: selectedSalonId,
				employeeId: taskDetails.employeeId,
				customerId:
					taskDetails.customerId || "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Przykładowy klient
				date: date,
				startTime: `${date}T${startTime}:00.000Z`,
				endTime: `${endTime}.000Z`,
				notes: taskDetails.notes || "",
				services: [
					{
						serviceId: serviceId,
						price: servicePrice,
					},
				],
			};

			console.log(
				"Wysyłanie danych do API:",
				JSON.stringify(appointmentData, null, 2)
			); // Wyloguj dane przed wysłaniem

			// Wyślij dane do API
			const response = await Api.post(
				`${config.apiUrl}appointment`,

				appointmentData,

				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				}
			);

			console.log("Wizyta zapisana pomyślnie:", response.data); // Wyloguj odpowiedź serwera

			// Dodaj wydarzenie do kalendarza
			const newEvent = {
				id: Math.random().toString(36).substr(2, 9),
				title: `${taskDetails.employeeName} - ${taskDetails.serviceName}`,
				start: new Date(`${date}T${startTime}`),
				end: new Date(endTime),
			};
			setEvents((prevEvents) => [...prevEvents, newEvent]);

			setModalOpen(false);
			setSelectedSlot(null);
		} catch (error) {
			console.error("Błąd zapisywania wizyty:", error);

			// Szczegółowe logowanie błędów
			if (error.response) {
				// Błąd odpowiedzi serwera
				console.error("Błąd odpowiedzi API:", error.response.data);
				console.error("Kod statusu:", error.response.status);
				console.error("Nagłówki odpowiedzi:", error.response.headers);
			} else if (error.request) {
				// Brak odpowiedzi od serwera
				console.error("Brak odpowiedzi od serwera:", error.request);
			} else {
				// Inne błędy
				console.error("Błąd zapytania:", error.message);
			}

			setError("Nie udało się zapisać wizyty. Szczegóły błędu w konsoli.");
		}
	};

	// Fetch salons on mount
	useEffect(() => {
		fetchSalons();
	}, []);

	return (
		<div className="calendar-container">
			<h2>Kalendarz Pracowników</h2>
			{error && <p className="error-message">{error}</p>}

			<div className="salon-select-container">
				<label htmlFor="salon-select">Wybierz salon:</label>
				<select
					id="salon-select"
					value={selectedSalonId || ""}
					onChange={(e) => handleSalonSelect(e.target.value)}
				>
					<option value="" disabled>
						-- Wybierz salon --
					</option>
					{salons.map((salon) => (
						<option key={salon.id} value={salon.id}>
							{salon.name}
						</option>
					))}
				</select>
			</div>

			<div className="calendar-wrapper">
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 500 }}
					selectable
					onSelectSlot={handleSelectSlot}
					onSelectEvent={(event) => alert(`Wybrano wydarzenie: ${event.title}`)}
				/>
			</div>

			{/* Modal */}
			{modalOpen && (
				<div className="task-modal">
					<div className="modal-content">
						<h3>Dodaj wizytę</h3>
						<label>
							Pracownik:
							<select
								value={taskDetails.employeeId || ""}
								onChange={(e) => {
									const selectedEmployeeId = e.target.value;
									setTaskDetails((prev) => ({
										...prev,
										employeeId: selectedEmployeeId,
										employeeName: employees.find(
											(emp) => emp.id === selectedEmployeeId
										)?.firstName,
									}));
									fetchServices(selectedEmployeeId);
								}}
							>
								<option value="" disabled>
									-- Wybierz pracownika --
								</option>
								{employees.map((employee) => (
									<option key={employee.id} value={employee.id}>
										{employee.firstName} {employee.lastName}
									</option>
								))}
							</select>
						</label>
						<label>
							Usługa:
							{loading ? (
								<p>Ładowanie usług...</p>
							) : (
								<select
									value={taskDetails.serviceId || ""}
									onChange={(e) => {
										const selectedService = services.find(
											(service) => service.id === e.target.value
										);
										setTaskDetails((prev) => ({
											...prev,
											serviceId: e.target.value,
											serviceName: selectedService?.name,
											serviceDuration: selectedService?.duration,
											servicePrice: selectedService?.price,
										}));
									}}
								>
									<option value="" disabled>
										-- Wybierz usługę --
									</option>
									{services.length === 0 ? (
										<option disabled>Brak dostępnych usług</option>
									) : (
										services.map((service) => (
											<option key={service.id} value={service.id}>
												{service.name}
											</option>
										))
									)}
								</select>
							)}
						</label>
						<label>
							Data:
							<input
								type="date"
								value={taskDetails.date || ""}
								onChange={(e) =>
									setTaskDetails((prev) => ({ ...prev, date: e.target.value }))
								}
							/>
						</label>
						<label>
							Czas rozpoczęcia:
							<input
								type="time"
								value={taskDetails.startTime || ""}
								onChange={(e) =>
									setTaskDetails((prev) => ({
										...prev,
										startTime: e.target.value,
									}))
								}
							/>
						</label>
						<label>
							Notatki:
							<input
								type="text"
								value={taskDetails.notes || ""}
								onChange={(e) =>
									setTaskDetails((prev) => ({
										...prev,
										notes: e.target.value,
									}))
								}
							/>
						</label>

						<div className="modal-buttons">
							<button onClick={handleSaveTask}>Zapisz</button>
							<button onClick={() => setModalOpen(false)}>Anuluj</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EmployeeScheduleCalendar;
