"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  text: string;
  stars: number;
  order: number;
  isActive: boolean;
}

interface TestimonialData {
  label: string;
  title: string;
  descriptions: string[];
  testimonials: Testimonial[];
}

interface TestimonialContextType {
  data: TestimonialData;
  updateData: (newData: TestimonialData) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  getActiveTestimonials: () => Testimonial[];
}

const defaultData: TestimonialData = {
  label: "TESTIMONIAL",
  title: "What Student Say?",
  descriptions: [
    "TOTC has got more than 100k positive ratings from our users around the world.",
    "Some of the students and teachers were greatly helped by the Skilline.",
    "Are you too? Please give your assessment"
  ],
  testimonials: [
    {
      id: '1',
      name: 'Gloria Rose',
      image: '/images/testimonial-slide1.png',
      text: "Thank you so much for your help. It's exactly what I've been looking for. You won't regret it. It really saves me time and effort. TOTC is exactly what our business has been lacking.",
      stars: 5,
      order: 0,
      isActive: true
    },
    {
      id: '2',
      name: 'Alex Smith',
      image: '/images/testimonial-slide1.png',
      text: "TOTC helped me organize my study schedule and improved my grades. Highly recommended!",
      stars: 5,
      order: 1,
      isActive: true
    },
    {
      id: '3',
      name: 'Priya Patel',
      image: '/images/testimonial-slide1.png',
      text: "The tools for teachers and students are fantastic. My classroom is more productive than ever.",
      stars: 5,
      order: 2,
      isActive: true
    }
  ]
};

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const useTestimonial = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error('useTestimonial must be used within a TestimonialProvider');
  }
  return context;
};

export const TestimonialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TestimonialData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/testimonials');
        if (response.ok) {
          const testimonials = await response.json();
          // Transform backend testimonials to match frontend structure
          const transformedTestimonials: Testimonial[] = testimonials.map((t: any) => ({
            id: t.id.toString(),
            name: t.name,
            // Ensure image URLs are absolute paths pointing to backend
            image: t.image?.startsWith('/uploads/') 
              ? `http://localhost:4000${t.image}`
              : t.image,
            text: t.content,
            stars: t.rating,
            order: 0, // Backend doesn't have order, use default
            isActive: t.isActive
          }));
          
          setData(prev => ({
            ...prev,
            testimonials: transformedTestimonials
          }));
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = (newData: TestimonialData) => {
    setData(newData);
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      // Transform to backend format
      const backendData = {
        name: testimonial.name,
        role: 'Student', // Default role
        company: '',
        // Convert absolute URLs back to relative paths for storage
        image: testimonial.image?.startsWith('http://localhost:4000') 
          ? testimonial.image.replace('http://localhost:4000', '')
          : testimonial.image,
        content: testimonial.text,
        rating: testimonial.stars,
        isActive: testimonial.isActive
      };
      
      const response = await fetch('http://localhost:4000/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        const newTestimonial = await response.json();
        const transformedTestimonial: Testimonial = {
          id: newTestimonial.id.toString(),
          name: newTestimonial.name,
          // Ensure image URLs are absolute paths for frontend display
          image: newTestimonial.image?.startsWith('/uploads/') 
            ? `http://localhost:4000${newTestimonial.image}`
            : newTestimonial.image,
          text: newTestimonial.content,
          stars: newTestimonial.rating,
          order: testimonial.order,
          isActive: newTestimonial.isActive
        };
        
        setData(prev => ({
          ...prev,
          testimonials: [...prev.testimonials, transformedTestimonial]
        }));
      } else {
        throw new Error('Failed to add testimonial');
      }
    } catch (error) {
      console.error('Failed to add testimonial:', error);
      throw error;
    }
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Omit<Testimonial, 'id'>) => {
    try {
      const backendData = {
        name: updatedTestimonial.name,
        role: 'Student',
        company: '',
        // Convert absolute URLs back to relative paths for storage
        image: updatedTestimonial.image?.startsWith('http://localhost:4000') 
          ? updatedTestimonial.image.replace('http://localhost:4000', '')
          : updatedTestimonial.image,
        content: updatedTestimonial.text,
        rating: updatedTestimonial.stars,
        isActive: updatedTestimonial.isActive
      };
      
      const response = await fetch(`http://localhost:4000/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          testimonials: prev.testimonials.map(testimonial => 
            testimonial.id === id 
              ? { ...testimonial, ...updatedTestimonial }
              : testimonial
          )
        }));
      } else {
        throw new Error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          testimonials: prev.testimonials.filter(testimonial => testimonial.id !== id)
        }));
      } else {
        throw new Error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      throw error;
    }
  };

  const getActiveTestimonials = () => {
    return data.testimonials
      .filter(testimonial => testimonial.isActive)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <TestimonialContext.Provider value={{ 
      data, 
      updateData, 
      addTestimonial, 
      updateTestimonial, 
      deleteTestimonial, 
      getActiveTestimonials
    }}>
      {children}
    </TestimonialContext.Provider>
  );
};