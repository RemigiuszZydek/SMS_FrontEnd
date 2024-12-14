import config from "../../config";
import Api from "../../api/Api";

export const fetchAvailability = async (employeeId, startDate, endDate) => {
	try {
		const url = `${config.apiUrl}employee-availability/${employeeId}?startDate=${startDate}&endDate=${endDate}`;
		console.log("Request URL:", url);

		// Wykonanie żądania
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json", // Nagłówek JSON
			},
		});

		// Jeśli odpowiedź jest 404 (brak danych), zwróć pustą listę
		if (response.status === 404) {
			console.warn("API zwróciło 404: Brak dostępności dla tego zakresu.");
			return { success: true, data: [] }; // Zwracamy pustą listę jako dane
		}

		// Jeśli odpowiedź nie jest OK, ale to nie jest 404, loguj błąd
		if (!response.ok) {
			const errorText = await response.text();
			console.error("Response error text:", errorText);
			throw new Error(`Błąd HTTP ${response.status}: ${response.statusText}`);
		}

		// Zwrot przetworzonej odpowiedzi
		const data = await response.json();
		console.log("Response data:", data);
		return data;
	} catch (error) {
		console.error("BLAD W FETCHAVAILABILITY:", error);
		return { success: false, data: [] }; // Zwracamy pustą listę w przypadku błędu
	}
};

export const createAvailability = async (employeeId, availabilities) => {
	try {
		const response = await Api.post(
			`${config.apiUrl}employee-availability/d6b185a6-e756-4912-944a-b2439deebe68`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeAvailabilities: availabilities,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`Błąd HTTP ${response.status}: ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error("BŁĄD W CREATEAVAILABILITY: ", error);
		throw error;
	}
};
