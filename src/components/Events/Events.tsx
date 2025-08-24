"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Events.module.scss';
import CommonBanner from '../CommonSection/CommonBanner';

interface EventImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface EventSection {
  id: string;
  sectionName: string;
  sectionTitle?: string;
  images: EventImage[];
}

interface EventsData {
  id: number;
  slug: string;
  title: string;
  content: string;
  bannerImage: string;
  sections: EventSection[];
}

function Events() {
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIndex, setModalIndex] = useState<{ sectionIndex: number; imageIndex: number } | null>(null);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEventsData(data);
      }
    } catch (error) {
      console.error('Error fetching events data:', error);
      setEventsData({
        id: 1,
        slug: 'events',
        title: 'Events',
        content: '<p>Explore our latest events and activities.</p>',
        bannerImage: '/images/commonBanner.png',
        sections: []
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (sectionIndex: number, imageIndex: number) => {
    setModalIndex({ sectionIndex, imageIndex });
  };

  const closeModal = () => setModalIndex(null);

  const next = () => {
    if (modalIndex && eventsData?.sections) {
      const currentSection = eventsData.sections[modalIndex.sectionIndex];
      const nextImageIndex = modalIndex.imageIndex + 1;
      
      if (nextImageIndex < currentSection.images.length) {
        setModalIndex({ sectionIndex: modalIndex.sectionIndex, imageIndex: nextImageIndex });
      } else {
        const nextSectionIndex = modalIndex.sectionIndex + 1;
        if (nextSectionIndex < eventsData.sections.length && eventsData.sections[nextSectionIndex].images.length > 0) {
          setModalIndex({ sectionIndex: nextSectionIndex, imageIndex: 0 });
        }
      }
    }
  };

  const prev = () => {
    if (modalIndex && eventsData?.sections) {
      const prevImageIndex = modalIndex.imageIndex - 1;
      
      if (prevImageIndex >= 0) {
        setModalIndex({ sectionIndex: modalIndex.sectionIndex, imageIndex: prevImageIndex });
      } else {
        const prevSectionIndex = modalIndex.sectionIndex - 1;
        if (prevSectionIndex >= 0 && eventsData.sections[prevSectionIndex].images.length > 0) {
          const lastImageIndex = eventsData.sections[prevSectionIndex].images.length - 1;
          setModalIndex({ sectionIndex: prevSectionIndex, imageIndex: lastImageIndex });
        }
      }
    }
  };

  if (loading) {
    return (
      <>
        <CommonBanner 
          title={eventsData?.title || "Events"} 
          imgSrc={eventsData?.bannerImage ? `http://localhost:4000${eventsData.bannerImage}` : "/images/commonBanner.png"} 
        />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </>
    );
  }
    
  return (
    <>
      <CommonBanner 
        title={eventsData?.title || "Events"} 
        imgSrc={eventsData?.bannerImage ? `http://localhost:4000${eventsData.bannerImage}` : "/images/commonBanner.png"} 
      />
      <section className={`${styles.eventswrapper} ${styles.publicEvents}`}>
        <div className='container'>
          <div className={styles.eventContent}>
            <h2>{eventsData?.title || 'Events'}</h2>
            <div 
              dangerouslySetInnerHTML={{ 
                __html: eventsData?.content || '<p>Explore our latest events and activities.</p>' 
              }} 
            />
          </div>

          {eventsData?.sections && eventsData.sections.length > 0 ? (
            <div className={styles.sectionsContainer}>
              {eventsData.sections.map((section, sectionIndex) => (
                <div key={section.id} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionInfo}>
                      <h3>{section.sectionName}</h3>
                      {section.sectionTitle && <h4>{section.sectionTitle}</h4>}
                    </div>
                  </div>

                  {section.images && section.images.length > 0 && (
                    <div className={styles.imagesContainer}>
                      <div className={styles.imageGrid}>
                        {section.images.map((image, imageIndex) => (
                          <div key={image.id} className={styles.imageItem}>
                            <div 
                              className={styles.imageContainer}
                              onClick={() => openModal(sectionIndex, imageIndex)}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              <Image 
                                src={`http://localhost:4000${image.url}`} 
                                alt={image.title || 'Event image'} 
                                width={250}
                                height={200}
                                style={{ objectFit: 'cover' }}
                              />
                              {image.title && (
                                <div className={styles.imageTitleOverlay}>
                                  <div className={styles.imageTitle}>
                                    {image.title}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {image.description && (
                              <div className={styles.imageDescription}>
                                <p>{image.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              No events sections available yet.
            </div>
          )}

          {/* Modal for image viewing */}
          {modalIndex !== null && eventsData?.sections && (
            <div className={styles.modal} onClick={closeModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button onClick={closeModal} className={styles.closeBtn}>×</button>
                <button onClick={prev} className={styles.navBtn}>←</button>
                <div className={styles.viewer}>
                  <Image 
                    src={`http://localhost:4000${eventsData.sections[modalIndex.sectionIndex].images[modalIndex.imageIndex].url}`} 
                    alt={eventsData.sections[modalIndex.sectionIndex].images[modalIndex.imageIndex].title || 'Event image'} 
                    width={800}
                    height={600}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    style={{ objectFit: 'contain' }}
                  />
                  <div style={{ color: 'white', marginTop: '0.5rem', textAlign: 'center' }}>
                    <h4>{eventsData.sections[modalIndex.sectionIndex].images[modalIndex.imageIndex].title || 'Untitled'}</h4>
                    {eventsData.sections[modalIndex.sectionIndex].images[modalIndex.imageIndex].description && (
                      <p>{eventsData.sections[modalIndex.sectionIndex].images[modalIndex.imageIndex].description}</p>
                    )}
                  </div>
                </div>
                <button onClick={next} className={styles.navBtn}>→</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Events;