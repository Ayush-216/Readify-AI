import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading
    } = context;

    const [actionLoading, setActionLoading] = useState(false);

    const handleLogin = async ({ email, password }) => {
        setActionLoading(true);

        try {
            const data = await login({
                email,
                password
            });

            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setActionLoading(true);

        try {
            const data = await register({
                username,
                email,
                password
            });

            setUser(data.user);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = async () => {
        setActionLoading(true);

        try {
            await logout();

            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();

                setUser(data.user);
            } catch (error) {
                console.error("Failed to get current user:", error);

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        actionLoading,
        handleLogin,
        handleRegister,
        handleLogout
    };
};