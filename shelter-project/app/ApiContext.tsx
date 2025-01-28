/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import apiURL from "../api";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";


interface User {
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  user_role: string;
  shelter_id: number;
  donations: any[];
  id: number;
}

interface Shelter {
  shelter_id: number;
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
  resource_needs: any[];
  donations: any[];
  staff: any[];
}

interface Filters {
  status?: string;
  donation_type?: string;
}

interface Donation {
  id: number;
  shelter_id: number;
  user_id: number;
  donation_type: string;
  status: string;
  donated_items: string[];
  donation_amount: number;
  note: string;
  created_at: string;
}

interface Report {
  id: number;
  name: string;
  report_type: string;
  start_date: string;
  end_date: string;
  generated_by: number;
  generated_at: string;
  shelter_id: number;
  filtered_by: object;
  data: object;
  file_path: string;
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
  updateShelterData: (data: Shelter) => void;
  generateReport: (data: object) => void;
  generatedReport: Report;
  downloadReport: (reportID: number, fileType: string) => void;
  reportFilePath: string | null;
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
    id: 0,
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
    shelter_id: 0,
  });
  const [activeFilters, setActiveFilters] = useState<Filters>({ status: undefined, donation_type: undefined });

  const [generatedReport, setGeneratedReport] = useState<Report>({
    id: 0,
    name: "",
    report_type: "",
    start_date: "",
    end_date: "",
    generated_by: 0,
    generated_at: "",
    shelter_id: 0,
    filtered_by: {},
    data: {},
    file_path: ""
  });
  const [reportFilePath, setReportFilePath] = useState<string | null>(null);

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
      // console.log(res.data);
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
      // console.log(res.data);
      setShelterData(res.data);
    } catch (error) {
      setError("Failed to fetch shelter data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update shelter information
  const updateShelterData = async (data: Shelter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${apiURL}/shelters/1/update`, data);
      // console.log(res.data);
      setShelterData(res.data);
    } catch (error) {
      setError("Failed to update shelter data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Report Function
  const generateReport = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiURL}/reports/generate-report`, data, {
        responseType: "json",
      });
      console.log(res.data);
      setGeneratedReport(res.data);
    } catch (error) {
      setError("Failed to generate report");
      console.error(error);
    } finally {
      setLoading(false);
  }
}

const downloadReport = async (reportID: number, fileType: string) => {
  setLoading(true);
  setError(null);
  try {
    // Set up the request body with report details
    const body = {
      report_type: generatedReport.report_type,
      file_format: fileType,
      user_id: currentUser.id,
    };

    // Make the POST request to download the report
    const res = await axios.post(`${apiURL}/reports/download-report/${reportID}`, body, {
      responseType: "json", // Ensure response is in JSON format
    });
    console.log(res.data);

    // Extract the file_path from the response
    const filePath = res.data;

    if (!filePath) {
      throw new Error("No file path returned from the server");
    }

    // Now we have the file path (URL), and we need to download the file itself
    const localFileUri = FileSystem.documentDirectory + `report.${fileType}`;

    // Download the file from the file path returned by the backend
    const { uri } = await FileSystem.downloadAsync(filePath, localFileUri);

    // Save the file path for local access
    setReportFilePath(uri);

    // If it's a PDF, we can open it directly
    if (fileType === "pdf") {
      await WebBrowser.openBrowserAsync(uri);
    }

  } catch (error) {
    setError("Failed to download report: " + (error instanceof Error ? error.message : "Unknown error"));
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

  const filterDonations = (
    donations: Donation[],
    filters: Filters
  ): Donation[] => {
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
        updateShelterData,
        generateReport,
        generatedReport,
        downloadReport,
        reportFilePath,
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
