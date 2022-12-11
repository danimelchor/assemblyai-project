import {
    useEffect,
    useState,
    useContext,
    createContext,
    useMemo,
    ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserType } from "../types";

type AuthContextType = {
    user?: UserType;
    setUser: (user: UserType) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: () => {},
    logout: () => {},
});

const unauthorizedRoutes = ["#/login", "#/register", "#/"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, _setUser] = useState<UserType | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            axios
                .get("/whoami")
                .then((res) => {
                    _setUser(res.data);
                })
                .catch((err) => {
                    // Get current location (using hashrouter)
                    const currentLocation = window.location.hash;

                    if (!unauthorizedRoutes.includes(currentLocation)) {
                        navigate("/login");
                    }
                });
        }
    }, []);

    const setUser = (user: UserType) => {
        _setUser(user);
    };

    const logout = async () => {
        await axios.get("/logout");
        _setUser(undefined);
        navigate("/login");
    };

    const memoedValue = useMemo(() => ({ user, setUser, logout }), [user]);

    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useUser() {
    return useContext(AuthContext);
}
