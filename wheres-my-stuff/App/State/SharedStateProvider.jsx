import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a Context
const SharedStateContext = createContext();

// Step 2: Create a Provider component
export const SharedStateProvider = ({ children }) => {
    const [sharedState, setSharedState] = useState({
        allFurnitures: [],
        selectedRooms: [],
        error: false,
        users:[],
        pendingItems:[]
        // Other relevant state variables
    });

    return (
        <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
            {children}
        </SharedStateContext.Provider>
    );
};

// Step 3: Create custom hooks to consume the context
export const useSharedState = () => {
    const context = useContext(SharedStateContext);
    if (!context) {
        throw new Error('useSharedState must be used within a SharedStateProvider');
    }
    return context;
};
