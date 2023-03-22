import UserService from '@utility/services/user';
import React, {
    createContext, useState, useContext, useEffect,
} from 'react'

import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigation = useNavigation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isVendor, setIsVendor] = useState(null);

    const setData = () => {
        const authenticated = UserService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            const user = UserService.getUser();
            setUser(user);
            setIsVendor(user.type === 'vendor');
        }
    }

    useEffect(() => {
        const handleRouteChange = (url) => {
            if (url.indexOf('/login') < -1 && url.indexOf('/app') > -1 && !isAuthenticated && !loading) {
                navigation.replace('Login');
            }
        }

        const pathname = navigation.getCurrentRoute().name;
        if (pathname.indexOf('/login') < 0 && pathname.indexOf('/app') > -1 && !isAuthenticated && !loading) {
            navigation.replace('Login');
        }

        const focusListener = navigation.addListener('focus', () => {
            setData();
        });

        return () => {
            focusListener();
        }
    }, [isAuthenticated, loading])

    useEffect(() => {
        const loadToken = async () => {
            setData();
            setLoading(false)
        }
        loadToken()
    }, [])

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false)
    }

    const login = () => {
        setData();
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            isVendor
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)