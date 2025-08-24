"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WhyChooseUsReason {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  order: number;
  isActive: boolean;
}

interface WhyChooseUsData {
  title: string;
  description: string;
  reasons: WhyChooseUsReason[];
}

interface WhyChooseUsContextType {
  data: WhyChooseUsData;
  updateData: (newData: WhyChooseUsData) => void;
  addReason: (reason: Omit<WhyChooseUsReason, 'id'>) => void;
  updateReason: (id: string, reason: Omit<WhyChooseUsReason, 'id'>) => void;
  deleteReason: (id: string) => void;
  getActiveReasons: () => WhyChooseUsReason[];
}

const defaultData: WhyChooseUsData = {
  title: "Why Choose US ?",
  description: "Everything you can do in a physical classroom, you can now do — and more — with Translam.",
  reasons: [
    {
      id: '1',
      title: 'Academic Excellence',
      subtitle: 'ENGINEERING & MANAGEMENT',
      description: 'Empowering future leaders through cutting-edge curriculum, industry-oriented programs, and experienced faculty.',
      tags: ['Industry Partnerships', 'Research Centers', 'Global Exposure'],
      order: 0,
      isActive: true
    },
    {
      id: '2',
      title: 'Experienced Faculty',
      subtitle: 'EXPERT GUIDANCE',
      description: 'Learn from professionals who bring real-world experience and deep academic knowledge to the classroom.',
      tags: ['Mentorship', 'Domain Experts', 'PhD Holders'],
      order: 1,
      isActive: true
    },
    {
      id: '3',
      title: 'Career Opportunities',
      subtitle: 'PLACEMENTS & INTERNSHIPS',
      description: 'We connect students to top recruiters and provide pathways to rewarding careers.',
      tags: ['Top Recruiters', 'Internships', 'Placement Training'],
      order: 2,
      isActive: true
    }
  ]
};

const WhyChooseUsContext = createContext<WhyChooseUsContextType | undefined>(undefined);

export const useWhyChooseUs = () => {
  const context = useContext(WhyChooseUsContext);
  if (!context) {
    throw new Error('useWhyChooseUs must be used within a WhyChooseUsProvider');
  }
  return context;
};

export const WhyChooseUsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WhyChooseUsData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/why-choose-us');
        if (response.ok) {
          const apiData = await response.json();
          // Transform backend data to match frontend structure
          const transformedData: WhyChooseUsData = {
            title: apiData.heroTitle || defaultData.title,
            description: apiData.content || defaultData.description,
            reasons: apiData.points || defaultData.reasons
          };
          setData(transformedData);
        }
      } catch (error) {
        console.error('Failed to fetch Why Choose Us data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = async (newData: WhyChooseUsData) => {
    try {
      const backendData = {
        heroTitle: newData.title,
        content: newData.description,
        points: newData.reasons
      };
      
      const response = await fetch('http://localhost:4000/api/why-choose-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        setData(newData);
      } else {
        throw new Error('Failed to update Why Choose Us data');
      }
    } catch (error) {
      console.error('Failed to update Why Choose Us data:', error);
      throw error;
    }
  };

  const addReason = async (reason: Omit<WhyChooseUsReason, 'id'>) => {
    const newReason: WhyChooseUsReason = {
      ...reason,
      id: Date.now().toString()
    };
    
    const updatedData = {
      ...data,
      reasons: [...data.reasons, newReason]
    };
    
    await updateData(updatedData);
  };

  const updateReason = async (id: string, updatedReason: Omit<WhyChooseUsReason, 'id'>) => {
    const updatedData = {
      ...data,
      reasons: data.reasons.map(reason => 
        reason.id === id 
          ? { ...reason, ...updatedReason }
          : reason
      )
    };
    
    await updateData(updatedData);
  };

  const deleteReason = async (id: string) => {
    const updatedData = {
      ...data,
      reasons: data.reasons.filter(reason => reason.id !== id)
    };
    
    await updateData(updatedData);
  };

  const getActiveReasons = () => {
    return data.reasons
      .filter(reason => reason.isActive)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <WhyChooseUsContext.Provider value={{ 
      data, 
      updateData, 
      addReason, 
      updateReason, 
      deleteReason, 
      getActiveReasons
    }}>
      {children}
    </WhyChooseUsContext.Provider>
  );
};