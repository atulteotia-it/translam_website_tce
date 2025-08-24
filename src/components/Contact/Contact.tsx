"use client";

import React, { useState, useEffect } from 'react';
import styles from './Contact.module.scss';
import CommonBanner from '../CommonSection/CommonBanner';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

interface ContactData {
  id?: number;
  slug: string;
  title: string;
  content: string;
  heroLabel: string;
  heroHeading: string;
  contactInfoTitle: string;
  contactInfoHeading: string;
  emailLabel: string;
  emailAddress: string;
  emailHours: string;
  phoneLabel: string;
  phoneNumber: string;
  phoneHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  bannerImage: string;
}


const Contact = () => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <CommonBanner title="CONTACT US" imgSrc={contactData?.bannerImage ? `http://localhost:4000${contactData.bannerImage}` : "/images/commonBanner.png"} />
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      </>
    );
  }

  if (!contactData) {
    return (
      <>
        <CommonBanner title="CONTACT US" imgSrc={contactData?.bannerImage ? `http://localhost:4000${contactData.bannerImage}` : "/images/commonBanner.png"} />
        <div style={{ textAlign: 'center', padding: '40px' }}>Error loading contact information</div>
      </>
    );
  }

  return (
  <>
    <CommonBanner title="CONTACT US" imgSrc="/images/commonBanner.png" />

    <div className={styles.contactPage}>
    
      {/* Hero Section */}
       <div className='container'>
      <section className={styles.hero}>
        <div className={styles.left}>
          <small>{contactData.heroLabel}</small>
          <h1 style={{ whiteSpace: 'pre-line' }}>{contactData.heroHeading}</h1>
        </div>
        <div className={styles.right}>
          <a href={contactData.facebookUrl}><FaFacebookF /></a>
          <a href={contactData.instagramUrl}><FaInstagram /></a>
        </div>
      </section>
</div>
      {/* Contact Form */}
      <div className='container'>
      <section className={styles.formSection}>
        <form >
          <div className={styles.inputsRow}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Phone Number (optional)" />
          </div>
          <textarea placeholder="Message" rows="5" required></textarea>
          <button type="submit">Leave us a Message →</button>
        </form>
      </section>
      </div>

      {/* Contact Info */}
      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          <div className={styles.block} style={{border:'none'}}>
            <h5>{contactData.contactInfoTitle}</h5>
            <h2 style={{ whiteSpace: 'pre-line' }}>{contactData.contactInfoHeading}</h2>
          </div>
          <div className={styles.block}>
            <h5>{contactData.emailLabel}</h5>
            <p><strong>{contactData.emailAddress}</strong></p>
            <span style={{ whiteSpace: 'pre-line' }}>{contactData.emailHours}</span>
          </div>
          <div className={styles.block}>
            <h5>{contactData.phoneLabel}</h5>
            <p><strong>{contactData.phoneNumber}</strong></p>
            <span style={{ whiteSpace: 'pre-line' }}>{contactData.phoneHours}</span>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className={styles.map}>
        <iframe
          src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=Translam Group of Institutions Mawana Road, Meerut – 250001&t=&z=14&ie=UTF8&iwloc=B&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </>
  );
};

export default Contact;
