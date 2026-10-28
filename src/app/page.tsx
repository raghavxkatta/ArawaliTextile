import { BackToTop } from "@/components/BackToTop";
import { Collections } from "@/components/Collections";
import { Contact } from "@/components/Contact";
import { Craft } from "@/components/Craft";
import { CustomFeature } from "@/components/CustomFeature";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Heritage } from "@/components/Heritage";
import { JsonLd } from "@/components/JsonLd";
import { MotifBand } from "@/components/MotifBand";
import { OrderTimeline } from "@/components/OrderTimeline";
import { RevealObserver } from "@/components/RevealObserver";
import { TopBar } from "@/components/TopBar";

export default function Home() {
  return (
    <>
      <JsonLd />
      <TopBar />
      <Header />
      <main id="top">
        <Hero />
        <MotifBand />
        <Heritage />
        <Collections>
          <CustomFeature />
        </Collections>
        <Craft />
        <OrderTimeline />
        <Gallery />
        <Contact />
        <MotifBand />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <RevealObserver />
    </>
  );
}
