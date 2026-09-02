import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();

    const {
        handleLogout,
        actionLoading
    } = useAuth();

    const handleLogoutClick = async () => {
        await handleLogout();

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h1
                className="navbar-logo"
                onClick={() => navigate("/")}
            >
                Readify-AI
            </h1>

            <button
                className="navbar-logout"
                onClick={handleLogoutClick}
                disabled={actionLoading}
            >
                {actionLoading ? "Logging out..." : "Logout"}
            </button>
        </nav>
    );
};

export default Navbar;