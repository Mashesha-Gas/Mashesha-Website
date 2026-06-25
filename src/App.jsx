import Header from "./components/Header";
import Hero from "./components/Hero";
import Promise from "./components/Promise";
import Products from "./components/Products";
import HowItWorks from "./components/HowItWorks";
import WhyMashesha from "./components/WhyMashesha";
import ServiceArea from "./components/ServiceArea";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Promise />
        <Products />
        <HowItWorks />
        <WhyMashesha />
        <ServiceArea />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
