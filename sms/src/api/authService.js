import axios from "axios";
import config from '../config';

export const register = async (data) => {
	try {
		const payload = {
			email: data.email,
			password: data.password,
			phoneNumber: data.phoneNumber,
		};

		const response = await axios.post(`${config.apiUrl}auth/register`, payload);

		return response;
	} catch (error) {
		console.error("Błąd rejestracji:", error.response || error);
		throw error;
	}
};

export const signIn = async (data) => {
	try {
		const payload = {
			email: data.email,
			password: data.password
		};

		const response = await axios.post(`${config.apiUrl}auth/sign-in`, payload);

		return response.data;
	} catch (error) {
		console.error("Błąd odpowiedzi serwera:", error.response || error);
		throw new Error("Logowanie nie powiodło się.");
	}
};

export const sendResetPasswordToken = async ({ email, newPassword }) => { // raz przekazujesz obiekt, raz pojedyncze zmienne (wez trzymaj się jednej konwencji)
	try {
		const response = await axios.post(`${config.apiUrl}auth/send-reset-password-token`,
			{
				email,
				newPassword,
			});

		return response.data;
	} catch (error) {
		console.error("Błąd wysyłania tokena resetowania hasła:",error.response || error);
		throw error;
	}
};
