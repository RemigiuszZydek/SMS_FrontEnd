import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchAvailability } from "./SchedulerRequests";

const localizer = momentLocalizer(moment);

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
		onSave({ ...availability, ...editedAvailability });
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
							value={new Date(editedAvailability.start)
								.toISOString()
								.slice(0, -1)}
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
							value={new Date(editedAvailability.end)
								.toISOString()
								.slice(0, -1)}
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

const Scheduler = ({ employeeId }) => {
	const [events, setEvents] = useState([]); // Wydarzenia do kalendarza
	const [selectedDateRange, setSelectedDateRange] = useState({
		start: moment().startOf("month").format("YYYY-MM-DD"), // Początek miesiąca
		end: moment().endOf("month").format("YYYY-MM-DD"), // Koniec miesiąca
	});
	const [currentView, setCurrentView] = useState("month"); // Aktualny widok kalendarza
	const [selectedDate, setSelectedDate] = useState(new Date()); // Wybrana data
	const [selectedEvent, setSelectedEvent] = useState(null); // Wybrana dostępność do edycji

	// Przetwarzanie danych na wydarzenia kalendarza
	const przetworzDane = (data) => {
		return data.flatMap((item) =>
			item.availableHours.map((hour) => ({
				id: `${item.date}-${hour.start}-${hour.end}`, // Unikalny lokalny identyfikator
				title: "Dostępność",
				start: new Date(`${item.date}T${hour.start}`),
				end: new Date(`${item.date}T${hour.end}`),
			}))
		);
	};

	// Pobieranie dostępności z API
	useEffect(() => {
		const loadAvailability = async () => {
			try {
				const response = await fetchAvailability(
					employeeId,
					selectedDateRange.start,
					selectedDateRange.end
				);

				if (response.success) {
					const formattedEvents = przetworzDane(response.data);
					setEvents(formattedEvents); // Aktualizujemy wydarzenia
				} else {
					console.warn("Nie udało się załadować dostępności.");
					setEvents([]); // Czyszczenie wydarzeń w przypadku błędu
				}
			} catch (error) {
				console.warn("Wystąpił błąd podczas pobierania dostępności:", error);
				setEvents([]); // Czyszczenie wydarzeń w przypadku błędu
			}
		};

		loadAvailability();
	}, [employeeId, selectedDateRange]);

	// Obsługa zmiany zakresu widoku w kalendarzu
	const handleRangeChange = (range) => {
		if (range.start && range.end) {
			setSelectedDateRange({
				start: moment(range.start).format("YYYY-MM-DD"),
				end: moment(range.end).format("YYYY-MM-DD"),
			});
		}
	};

	// Obsługa zmiany widoku
	const handleViewChange = (view) => {
		setCurrentView(view);
	};

	// Obsługa kliknięcia w dzień w widoku miesięcznym
	const handleSelectSlot = (slotInfo) => {
		if (currentView === "month") {
			// Przełącz na widok dzienny dla wybranej daty
			setCurrentView("day");
			setSelectedDate(slotInfo.start);
		} else if (currentView === "day" || currentView === "week") {
			// Sprawdź, czy zaznaczenie nachodzi na istniejące wydarzenie
			const overlappingEvent = events.find(
				(event) => slotInfo.start < event.end && slotInfo.end > event.start // Zakresy się pokrywają
			);

			// Jeśli nie ma nachodzącego wydarzenia, dodaj nowe
			if (!overlappingEvent) {
				const newEvent = {
					id: `${slotInfo.start}-${slotInfo.end}`, // Unikalny identyfikator
					title: "Dostępność",
					start: slotInfo.start,
					end: slotInfo.end,
				};
				setEvents((prevEvents) => [...prevEvents, newEvent]);
				console.log("Nowe wydarzenie dodane lokalnie:", newEvent);
			} else {
				console.warn(
					"Nie można dodać wydarzenia, które nakłada się na istniejące."
				);
			}
		}
	};

	// Obsługa edycji dostępności
	const handleSelectEvent = (event) => {
		setSelectedEvent(event);
	};

	return (
		<div>
			<h1>Kalendarz dostępności pracownika</h1>
			<Calendar
				localizer={localizer}
				events={events} // Przetworzone wydarzenia
				startAccessor="start"
				endAccessor="end"
				date={selectedDate} // Ustawienie wybranej daty
				view={currentView} // Aktualny widok kalendarza
				onView={handleViewChange} // Aktualizacja widoku
				onRangeChange={handleRangeChange} // Aktualizuje zakres widoku
				selectable // Włącza zaznaczanie przedziałów czasu
				onSelectSlot={handleSelectSlot} // Obsługa zaznaczenia i przejścia do dnia
				onSelectEvent={handleSelectEvent} // Obsługa edycji wydarzenia
				defaultView="month" // Domyślny widok: miesiąc
				style={{ height: 600, margin: "50px" }}
			/>
			{selectedEvent && (
				<AvailabilityEditor
					availability={selectedEvent}
					onSave={(updatedEvent) => {
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
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</div>
	);
};

export default Scheduler;
