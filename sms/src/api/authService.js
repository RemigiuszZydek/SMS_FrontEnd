import axios from "axios";

const API_URL = "https://localhost:7099";

export const register = async (data) => {
	const payload = {
		email: data.email,
		password: data.password,
		phoneNumber: data.phoneNumber,
	};

	return axios.post(`${API_URL}/api/auth/register`, payload, {
		headers: {
			"Content-Type": "application/json",
		},
	});
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
