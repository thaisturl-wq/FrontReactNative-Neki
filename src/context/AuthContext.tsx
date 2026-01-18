import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../service/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    signIn(data: { token: string; user: User }): Promise<void>;
    signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = await AsyncStorage.getItem('user_data');
            const storageToken = await AsyncStorage.getItem('token');

            if (storageUser && storageToken) {
                setUser(JSON.parse(storageUser));
                setToken(storageToken);

                api.defaults.headers.common['Authorization'] = storageToken.startsWith('Bearer ')
                    ? storageToken
                    : `Bearer ${storageToken}`;
            }
            setLoading(false);
        }

        loadStorageData();
    }, []);

    async function signIn({ token, user }: { token: string; user: User }) {
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        setUser(user);
        setToken(formattedToken);

        api.defaults.headers.common['Authorization'] = formattedToken;

        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        await AsyncStorage.setItem('token', formattedToken);

        await AsyncStorage.setItem('adminId', user.id.toString());
        await AsyncStorage.setItem('userName', user.name);
        await AsyncStorage.setItem('userEmail', user.email);
    }

    async function signOut() {
        await AsyncStorage.clear();
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, token, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
