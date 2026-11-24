import { useEffect, useState } from "react";
import { getMe } from "./services/auth.api";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getMe().then((data) => {
            if (active) setUser(data.user);
        }).catch(() => {
            if (active) setUser(null);
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, []);

    return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
