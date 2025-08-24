import React from 'react';
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
import EventsGallery from '../../components/Events/EventsGallery';

export default function EventsGalleryPage() {
  return (
    <>
      <Header />
      <EventsGallery />
      <Footer />
    </>
  );
}
