"use client";
import React, { useState, useEffect } from 'react';
import styles from './Admission.module.scss';
import CommonBanner from '../CommonSection/CommonBanner';

interface AdmissionData {
  id: number;
  title: string | null;
  content: string;
  bannerImage: string;
}

const Admission = () => {
  const [admissionData, setAdmissionData] = useState<AdmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmissionData();
  }, []);

  const fetchAdmissionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/admission');
      if (response.ok) {
        const data = await response.json();
        setAdmissionData(data);
      } else {
        setError('Failed to fetch admission data');
      }
    } catch (error) {
      console.error('Error fetching admission data:', error);
      setError('Error loading admission data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Loading admission information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  const bannerImage = admissionData?.bannerImage 
    ? `http://localhost:4000${admissionData.bannerImage}`
    : "/images/commonBanner.png";

  return (
    <>
      <CommonBanner title="ADMISSION" imgSrc={bannerImage} />

      <section id="admission-procedure" className={styles.admissionsection}>
        <div className="container">
          {admissionData?.content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: admissionData.content }}
              className={styles.admissionContent}
            />
          ) : (
            <div>
              <h2><span>Admission</span> Procedure</h2>
              <p>No admission content available. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

  
      <section className={styles.admissionSection}>

        {/* 4. Admission Form */}
        <div className={styles.formSection}>
          <h3><span>Admission</span> Form</h3>
          <form>
            <div className={styles.grid}>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email" required />
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Phone No" />
              <input type="text" placeholder="Courses" />
              <input type="text" placeholder="Courses" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Admission;
