"use client";
import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

interface ShortNews {
  id: number;
  title: string;
  is_active: boolean | number;
  createdAt: string;
  updatedAt: string;
}

const ShortNewsTicker: React.FC = () => {
  const [shortNews, setShortNews] = useState<ShortNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveShortNews = async () => {
      try {
        const response = await fetch('/api/short-news/active');
        if (response.ok) {
          const data = await response.json();
          setShortNews(data.shortNews || []);
        }
      } catch (error) {
        console.error('Error fetching short news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveShortNews();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        backgroundColor: '#8B4A4A', 
        color: 'white', 
        padding: '8px 0', 
        fontSize: '14px',
        textAlign: 'center'
      }}>
        Loading news...
      </div>
    );
  }

  if (!shortNews.length) {
    return (
      <div style={{ 
        backgroundColor: '#8B4A4A', 
        color: 'white', 
        padding: '8px 0', 
        fontSize: '14px',
        textAlign: 'center'
      }}>
        Welcome to our website! Explore our courses and programs.
      </div>
    );
  }

  const newsText = shortNews.map(news => `"${news.title}"`).join(', ');

  return (
    <div style={{ 
      backgroundColor: '#8B4A4A', 
      color: 'white', 
      padding: '8px 0', 
      fontSize: '14px' 
    }}>
      <Marquee speed={50} gradient={false}>
        {newsText}
      </Marquee>
    </div>
  );
};

export default ShortNewsTicker;