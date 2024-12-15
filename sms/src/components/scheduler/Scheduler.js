import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAvailability } from "./SchedulerRequests";
import AvailabilityEditor from "./AvailabilityEdtior";
import Api from "../../api/Api"; // API helper
import config from "../../config"; // Konfiguracja API

const localizer = momentLocalizer(moment);

const Scheduler = () => {
	const [events, setEvents] = useState([]);
	const [selectedDateRange, setSelectedDateRange] = useState({
		start: moment().startOf("month").format("YYYY-MM-DD"),
		end: moment().endOf("month").format("YYYY-MM-DD"),
	});
	const [currentView, setCurrentView] = useState("month");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedEvent, setSelectedEvent] = useState(null);

	// Stany dla salonów i pracowników
	const [salons, setSalons] = useState([]);
	const [selectedSalonId, setSelectedSalonId] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

	// Przetwarzanie danych na wydarzenia kalendarza
	const przetworzDane = (data) => {
		console.log("Przetwarzanie danych dostępności:", data);
		return data.flatMap((item) =>
			item.availableHours.map((hour) => ({
				id: `${item.date}-${hour.start}-${hour.end}`,
				title: "Dostępność",
				start: new Date(`${item.date}T${hour.start}`),
				end: new Date(`${item.date}T${hour.end}`),
			}))
		);
	};

	// Funkcja do zapisywania dostępności do API
	const saveAvailabilityToAPI = async (employeeId, availability) => {
		console.log("Próba zapisania dostępności:", { employeeId, availability });

		// Konwersja na format wymagany przez API
		const payload = {
			employeeAvailabilities: [
				{
					date: availability.date,
					availabilityHours: [
						{
							start: `${availability.startTime}:00`, // Dodaj sekundy do godziny
							end: `${availability.endTime}:00`,
						},
					],
				},
			],
		};

		console.log("Dane wysyłane do API:", payload);

		try {
			const response = await Api.post(
				`${config.apiUrl}employee-availability/${employeeId}`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);

			// Logujemy pełną odpowiedź od API
			console.log("Odpowiedź API po zapisaniu dostępności:", response);

			// Jeśli status odpowiedzi jest 201 lub 200, dane są zapisane pomyślnie
			if (response.status === 201 || response.status === 200) {
				console.log("Dostępność zapisana pomyślnie w bazie danych.");
				alert("Dostępność zapisana pomyślnie!"); // Feedback dla użytkownika
			} else {
				// Obsługa innych statusów odpowiedzi
				console.warn(
					`Nieoczekiwany status odpowiedzi: ${response.status}`,
					response.data
				);
				alert(
					`Błąd: Nie udało się zapisać dostępności. Kod: ${response.status}`
				);
			}
		} catch (error) {
			// Logujemy błędy
			console.error("Błąd podczas zapisywania dostępności:", error);

			// Jeśli dostępne są szczegóły odpowiedzi błędu
			if (error.response) {
				console.error("Szczegóły błędu:", error.response.data);
				alert(
					`Błąd: Nie udało się zapisać dostępności.\n${JSON.stringify(
						error.response.data
					)}`
				);
			} else {
				alert("Nie udało się połączyć z serwerem.");
			}
		}
	};

	// Pobieranie listy salonów
	const fetchSalons = async () => {
		console.log("Pobieranie listy salonów...");
		try {
			const response = await Api.get(`${config.apiUrl}salon/list`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setSalons(response.data.data || []);
			console.log("Salony załadowane:", response.data.data);
		} catch (error) {
			console.error("Błąd pobierania salonów:", error);
			setSalons([]);
		}
	};

	// Pobieranie listy pracowników
	const fetchEmployees = async () => {
		console.log("Pobieranie listy pracowników dla salonu:", selectedSalonId);
		if (!selectedSalonId) return;
		try {
			const url = new URL(`${config.apiUrl}employee/get-all`);
			url.searchParams.append("salonId", selectedSalonId);

			const response = await Api.get(url.toString(), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			setEmployees(response.data.data || []);
			console.log("Pracownicy załadowani:", response.data.data);
		} catch (error) {
			console.error("Błąd podczas pobierania listy pracowników:", error);
			setEmployees([]);
		}
	};

	// Pobieranie dostępności z API
	useEffect(() => {
		const loadAvailability = async () => {
			console.log(
				`Ładowanie dostępności dla pracownika ${selectedEmployeeId} w zakresie`,
				selectedDateRange
			);
			if (!selectedEmployeeId) return;

			try {
				const response = await fetchAvailability(
					selectedEmployeeId,
					selectedDateRange.start,
					selectedDateRange.end
				);

				console.log("fetchAvailability Response:", response);

				if (response.success) {
					const formattedEvents = przetworzDane(response.data);
					console.log("Przetworzone wydarzenia:", formattedEvents);
					setEvents(formattedEvents);
				} else {
					console.warn("fetchAvailability zwróciło błędny status.");
					setEvents([]);
				}
			} catch (error) {
				console.error("Błąd podczas ładowania dostępności:", error);
				setEvents([]);
			}
		};

		loadAvailability();
	}, [selectedEmployeeId, selectedDateRange]);

	// Pobranie listy salonów po załadowaniu komponentu
	useEffect(() => {
		fetchSalons();
	}, []);

	// Pobranie listy pracowników po wyborze salonu
	useEffect(() => {
		if (selectedSalonId) {
			fetchEmployees();
			setSelectedEmployeeId(null); // Resetowanie wybranego pracownika przy zmianie salonu
		}
	}, [selectedSalonId]);

	const handleRangeChange = (range) => {
		console.log("Zakres dat zmieniony:", range);
		if (range.start && range.end) {
			setSelectedDateRange({
				start: moment(range.start).format("YYYY-MM-DD"),
				end: moment(range.end).format("YYYY-MM-DD"),
			});
		}
	};

	const handleViewChange = (view) => {
		console.log("Widok kalendarza zmieniony:", view);
		setCurrentView(view);
	};

	const handleSelectSlot = async (slotInfo) => {
		console.log("Wybrany slot:", slotInfo);

		if (currentView === "month") {
			setCurrentView("day");
			setSelectedDate(slotInfo.start);
		} else if (currentView === "day" || currentView === "week") {
			const overlappingEvent = events.find(
				(event) => slotInfo.start < event.end && slotInfo.end > event.start
			);

			if (!overlappingEvent) {
				const newEvent = {
					id: `${slotInfo.start}-${slotInfo.end}`,
					title: "Dostępność",
					start: slotInfo.start,
					end: slotInfo.end,
				};

				// Dodanie lokalne
				setEvents((prevEvents) => [...prevEvents, newEvent]);
				console.log("Nowe wydarzenie dodane lokalnie:", newEvent);

				// Konwersja na format wymagany przez API
				const availability = {
					date: newEvent.start.toISOString().split("T")[0], // Data w formacie YYYY-MM-DD
					startTime: newEvent.start.toISOString().split("T")[1].slice(0, 5), // HH:mm
					endTime: newEvent.end.toISOString().split("T")[1].slice(0, 5), // HH:mm
				};

				// Wywołanie zapisu do API
				if (selectedEmployeeId) {
					console.log("Próba zapisania nowej dostępności:", availability);
					await saveAvailabilityToAPI(selectedEmployeeId, availability);
				} else {
					console.warn(
						"Nie wybrano pracownika. Zapisanie do API nie zostało wykonane."
					);
				}
			} else {
				console.warn(
					"Nie można dodać wydarzenia, które nakłada się na istniejące."
				);
			}
		}
	};

	const handleSelectEvent = (event) => {
		console.log("Wybrano wydarzenie:", event);
		setSelectedEvent(event);
	};

	// Obsługa wyboru salonu
	const handleSalonSelect = (salonId) => {
		console.log("Wybrano salon:", salonId);
		setSelectedSalonId(salonId);
	};

	// Obsługa wyboru pracownika
	const handleEmployeeSelect = (employeeId) => {
		console.log("Wybrano pracownika:", employeeId);
		setSelectedEmployeeId(employeeId);
	};

	// Obsługa kopiowania dostępności
	const handleCopyAvailability = async (copyRange, availability) => {
		console.log("Kopiowanie dostępności:", { copyRange, availability });
		const { startTime, endTime } = availability;
		const startDate = new Date(copyRange.start);
		const endDate = new Date(copyRange.end);

		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateString = currentDate.toISOString().split("T")[0];
			const newAvailability = {
				date: dateString,
				startTime,
				endTime,
			};

			// Zapisz do API
			await saveAvailabilityToAPI(selectedEmployeeId, newAvailability);

			const newEvent = {
				id: `${dateString}-${startTime}-${endTime}`,
				title: "Dostępność",
				start: new Date(`${dateString}T${startTime}`),
				end: new Date(`${dateString}T${endTime}`),
			};
			setEvents((prevEvents) => [...prevEvents, newEvent]);
			currentDate.setDate(currentDate.getDate() + 1);
		}
	};

	return (
		<div>
			<h1>Kalendarz dostępności pracownika</h1>

			{/* Wybór salonu */}
			<div style={{ marginBottom: "20px" }}>
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

			{/* Wybór pracownika */}
			{selectedSalonId && (
				<div style={{ marginBottom: "20px" }}>
					<label htmlFor="employee-select">Wybierz pracownika:</label>
					<select
						id="employee-select"
						value={selectedEmployeeId || ""}
						onChange={(e) => handleEmployeeSelect(e.target.value)}
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
				</div>
			)}

			{/* Kalendarz */}
			{selectedEmployeeId && (
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					date={selectedDate}
					view={currentView}
					onView={handleViewChange}
					onRangeChange={handleRangeChange}
					selectable
					onSelectSlot={handleSelectSlot}
					onSelectEvent={handleSelectEvent}
					defaultView="month"
					style={{ height: 600, margin: "50px" }}
				/>
			)}

			{/* Edytor dostępności */}
			{selectedEvent && (
				<AvailabilityEditor
					availability={selectedEvent}
					onSave={async (updatedEvent) => {
						const availability = {
							date: updatedEvent.start.toISOString().split("T")[0],
							startTime: updatedEvent.start
								.toISOString()
								.split("T")[1]
								.slice(0, 5),
							endTime: updatedEvent.end.toISOString().split("T")[1].slice(0, 5),
						};

						console.log("Próba zapisania dostępności z edytora:", availability);

						await saveAvailabilityToAPI(selectedEmployeeId, availability);

						// Aktualizacja lokalnego stanu wydarzeń po zapisaniu
						setEvents((prevEvents) =>
							prevEvents.map((ev) =>
								ev.id === updatedEvent.id ? updatedEvent : ev
							)
						);
						setSelectedEvent(null);
					}}
					onDelete={(event) => {
						setEvents((prevEvents) =>
							prevEvents.filter((ev) => ev.id !== event.id)
						);
						setSelectedEvent(null);
					}}
					onCopy={handleCopyAvailability}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</div>
	);
};

export default Scheduler;
