import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [filters, setFilters] = useState([]);

    const setAuth = (value) => {
        setAuthenticated(value);
    }

    const setAddFilters = (value) => {
        const newFilters = [...filters, value];
        setFilters(newFilters);
    }

    const clearFilters = () => {
        setFilters([]);
    }

    return (
        <AuthContext.Provider value={{ authenticated, setAuth, filters, setAddFilters, clearFilters }}>
            {children}
        </AuthContext.Provider>
    )
}