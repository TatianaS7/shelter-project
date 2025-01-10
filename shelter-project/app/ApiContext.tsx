import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import apiURL from '../api'
import axios from "axios"

interface ApiContextType {
    loading: boolean;
    error: string | null;
    allShelters: any[];
    fetchAllShelters: () => void;
    currentUser: any[];
    fetchUserData: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
    children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allShelters, setAllShelters] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any[]>([])

    // Fetch User Data Function
    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${apiURL}/users/2`)
            console.log(res.data)
            setCurrentUser(res.data)
        } catch (error) {
            setError('Failed to fetch user data')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch All Shelters Function
    const fetchAllShelters = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${apiURL}/shelters/all`)
            console.log(res.data)
            setAllShelters(res.data);
        } catch (error) {
            setError('Failed to fetch shelters')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllShelters();
        fetchUserData();
    }, [])


    return (
        <ApiContext.Provider value={{ loading, error, allShelters, fetchAllShelters, currentUser, fetchUserData }}>
            {children}
        </ApiContext.Provider>
    )
};


export const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider')
    }
    return context
};

export default {
    ApiProvider,
    useApi
}