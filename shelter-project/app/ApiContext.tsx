import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import apiURL from "../api";
import axios from "axios";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  user_role: string;
  shelter_id: number;
  donations: any[];
}

interface Shelter {
  status: string;
  shelter_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  primary_email: string;
  capacity: number;
  current_occupancy: number;
  current_funding: number;
  funding_needs: number;
  resource_needs: never[];
  donations: never[];
  staff: never[];
}

interface Filters {
    status?: string;
    donation_type?: string;
}

interface Donation {
    donation_type: string;
    status: string;
    [key: string]: any; 
}

interface ApiContextType {
  loading: boolean;
  error: string | null;
  formatDate: (dateString: string | number | Date) => string;
  allShelters: any[];
  fetchAllShelters: () => void;
  currentUser: User;
  fetchUserData: () => void;
  shelterData: Shelter;
  fetchShelterData: () => void;
  pendingDonations: never[];
  filterDonations: (donations: Donation[], filters: Filters) => Donation[];
  activeFilters: Filters;
    setActiveFilters: (filters: Filters) => void;
    filteredDonations: Donation[];
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allShelters, setAllShelters] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    user_type: "",
    user_role: "",
    shelter_id: 0,
    donations: [],
  });
  const [shelterData, setShelterData] = useState<Shelter>({
    status: "",
    shelter_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    primary_email: "",
    capacity: 0,
    current_occupancy: 0,
    current_funding: 0,
    funding_needs: 0,
    resource_needs: [],
    donations: [],
    staff: [],
  });
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    donation_type?: string;
  }>({});

  // Format Date (MM/DD/YY)
  const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch User Data Function
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiURL}/users/2`);
      console.log(res.data);
      setCurrentUser(res.data);
    } catch (error) {
      setError("Failed to fetch user data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Shelters Function
  const fetchAllShelters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiURL}/shelters/all`);
      console.log(res.data);
      setAllShelters(res.data);
    } catch (error) {
      setError("Failed to fetch shelters");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Shelter Data for current team member
  const fetchShelterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiURL}/shelters/1`);
      console.log(res.data);
      setShelterData(res.data);
    } catch (error) {
      setError("Failed to fetch shelter data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShelters();
    fetchUserData();
    fetchShelterData();
  }, []);

  const pendingDonations = shelterData.donations.filter(
    (donation) => donation.status === "Pending"
  );


const filterDonations = (donations: Donation[], filters: Filters): Donation[] => {
    return donations.filter((donation) => {
        const typeMatches = filters.donation_type
            ? donation.donation_type === filters.donation_type
            : true;
        const statusMatches = filters.status
            ? donation.status === filters.status
            : true;
        return typeMatches && statusMatches;
    });
};

  const filteredDonations = filterDonations(
    currentUser.user_type === "Donor"
      ? currentUser.donations
      : shelterData.donations,
    activeFilters
  );


  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        formatDate,
        allShelters,
        fetchAllShelters,
        currentUser,
        fetchUserData,
        shelterData,
        fetchShelterData,
        pendingDonations,
        filterDonations,
        activeFilters,
        setActiveFilters,
        filteredDonations,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export default {
  ApiProvider,
  useApi,
};
