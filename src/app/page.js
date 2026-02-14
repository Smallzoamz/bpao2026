import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AnnouncementBar from '@/components/AnnouncementBar';
import ServiceCards from '@/components/ServiceCards';
import NewsSection from '@/components/NewsSection';
import Activities from '@/components/Activities';
import Tourism from '@/components/Tourism';
import Procurement from '@/components/Procurement';
import DigitalChannels from '@/components/DigitalChannels';
import Footer from '@/components/Footer';
import ScrollAnimator from '@/components/ScrollAnimator';
import WelcomeModal from '@/components/WelcomeModal';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <AnnouncementBar />
        <Hero />
        <ServiceCards />
        <NewsSection />
        <Activities />
        <Tourism />
        <Procurement />
        <DigitalChannels />
      </main>
      <Footer />
      <ScrollAnimator />
      <WelcomeModal />
    </>
  );
}
