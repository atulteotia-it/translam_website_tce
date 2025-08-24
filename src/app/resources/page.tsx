import Image from "next/image";
import Header from '../../components/shared/Header/Header';
import Footer from '../../components/shared/Footer/Footer';
import Resources from '@/components/Resources/Resources';

export default function Home() {
  return (
    <>
      <Header />
        <Resources />
      <Footer />
    </>
  );
}
