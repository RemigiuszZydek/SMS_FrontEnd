import React from "react";
import AuthSwitch from "../components/auth/AuthSwitch";
import "../styles/HomePage.css";

const HomePage = () => {
	return (
		<div className="home-page">
			<h1>SPA MANAGMENT SYSTEM</h1>
			<AuthSwitch />
		</div>
	);
};

export default HomePage;
