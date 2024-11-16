import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthSwitch = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className="auth-switch-container">
			<div className="auth-toggle">
				<button
					onClick={() => setIsLogin(true)}
					className={isLogin ? "active" : ""}
				>
					Logowanie
				</button>
				<button
					onClick={() => setIsLogin(false)}
					className={!isLogin ? "active" : ""}
				>
					Rejestracja
				</button>
			</div>
			{isLogin ? <Login /> : <Register />}
		</div>
	);
};

export default AuthSwitch;
