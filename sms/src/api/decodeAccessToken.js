import { jwtDecode } from "jwt-decode";

const decodeAccessToken = (token) => {
	try {
		const decoded = jwtDecode(token);

		if (decoded) {
			const role =
				decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
			console.log("Role:", role);
			return role || null; // Zwróć rolę lub null, jeśli jej nie ma
		}
	} catch (error) {
		console.error("Error decoding token:", error);
		return null;
	}
};

export default decodeAccessToken;
