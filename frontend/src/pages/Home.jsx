import Hero from '../components/Hero'
import About from '../components/About'
import FeaturedProperties from '../components/FeaturedProperties'
import RecommendedProperties from '../components/RecommendedProperties'
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import Testimonial from '../components/Testimonial'
 
const Home = () => {
  return (
    <div className="bg-gradient-to-r from-[#fffbf0] to-white">
      <Hero />
      <About />
      <FeaturedProperties />
      <RecommendedProperties />
      <Faq />
      <Cta />
      <Testimonial />
    </div>
  )
}

export default Home
