import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EmployeeScheduleCalendar = () => {
	const [events, setEvents] = useState([
		{
			id: 1,
			title: "Przykładowe wydarzenie",
			start: new Date(),
			end: new Date(moment().add(1, "hours").toDate()),
		},
	]); // Przykładowe wydarzenia
	const [selectedDate, setSelectedDate] = useState(null); // Wybrana data
	const [viewMode, setViewMode] = useState("calendar"); // Tryb widoku: 'calendar' lub 'details'

	// Funkcja obsługująca wybór slotu
	const handleSelectSlot = ({ start }) => {
		setSelectedDate(start);
		setViewMode("details");
	};

	// Powrót do pełnego widoku kalendarza
	const handleBackToCalendar = () => {
		setSelectedDate(null);
		setViewMode("calendar");
	};

	return (
		<div>
			<h2>Kalendarz Pracowników</h2>
			{viewMode === "calendar" && (
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					style={{ height: 500 }}
					selectable
					onSelectSlot={handleSelectSlot} // Reaguj na wybór slotu
					onSelectEvent={(event) => alert(`Wybrano wydarzenie: ${event.title}`)}
				/>
			)}
			{viewMode === "details" && selectedDate && (
				<div>
					<h3>Szczegóły wybranej daty</h3>
					<p>Wybrano datę: {moment(selectedDate).format("YYYY-MM-DD")}</p>
					<button onClick={handleBackToCalendar}>Wróć do kalendarza</button>
				</div>
			)}
		</div>
	);
};

export default EmployeeScheduleCalendar;
