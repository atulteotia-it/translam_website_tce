import React from 'react';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
import EventsGallery from '../../components/Gallery/Gallery';

export default function EventsPage() {
  return (
    <>
      <Header />
      <EventsGallery />
      <Footer />
    </>
  );
}
