import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ContactForm from './components/ContactForm';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [counters, setCounters] = useState({
    communities: 0,
    lives: 0,
    programs: 0,
    years: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const galleryImages = [
    { src: "NW_Kids (4).jpg", alt: "Meeting with dignitaries" },
    { src: "NW_Dignitaties (3).jpg", alt: "Northeast India initiatives" },
    { src: "NW_NorthEast (6).jpg", alt: "Community engagement with children" },
    { src: "NW_Dignitaties (6).jpg", alt: "Community meetings" },
    { src: "NW_Kids (2).jpg", alt: "Educational programs" },
    { src: "NW_Dignitaties (7).jpg", alt: "Community activities" },
    { src: "NW_NorthEast (2).jpg", alt: "Leadership meetings" },
    { src: "NW_NorthEast (4).jpg", alt: "Northeast programs" },
    { src: "abc (1).jpg", alt: "Leadership meetings" },
    { src: "NW_NorthEast (3).jpg", alt: "Community engagement" },
    { src: "NW_Kids (3).jpg", alt: "Social initiatives" },
  ];

  const totalItems = galleryImages.length;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const rotateCarousel = (direction: number) => {
    setCurrentIndex((prev) => {
      if (direction > 0) {
        // Moving forward: if at last item, go to first
        return prev === totalItems - 1 ? 0 : prev + 1;
      } else {
        // Moving backward: if at first item, go to last
        return prev === 0 ? totalItems - 1 : prev - 1;
      }
    });
  };

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Auto-rotate carousel
    const interval = setInterval(() => {
      rotateCarousel(1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Track active section for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'gallery', 'impact', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            
            // Trigger counter animation when impact section comes into view
            if (section === 'impact' && !hasAnimated) {
              setHasAnimated(true);
              animateCounters();
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = {
      communities: 200,
      lives: 5000,
      programs: 34,
      years: 25
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        communities: Math.floor(targets.communities * easeOut),
        lives: Math.floor(targets.lives * easeOut),
        programs: Math.floor(targets.programs * easeOut),
        years: Math.floor(targets.years * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        // Ensure final values are exact
        setCounters(targets);
      }
    }, stepDuration);
  };

  const getItemStyle = (index: number) => {
    const offset = index - currentIndex;
    const absOffset = Math.abs(offset);
    
    // Responsive spacing and sizing
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    
    let translateX = offset * (isMobile ? 120 : isTablet ? 200 : 280);
    let translateZ = -absOffset * (isMobile ? 60 : isTablet ? 90 : 120);
    let rotateY = offset * (isMobile ? -15 : -25);
    let scale = 1 - absOffset * (isMobile ? 0.08 : 0.12);
    let opacity = 1 - absOffset * (isMobile ? 0.2 : 0.15);
    
    // Center item gets special treatment
    if (offset === 0) {
      translateZ = isMobile ? 50 : isTablet ? 75 : 100;
      scale = isMobile ? 1.1 : isTablet ? 1.2 : 1.3;
      opacity = 1;
      rotateY = 0;
    }
    
    // Limit visible items based on screen size
    const maxVisible = isMobile ? 2 : 3;
    if (absOffset > maxVisible) {
      opacity = 0;
      scale = isMobile ? 0.4 : 0.6;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: Math.max(0, opacity),
      zIndex: 10 - absOffset,
      filter: absOffset > 1 ? `blur(${absOffset * (isMobile ? 1 : 1.5)}px)` : 'none'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm" data-aos="fade-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <a href="#home" className="flex items-center gap-2 text-decoration-none">
              <img src="logo.png" alt="NewWays Bharat logo" className="h-6 sm:h-8" />
            </a>
          </div>
          <nav className="hidden md:flex gap-4 lg:gap-8">
            <a href="#about" className={`font-medium transition-all duration-300 px-2 lg:px-4 py-1 rounded-lg border text-sm lg:text-base ${activeSection === 'about' ? 'text-blue-800 bg-blue-100 border-blue-300' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 hover:border-blue-300 border-transparent'}`}>About</a>
            <a href="#services" className={`font-medium transition-all duration-300 px-2 lg:px-4 py-1 rounded-lg border whitespace-nowrap text-sm lg:text-base ${activeSection === 'services' ? 'text-blue-800 bg-blue-100 border-blue-300' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 hover:border-blue-300 border-transparent'}`}>Our Work</a>
            <a href="#gallery" className={`font-medium transition-all duration-300 px-2 lg:px-4 py-1 rounded-lg border text-sm lg:text-base ${activeSection === 'gallery' ? 'text-blue-800 bg-blue-100 border-blue-300' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 hover:border-blue-300 border-transparent'}`}>Gallery</a>
            <a href="#impact" className={`font-medium transition-all duration-300 px-2 lg:px-4 py-1 rounded-lg border text-sm lg:text-base ${activeSection === 'impact' ? 'text-blue-800 bg-blue-100 border-blue-300' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 hover:border-blue-300 border-transparent'}`}>Impact</a>
            <a href="#contact" className={`font-medium transition-all duration-300 px-2 lg:px-4 py-1 rounded-lg border text-sm lg:text-base ${activeSection === 'contact' ? 'text-blue-800 bg-blue-100 border-blue-300' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 hover:border-blue-300 border-transparent'}`}>Contact</a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/Background image.png")' }}
        ></div>
        {/* Blue Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-fun-blue/80 to-elephant/80"></div>
        {/* Additional Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Empowering Rural India, Together
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 font-light px-4">
            Driving transformation through education, technology, entrepreneurship, and social welfare 
            for a stronger, self-reliant Bharat
          </p>
          <a 
            href="#about" 
            className="inline-block bg-cerulean text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-mariner transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More About Our Mission
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fun-blue mb-4 relative">
              About Our Federation
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cerulean rounded mt-2"></div>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Building bridges between traditional values and modern innovation for sustainable community development
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <img 
                data-aos="fade-right"
                src="NW_Dayanandji.jpg" 
                alt="Founder" 
                className="w-full max-w-xs sm:max-w-sm mx-auto rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div data-aos="fade-left">
              <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed px-4 md:px-0">
                NEWays Bharat Federation is a national initiative focused on <strong>uplifting communities</strong> 
                through grassroots movements in education, science, entrepreneurship, and social reform. Founded with 
                a vision to bridge traditional values and modern innovation, we are committed to building a 
                <strong> sustainable and empowered India</strong>.
              </p>
              
              <div className="bg-cerulean/10 p-4 sm:p-6 rounded-xl border-l-4 border-fun-blue mx-4 md:mx-0">
                <p className="italic text-gray-700 mb-4 text-sm sm:text-base">
                  "My journey is dedicated to empowering communities, fostering self-reliance, and connecting 
                  people through education, social service, and leadership. Progress begins when we uplift 
                  others and create opportunities for growth."
                </p>
                <div className="text-fun-blue font-semibold text-right text-sm sm:text-base">
                  – Dayanand Dhonduji Sawant, Founder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fun-blue mb-4 relative">
              Our Areas of Impact
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cerulean rounded mt-2"></div>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive programs designed to create lasting change in rural communities
            </p>
          </div>
          
          {/* Grid Layout - 3 columns per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
  title: "Grassroots Work in Northeast",
  shortDesc: "From relief efforts to entrepreneurship, NEWays Bharat Federation has been connecting remote tribal communities of Northeast India to the national mainstream.",
  fullDesc: "From relief efforts to entrepreneurship, NEWays Bharat Federation has been connecting remote tribal communities of Northeast India to the national mainstream — empowering artisans, students, and farmers through education, market access, and virtual collaborations since the 1990s. Our comprehensive approach includes skill development programs, market linkage initiatives, and digital literacy campaigns that have transformed countless lives across the region.",
  images: ["NW_NorthEast (2).jpg", "NW_NorthEast (10).jpg"],
  imageAlts: ["Relief initiative in Northeast India", "Promotion of tribal products in Northeast India"]
},
{ 
  title: "Har Ghar Ram Mandir", 
  shortDesc: "As part of the 'Har Ghar Ram Mandir' initiative, symbolic Ram Mandirs were distributed to leaders across India.",
  fullDesc: "As part of the 'Har Ghar Ram Mandir' initiative, symbolic Ram Mandirs were distributed to leaders like Shri Prithviraj Chavan, Shrikant Bhartiya, Sudhir Mungantiwar, and others on 22 January 2024. This nationwide outreach symbolizes 'Rashtra Bhiman' — bringing Lord Ram's ideals into every household. The initiative has strengthened cultural bonds and promoted unity across diverse communities, creating a sense of shared heritage and spiritual connection.",
  images: ["sample.jpg", "NW_Ram (2).jpg"],
  imageAlts: ["Symbolic Ram Mandir distribution event", "Indian leaders with Ram Mandir gift"]
},
{
  title: "Northeast India Promotion",
  shortDesc: "During Diwali at Lokmanya Seva Sangh, we showcased unique tribal products and culture from Northeast India.",
  fullDesc: "During Diwali at Lokmanya Seva Sangh, we showcased unique tribal products and culture from Northeast India. Visitors engaged with enthusiasm, learning about local crafts, tourism, and rural innovation — bridging connections beyond language and region. The event featured traditional handloom products, organic teas, bamboo crafts, and tribal jewelry, creating awareness about the rich cultural heritage and economic potential of the Northeast region.",
  images: ["NW_NorthEast (15).jpg", "NW_NorthEast (12).jpg"],
  imageAlts: ["Display of Northeast India handicrafts", "Visitors exploring tribal product stall"]
},
{
  title: "Connecting Rural to Urban",
  shortDesc: "At the centenary Diwali Consumer Peth, NEWays Bharat Federation showcased rural Northeast India's treasures.",
  fullDesc: "At the centenary Diwali Consumer Peth of Lokmanya Seva Sangh, NEWays Bharat Federation set up a joint stall with Namaste Mirror Monthly to showcase rural Northeast India's treasures — wild honey, high-curcumin turmeric, bamboo jewelry, blue/green tea, and Diwali gift boxes. With growing interest from Mumbai's conscious consumers, the initiative aims to bridge Northeast farmers, artisans, and tourism with urban markets and awareness, creating sustainable economic opportunities.",
  images: ["NW_Product (1).jpg", "NW_Product (2).jpg"],
  imageAlts: ["Assorted Diwali gift boxes from Northeast India", "Visitors browsing rural products stall"]
},
{
  title: "Flood Relief in Assam",
  shortDesc: "In response to Assam's devastating floods, NEWays Bharat Federation collaborated with local groups to provide comprehensive relief and rehabilitation support.",
  fullDesc: "In response to Assam's devastating floods of 2022, NEWays Bharat Federation collaborated with local groups like 'Saffron Republic' in Barpeta to deliver comprehensive relief and rehabilitation support. Our immediate response included emergency essentials — food packets, clean drinking water, hygiene kits, and medical supplies — reaching over 5,000 affected families across 15 villages. Beyond immediate relief, we established long-term rehabilitation programs including temporary shelters, educational support for displaced children, and livelihood restoration initiatives for affected farmers and artisans. Inspired by this impactful work, patrons including Rajendra Joshi and Anil Vankudre stepped forward with generous support. One well-wisher also anonymously contributed towards building a new classroom and modern blackboard after learning about the educational challenges in the flood-affected Northeast. Our ongoing commitment includes disaster preparedness training, early warning systems, and community resilience building programs.",
  images: ["NW_Floods (2).jpg", "NW_Article (2).jpg"],
  imageAlts: ["Volunteers distributing relief materials in Assam floods", "Group photo of relief team in Barpeta, Assam"]
},
{
  title: "Social-Entrepreneurial Bridge",
  shortDesc: "Through programs like the Manipur–Mumbai Virtual Summit, we're building bridges between tribal producers and urban markets.",
  fullDesc: "Through programs like the Manipur–Mumbai Virtual Summit, NEWays Bharat Federation is building a dynamic bridge between Northeast India's tribal producers and urban markets. From supporting underrepresented talents like Gohila Boro to showcasing traditional products and enabling student-industry collaboration, NEWays empowers communities with training, trade, and national visibility. This creates sustainable economic models that preserve cultural heritage while generating income.",
  images: ["NW_Conferrence (1).jpg", "NW_Conferrence (2).jpg"],
  imageAlts: ["Virtual summit session between Manipur and Mumbai", "Showcase of traditional tribal products"]
},
{
  title: "Home Tourism & Tribal Enterprise",
  shortDesc: "NEWays Bharat Federation is promoting rural economic growth through Home Tourism in Northeast India.",
  fullDesc: "NEWays Bharat Federation is promoting rural economic growth in Northeast India through Home Tourism, where urban guests stay with tribal families — like the Angami community in Viswema, Nagaland. Alongside, efforts are ongoing to market bamboo crafts, handloom silks, and organic farm produce across Indian cities, bridging cultures and boosting village economies while preserving traditional knowledge and skills.",
  images: ["NW_Tribal (1).jpg", "NW_Tribal (2).jpg"],
  imageAlts: ["Homestay experience with Angami family in Nagaland", "Bamboo crafts and silk products from Northeast India"]
}

            ].map((service, index) => {
              const [isExpanded, setIsExpanded] = useState(false);
              
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden group cursor-pointer"
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {/* Image Gallery */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="flex h-full">
                      {/* Show only second image when expanded, otherwise show first image */}
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src={isExpanded ? service.images[1] : service.images[0]}
                          alt={isExpanded ? service.imageAlts[1] : service.imageAlts[0]}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-fun-blue mb-3 group-hover:text-cerulean transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Description - Changes based on expansion state */}
                    <div className="transition-all duration-300">
                      {isExpanded ? (
                        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                          {service.fullDesc}
                        </p>
                      ) : (
                        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm line-clamp-3">
                          {service.shortDesc}
                        </p>
                      )}
                    </div>
                    
                    {/* Show More Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-cerulean font-semibold text-xs sm:text-sm hover:text-fun-blue transition-colors duration-300 flex items-center gap-1 group-hover:gap-2">
                        {isExpanded ? 'Show Less' : 'Show More'}
                        <svg 
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-x-1'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverflow Gallery Section */}
      <section id="gallery" className="py-20 bg-white overflow-hidden">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-4 relative">
              Our Journey in Pictures
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500 rounded mt-2"></div>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Moments that capture our commitment to community development and social change
            </p>
          </div>
          
          {/* Enhanced Coverflow Container */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mb-8 sm:mb-12" style={{ perspective: '1500px' }} data-aos="fade-up" data-aos-delay="200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-7xl mx-auto" style={{ transformStyle: 'preserve-3d' }}>
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="absolute left-1/2 top-1/2 w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-60 lg:w-96 lg:h-72 cursor-pointer transition-all duration-1000 ease-out rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white"
                    style={{
                      ...getItemStyle(index),
                      marginLeft: window.innerWidth < 640 ? '-6rem' : window.innerWidth < 768 ? '-8rem' : window.innerWidth < 1024 ? '-10rem' : '-12rem',
                      marginTop: window.innerWidth < 640 ? '-4.5rem' : window.innerWidth < 768 ? '-6rem' : window.innerWidth < 1024 ? '-7.5rem' : '-9rem'
                    }}
                    onClick={() => goToSlide(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover object-center transition-all duration-500 hover:brightness-110 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
                        <p className="text-xs sm:text-sm font-semibold bg-black/50 px-2 sm:px-3 py-1 rounded-lg">{image.alt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
            <button 
              onClick={() => rotateCarousel(-1)}
              className="bg-fun-blue text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-semibold hover:bg-tory-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button 
              onClick={() => rotateCarousel(1)}
              className="bg-fun-blue text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-semibold hover:bg-tory-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Enhanced Indicators */}
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap px-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-fun-blue scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-cerulean/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="py-20 bg-gradient-to-r from-fun-blue to-venice-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 relative">Our Impact
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cerulean rounded mt-2"></div>
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto px-4">
              Numbers that reflect our commitment to community development
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            {[
              { key: "communities", number: counters.communities, suffix: "+", label: "Communities Reached" },
              { key: "lives", number: counters.lives, suffix: "+", label: "Lives Impacted" },
              { key: "programs", number: counters.programs, suffix: "+", label: "Community Programs" },
              { key: "years", number: counters.years, suffix: "+", label: "Years of Service" }
            ].map((stat, index) => (
              <div key={index} className="p-4 sm:p-6 lg:p-8" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cerulean mb-2">
                  {stat.key === "lives" ? stat.number.toLocaleString() : stat.number}{stat.suffix}
                </div>
                <div className="text-sm sm:text-base lg:text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-fun-blue mb-4 relative">
              Get In Touch
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cerulean rounded mt-2"></div>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Join us in our mission to create a resilient and empowered Bharat
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <ContactForm className="" data-aos="fade-right" />
            
            {/* Contact Information */}
            <div className="bg-cerulean/10 p-6 sm:p-8 rounded-2xl" data-aos="fade-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-fun-blue mb-6 sm:mb-8">Contact Information</h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: Phone, title: "Phone", info: "+91 9820939957" },
                  { icon: Mail, title: "Email", info: "info@newaysbharat.org", link: "mailto:info@newaysbharat.org" },
                  { icon: MapPin, title: "Address", info: "Mumbai, Maharashtra, India" },
                  { icon: Facebook, title: "Facebook", info: "NEWays Bharat Federation", link: "https://facebook.com/newaysbharatfederation" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-300">
                    <div className="bg-fun-blue text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <contact.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{contact.title}</h4>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-fun-blue hover:text-cerulean transition-colors duration-300 hover:underline break-words text-sm sm:text-base"
                          target={contact.link.startsWith('mailto:') ? '_self' : '_blank'}
                          rel={contact.link.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                        >
                          {contact.info}
                        </a>
                      ) : (
                        <p className="text-gray-600 break-words text-sm sm:text-base">{contact.info}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Image below contact information */}
              <div className="mt-6 sm:mt-8 w-full flex justify-center" data-aos="fade-up" data-aos-delay="300">
                <img 
                  src="NW_Article.jpg" 
                  alt="NEWays Bharat Federation Mission" 
                  className="max-w-xs sm:max-w-sm rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-elephant text-white text-center py-12" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-sm sm:text-base lg:text-lg opacity-90">
            &copy; NEWays Bharat Federation | Empowering India at the Grassroots  <br />
            Made by <a href = "https://adsmagnify.com/" className="underline text-white hover:text-gray-400"> adsmagnify.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
