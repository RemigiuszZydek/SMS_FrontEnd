import config from "../../config";
import Api from "../../api/Api";

export const fetchAvailability = async (employeeId, startDate, endDate) => {
	try {
		const url = `${config.apiUrl}employee-availability/${employeeId}?startDate=${startDate}&endDate=${endDate}`;
		console.log("Request URL:", url);

		// Wykonanie żądania
		const response = await Api.get(url, {
			headers: {
				"Content-Type": "application/json", // Nagłówek JSON
			},
		});

		// Logowanie całej odpowiedzi
		console.log("API Response:", response);

		// Jeśli odpowiedź jest 404 (brak danych), zwróć pustą listę
		if (response.status === 404) {
			console.warn("API zwróciło 404: Brak dostępności dla tego zakresu.");
			return { success: true, data: [] }; // Zwracamy pustą listę jako dane
		}

		// Jeśli odpowiedź jest inna niż 200, loguj błąd
		if (response.status !== 200) {
			console.error("Unexpected response status:", response.status);
			throw new Error(`Błąd HTTP ${response.status}: ${response.statusText}`);
		}

		// Zwrot przetworzonych danych
		const data = response.data; // Dane są już w formacie JSON
		console.log("Response JSON data:", data);
		return { success: true, data };
	} catch (error) {
		// Logowanie błędu w try/catch
		console.error("Błąd w funkcji fetchAvailability:", error);

		// Logowanie szczegółowych danych o błędzie, jeśli istnieją
		if (error.response) {
			console.error("Error response:", error.response);
		}
		if (error.request) {
			console.error("Error request:", error.request);
		}

		// Zwracamy pustą listę, aby zapobiec awarii aplikacji
		return { success: false, data: [] };
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
