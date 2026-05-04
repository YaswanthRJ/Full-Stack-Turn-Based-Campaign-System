import { createContext, useState, useContext, useEffect } from "react";
import { initUser, StaleUserError } from "../service/user.service";

type AuthContextState = {
    isAuthenticated: boolean;
    userId: string | null;
    username: string | null;
};

type AuthContextType = {
    state: AuthContextState;
    setState: React.Dispatch<React.SetStateAction<AuthContextState>>;
    reset: () => void;
};

const defaultState: AuthContextState = {
    isAuthenticated: false,
    userId: null,
    username: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<AuthContextState>(defaultState);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false)

    function reset() {
        setState(defaultState);
    }

    useEffect(() => {
    async function bootstrap() {
        try {
            let result;
            try {
                result = await initUser();
            } catch (err) {
                if (err instanceof StaleUserError) {
                    result = await initUser();
                } else {
                    throw err;
                }
            }
            setState({
                isAuthenticated: result.isAuthenticated,
                userId: result.userId,
                username: result.username,
            });
        } catch (err) {
            console.error("Failed to initialize user", err);
            setError(true);
        } finally {
            setReady(true);
        }
    }
    bootstrap();
}, []);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                
            </div>
        );
    }
    if (ready && error) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            Coundt initialize user. Please try again...
        </div>
        )
    }

    return (
        <AuthContext.Provider value={{ state, setState, reset }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return ctx;
}