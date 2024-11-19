import axios from "axios";

const API_URL = "https://localhost:7099";

export const register = async (data) => {
	try {
		const payload = {
			email: data.email,
			password: data.password,
			phoneNumber: data.phoneNumber,
		};

		const response = await axios.post(`${API_URL}/api/auth/register`, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("Rejestracja zakończona sukcesem:", response.data);
		return response;
	} catch (error) {
		console.error("Błąd rejestracji:", error.response || error);
		throw error;
	}
};

export const signIn = async (formData) => {
	try {
		const response = await axios.post(`${API_URL}/api/auth/sign-in`, formData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("ZALOGOWALO");
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Błąd odpowiedzi serwera:", error.response || error);
		throw new Error("Logowanie nie powiodło się.");
	}
};

export const sendResetPasswordToken = async ({ email, newPassword }) => {
	try {
		const response = await axios.post(
			`${API_URL}/api/auth/send-reset-password-token`,
			{
				email,
				newPassword,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error(
			"Błąd wysyłania tokena resetowania hasła:",
			error.response || error
		);
		throw error;
	}
};

const scheduleTokenRefresh = (expirationTime) => {
	const expirationDate = new Date(expirationTime);
	const currentTime = new Date();
	const timeToRefresh = expirationDate - currentTime - 60 * 1000;

	if (timeToRefresh > 0) {
		setTimeout(refreshAuthToken, timeToRefresh);
	}
};

export const refreshAuthToken = async () => {
	const refreshToken = localStorage.getItem("refreshToken");
	try {
		const response = await axios.post(
			`${API_URL}/api/auth/refresh`,
			{
				accessToken: localStorage.getItem("accessToken"),
				refreshToken,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		localStorage.setItem("accessToken", response.data.accessToken);
		localStorage.setItem("refreshToken", response.data.refreshToken);
		localStorage.setItem(
			"accessTokenExpiration",
			response.data.accessTokenExpiration
		);

		scheduleTokenRefresh(response.data.accessTokenExpiration);
	} catch (error) {
		console.error("Błąd przy odświeżaniu tokena:", error);
	}
};
