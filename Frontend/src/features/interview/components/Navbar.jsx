import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, loading, handleLogout, actionLoading } = useAuth();
    const logout = async () => {
        try { await handleLogout(); navigate("/"); }
        catch { /* Keep the signed-in state if logout fails. */ }
    };

    return (
        <header className="navbar">
            <Link className="navbar-logo" to="/">Readify<span>AI</span><span className="navbar-logo__dot">.</span></Link>
            <nav className="navbar-links" aria-label="Main navigation">
                <NavLink to="/" end>Home</NavLink>
                <NavLink to="/news">Tech News</NavLink>
                <NavLink to="/jobs">Job Search</NavLink>
                <NavLink to="/prepare">Interview Prep</NavLink>
            </nav>
            <div className="navbar-account">
                {!loading && (user
                    ? <button className="navbar-account__button" onClick={logout} disabled={actionLoading}>{actionLoading ? "Signing out..." : "Sign out"}</button>
                    : <Link className="navbar-account__button" to="/login">Sign in <span aria-hidden="true">↗</span></Link>)}
            </div>
        </header>
    );
};

export default Navbar;
