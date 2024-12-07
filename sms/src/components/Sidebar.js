import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/components/Sidebar.css";

const Sidebar = () => {
	return (
		<div className="sidebar">
			<h2 className="sidebar-title">Menu</h2>
			<ul className="sidebar-links">
				<li>
					<NavLink
						to="/dashboard"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">🏠</span>
						<span className="text">Tablica</span>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/settings"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">⚙️</span>
						<span className="text">Ustawienia</span>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/salon"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">🏢</span>
						<span className="text">Salon</span>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/employee"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">👨‍💼</span>
						<span className="text">Pracownicy</span>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/services"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">💼</span>
						<span className="text">Usługi</span>
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/products"
						className="sidebar-link"
						activeClassName="active"
					>
						<span className="icon">📦</span>
						<span className="text">Produkty</span>
					</NavLink>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
