"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OutstandingPlacement {
  id: string;
  name: string;
  company: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface OutstandingPlacementsData {
  title: string;
  description: string;
  placements: OutstandingPlacement[];
}

interface OutstandingPlacementsContextType {
  data: OutstandingPlacementsData;
  updateData: (newData: OutstandingPlacementsData) => void;
  addPlacement: (placement: Omit<OutstandingPlacement, 'id'>) => void;
  updatePlacement: (id: string, placement: Omit<OutstandingPlacement, 'id'>) => void;
  deletePlacement: (id: string) => void;
  getActivePlacements: () => OutstandingPlacement[];
}

const defaultData: OutstandingPlacementsData = {
  title: "Incredibly Outstanding Placements",
  description: "This very extraordinary feature, can make learning activities more efficient",
  placements: [
    {
      id: '1',
      name: 'Anny',
      company: 'HCL',
      image: '/images/student1.png',
      order: 0,
      isActive: true
    },
    {
      id: '2',
      name: 'John',
      company: 'HCL',
      image: '/images/student1.png',
      order: 1,
      isActive: true
    },
    {
      id: '3',
      name: 'Anny',
      company: 'HCL',
      image: '/images/student1.png',
      order: 2,
      isActive: true
    },
    {
      id: '4',
      name: 'Anny',
      company: 'HCL',
      image: '/images/student1.png',
      order: 3,
      isActive: true
    },
    {
      id: '5',
      name: 'Anny',
      company: 'HCL',
      image: '/images/student1.png',
      order: 4,
      isActive: true
    },
    {
      id: '6',
      name: 'Anny',
      company: 'HCL',
      image: '/images/student1.png',
      order: 5,
      isActive: true
    }
  ]
};

const OutstandingPlacementsContext = createContext<OutstandingPlacementsContextType | undefined>(undefined);

export const useOutstandingPlacements = () => {
  const context = useContext(OutstandingPlacementsContext);
  if (!context) {
    throw new Error('useOutstandingPlacements must be used within an OutstandingPlacementsProvider');
  }
  return context;
};

export const OutstandingPlacementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OutstandingPlacementsData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/outstanding-placements');
        if (response.ok) {
          const apiData = await response.json();
          // Transform backend data to match frontend structure
          const transformedPlacements = (apiData.placements || defaultData.placements).map((placement: OutstandingPlacement) => ({
            ...placement,
            // Ensure image URLs are absolute paths pointing to backend
            image: placement.image?.startsWith('/uploads/') 
              ? `http://localhost:4000${placement.image}`
              : placement.image
          }));
          
          const transformedData: OutstandingPlacementsData = {
            title: apiData.heroTitle || defaultData.title,
            description: apiData.content || defaultData.description,
            placements: transformedPlacements
          };
          setData(transformedData);
        }
      } catch (error) {
        console.error('Failed to fetch Outstanding Placements data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = async (newData: OutstandingPlacementsData) => {
    try {
      // Convert absolute URLs back to relative paths for storage
      const placementsForBackend = newData.placements.map(placement => ({
        ...placement,
        image: placement.image?.startsWith('http://localhost:4000') 
          ? placement.image.replace('http://localhost:4000', '')
          : placement.image
      }));

      const backendData = {
        heroTitle: newData.title,
        content: newData.description,
        placements: placementsForBackend
      };
      
      const response = await fetch('http://localhost:4000/api/outstanding-placements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        setData(newData);
      } else {
        throw new Error('Failed to update Outstanding Placements data');
      }
    } catch (error) {
      console.error('Failed to update Outstanding Placements data:', error);
      throw error;
    }
  };

  const addPlacement = async (placement: Omit<OutstandingPlacement, 'id'>) => {
    const newPlacement: OutstandingPlacement = {
      ...placement,
      id: Date.now().toString()
    };
    
    const updatedData = {
      ...data,
      placements: [...data.placements, newPlacement]
    };
    
    await updateData(updatedData);
  };

  const updatePlacement = async (id: string, updatedPlacement: Omit<OutstandingPlacement, 'id'>) => {
    const updatedData = {
      ...data,
      placements: data.placements.map(placement => 
        placement.id === id 
          ? { ...placement, ...updatedPlacement }
          : placement
      )
    };
    
    await updateData(updatedData);
  };

  const deletePlacement = async (id: string) => {
    const updatedData = {
      ...data,
      placements: data.placements.filter(placement => placement.id !== id)
    };
    
    await updateData(updatedData);
  };

  const getActivePlacements = () => {
    return data.placements
      .filter(placement => placement.isActive)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <OutstandingPlacementsContext.Provider value={{ 
      data, 
      updateData, 
      addPlacement, 
      updatePlacement, 
      deletePlacement, 
      getActivePlacements
    }}>
      {children}
    </OutstandingPlacementsContext.Provider>
  );
};