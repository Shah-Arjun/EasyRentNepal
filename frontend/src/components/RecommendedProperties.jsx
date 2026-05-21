import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
import Item from './Item';
import ItemSkeleton from './ItemSkeleton';
import { Sparkles, ArrowRight } from 'lucide-react';

const RecommendedProperties = () => {
  const { propertyServices, isLoggedIn } = useAppContext();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await propertyServices.getRecommendations();
        if (response?.success) {
          setRecommended(response.data ?? []);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [propertyServices, isLoggedIn]); // Re-fetch when login/auth state transitions to update recommendations dynamically

  if (!loading && recommended.length === 0) {
    return null; // hide section if no properties are found
  }

  // Check if any recommended property is not a fallback (i.e. has a real similarity score)
  const hasPersonalized = recommended.some(p => !p.isTrendingFallback);

  return (
    <section className="max-padd-container relative overflow-hidden rounded-3xl">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-teal-700 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-teal-600" />
            <span>AI Smart Recommendations</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 bg-clip-text text-transparent">
            {hasPersonalized ? "Recommended For You" : "Trending & Popular Places"}
          </h2>
          
          <p className="text-slate-500 text-sm md:text-base max-w-2xl font-medium">
            {hasPersonalized 
              ? "Tailored matches calculated specifically for you based on your browsing patterns, wishlist additions, and recent search queries."
              : "Discover highly sought-after properties, handpicked based on recent tenant activity and popularity across Nepal."}
          </p>
        </div>

        <Link 
          to="/listing" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-slate-900/10 hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>Explore All</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative z-10">
        <Swiper
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          breakpoints={{
            600: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="h-[488px] md:h-[533px] xl:h-[422px] px-1 py-2"
        >
          {loading ? (
            Array(4).fill(null).map((_, idx) => (
              <SwiperSlide key={`rec-skeleton-${idx}`}>
                <ItemSkeleton />
              </SwiperSlide>
            ))
          ) : (
            recommended.map((property) => (             
              <SwiperSlide key={`rec-${property._id}`}>
                <Item property={property} />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </section>
  )
}

export default RecommendedProperties;
