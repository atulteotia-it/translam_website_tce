"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OurSuccessData {
  title: string;
  description: string;
  stats: {
    graduates: string;
    graduatesLabel: string;
    alumni: string;
    alumniLabel: string;
    yearsExcellence: string;
    yearsExcellenceLabel: string;
    recruiters: string;
    recruitersLabel: string;
    placementRate: string;
    placementRateLabel: string;
  };
}

interface OurSuccessContextType {
  data: OurSuccessData;
  updateData: (newData: OurSuccessData) => Promise<any>;
}

const defaultData: OurSuccessData = {
  title: "Our Success",
  description: "At Translam Group of Institutions, success isn't just a goal — it's our commitment. Through years of dedication, innovation, and expert mentorship, we've helped thousands of students realize their academic and professional dreams.",
  stats: {
    graduates: "5000+",
    graduatesLabel: "Successful Graduates",
    alumni: "15000+",
    alumniLabel: "Alumni",
    yearsExcellence: "38",
    yearsExcellenceLabel: "Of Educational Excellence",
    recruiters: "100+",
    recruitersLabel: "Recruiters",
    placementRate: "90%",
    placementRateLabel: "Placement Success Rate"
  }
};

const OurSuccessContext = createContext<OurSuccessContextType | undefined>(undefined);

export const useOurSuccess = () => {
  const context = useContext(OurSuccessContext);
  if (!context) {
    throw new Error('useOurSuccess must be used within an OurSuccessProvider');
  }
  return context;
};

export const OurSuccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OurSuccessData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/our-success');
        if (response.ok) {
          const apiData = await response.json();
          // Transform backend data to match frontend structure
          const transformedData: OurSuccessData = {
            title: apiData.heroTitle || defaultData.title,
            description: apiData.content || defaultData.description,
            stats: {
              graduates: apiData.successStories?.[0]?.graduates || defaultData.stats.graduates,
              graduatesLabel: apiData.successStories?.[0]?.graduatesLabel || defaultData.stats.graduatesLabel,
              alumni: apiData.successStories?.[0]?.alumni || defaultData.stats.alumni,
              alumniLabel: apiData.successStories?.[0]?.alumniLabel || defaultData.stats.alumniLabel,
              yearsExcellence: apiData.successStories?.[0]?.yearsExcellence || defaultData.stats.yearsExcellence,
              yearsExcellenceLabel: apiData.successStories?.[0]?.yearsExcellenceLabel || defaultData.stats.yearsExcellenceLabel,
              recruiters: apiData.successStories?.[0]?.recruiters || defaultData.stats.recruiters,
              recruitersLabel: apiData.successStories?.[0]?.recruitersLabel || defaultData.stats.recruitersLabel,
              placementRate: apiData.successStories?.[0]?.placementRate || defaultData.stats.placementRate,
              placementRateLabel: apiData.successStories?.[0]?.placementRateLabel || defaultData.stats.placementRateLabel
            }
          };
          setData(transformedData);
        }
      } catch (error) {
        console.error('Failed to fetch Our Success data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = async (newData: OurSuccessData) => {
    try {
      // Transform frontend data to match backend structure
      const backendData = {
        heroTitle: newData.title,
        content: newData.description,
        successStories: [newData.stats] // Store stats as the first success story
      };
      
      const response = await fetch('http://localhost:4000/api/our-success', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(newData);
        // Return the response data so the component can handle the alert
        return responseData;
      } else {
        throw new Error('Failed to update Our Success data');
      }
    } catch (error) {
      console.error('Failed to update Our Success data:', error);
      throw error;
    }
  };

  return (
    <OurSuccessContext.Provider value={{ data, updateData }}>
      {children}
    </OurSuccessContext.Provider>
  );
};