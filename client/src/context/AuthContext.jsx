import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext =
    createContext(null);

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        try {
            const storedToken =
                localStorage.getItem(
                    "token"
                );

            const storedUser =
                localStorage.getItem(
                    "user"
                );

            if (
                storedToken &&
                storedUser
            ) {
                setToken(
                    storedToken
                );

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );
            }
        } catch (error) {
            console.error(
                "Failed to restore authentication:",
                error
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = ({
        token,
        user,
    }) => {
        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated:
                    Boolean(
                        token && user
                    ),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);