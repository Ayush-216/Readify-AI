import { useContext, useState } from "react";
import { AuthContext } from "../authContext";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading } = useContext(AuthContext);
    const [actionLoading, setActionLoading] = useState(false);

    const run = async (action) => {
        setActionLoading(true);
        try { return await action(); } finally { setActionLoading(false); }
    };

    return {
        user, loading, actionLoading,
        handleLogin: (details) => run(async () => { const data = await login(details); setUser(data.user); }),
        handleRegister: (details) => run(async () => { const data = await register(details); setUser(data.user); }),
        handleLogout: () => run(async () => { await logout(); setUser(null); }),
    };
};
