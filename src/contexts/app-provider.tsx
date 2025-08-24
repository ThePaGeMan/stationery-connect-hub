import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase_client.ts";
import {type Customer} from "@/types/auth.ts";

interface AppContextType {
    customerDetails: Customer[];
    loading: boolean;
    fetchCustomers: () => Promise<void>;
}

// ------------------ Context ------------------ //
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [customerDetails, setCustomerDetails] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch customers from Supabase
    const fetchCustomers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching customers:", error.message);
            setCustomerDetails([]);
        } else {
            setCustomerDetails(data as Customer[]);
        }
        setLoading(false);
    };

    // Auto-fetch on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <AppContext.Provider value={{ customerDetails: customerDetails, loading, fetchCustomers }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook to use context
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within an AppProvider");
    return context;
};
