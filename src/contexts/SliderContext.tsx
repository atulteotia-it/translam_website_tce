"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Slider {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface SliderContextType {
  sliders: Slider[];
  addSlider: (slider: Omit<Slider, 'id'>) => Promise<void>;
  updateSlider: (id: string, slider: Omit<Slider, 'id'>) => Promise<void>;
  deleteSlider: (id: string) => Promise<void>;
  getActiveSliders: () => Slider[];
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSlider must be used within a SliderProvider');
  }
  return context;
};

const defaultSliders: Slider[] = [
  {
    id: '1',
    title: 'TRANSLAM Group of Institutions',
    subtitle: 'Shaping Futures with Excellence in Education Since 1987',
    image: '/images/teenage-girl.png',
    order: 0,
    isActive: true
  },
  {
    id: '2',
    title: 'TRANSLAM Group of Institutions',
    subtitle: 'Empowering Students Since 1987',
    image: '/images/boy-image.webp',
    order: 1,
    isActive: true
  }
];

export const SliderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sliders, setSliders] = useState<Slider[]>(defaultSliders);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from API after hydration
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/home-sliders');
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match frontend structure
          const transformedSliders = data.map((slider: any) => ({
            ...slider,
            id: slider.id.toString(), // Convert number id to string
            // Ensure image URLs are absolute paths pointing to backend
            image: slider.image.startsWith('/uploads/') 
              ? `http://localhost:4000${slider.image}`
              : slider.image
          }));
          setSliders(transformedSliders);
        }
      } catch (error) {
        console.error('Failed to fetch sliders:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchSliders();
  }, []);

  const addSlider = async (slider: Omit<Slider, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/api/home-sliders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slider),
      });

      if (response.ok) {
        const newSlider = await response.json();
        // Transform the new slider to match frontend structure
        const transformedSlider = {
          ...newSlider,
          id: newSlider.id.toString(),
          // Ensure image URLs are absolute paths pointing to backend
          image: newSlider.image.startsWith('/uploads/') 
            ? `http://localhost:4000${newSlider.image}`
            : newSlider.image
        };
        setSliders([...sliders, transformedSlider]);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to add slider: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to add slider:', error);
      throw error;
    }
  };

  const updateSlider = async (id: string, updatedSlider: Omit<Slider, 'id'>) => {
    try {
      const response = await fetch(`http://localhost:4000/api/home-sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSlider),
      });

      if (response.ok) {
        const updated = await response.json();
        // Transform the updated slider to match frontend structure
        const transformedSlider = {
          ...updated,
          id: updated.id.toString(),
          // Ensure image URLs are absolute paths pointing to backend
          image: updated.image.startsWith('/uploads/') 
            ? `http://localhost:4000${updated.image}`
            : updated.image
        };
        setSliders(sliders.map(slider => 
          slider.id === id ? transformedSlider : slider
        ));
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to update slider: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to update slider:', error);
      throw error;
    }
  };

  const deleteSlider = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/home-sliders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSliders(sliders.filter(slider => slider.id !== id));
      } else {
        throw new Error('Failed to delete slider');
      }
    } catch (error) {
      console.error('Failed to delete slider:', error);
      throw error;
    }
  };

  const getActiveSliders = () => {
    return sliders
      .filter(slider => slider.isActive)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <SliderContext.Provider value={{ sliders, addSlider, updateSlider, deleteSlider, getActiveSliders }}>
      {children}
    </SliderContext.Provider>
  );
};