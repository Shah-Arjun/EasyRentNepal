import React from 'react'
import { assets } from '../assets/data'
import Title from './Title'

const Faq = () => {

  const [openIndex, setOpenIndex] = React.useState(null)
  const faqsData = [
    {
      question: 'Lightning-Fast Bookings',
      answer: 'Find and book your ideal home in seconds - minimal wait times for a hassle-free experience.'
    },
    {
      question: 'Fully Customizable Homes',
      answer: 'Filter by size, type, amenities, and location to match your exact needs.'
    },
    {
      question: 'Responsive by Location',
      answer: 'View properties optimized for your city - Itahari, Dharan, Biratnagar, or anywhere in Nepal.'
    },
    {
      question: 'Verified Local Listings',
      answer: 'All properties are checked for authenticity, giving you peace of mind when renting in any Nepali city.'
    },
    {
      question: 'Community & Amenities Focused',
      answer: 'Discover homes near schools, markets, and transport, making daily life in Nepal easier and more convenient.'
    }
  ]


  return (
    <section className='max-padd-container py-16 xl:py-22'>
      {/* Container */}
      <div className='flex flex-col gap-y-12 xl:flex-row '>
        {/* Image - Left Side  */}
        <div className='flex-1'>
          <div className="relative rounded-3xl overflow-hidden inline-block">
            <img src={assets.faq} alt="faqImg" className='block w-full' />
            <div className='absolute top-5 left-5 right-5 bg-white p-3 rounded-2xl flex items-center gap-4 z-10 '>
              <img src={assets.signature} alt="signImg" width={55} />
              <div>
                <h5 className='bold-16'>Trusted by Hundreds</h5>
                <p>Trust, clarity and simplicity are the core of everything we do to make your rental journey easy.</p>
              </div>
            </div>
          </div>
        </div>
        {/* FAQs - Right Side  */}
        <div className="flex-1 flex flex-col justify-center">
          <Title
            title1={"Made to feel like home."}
            title2={"Your easy path to the perfect home."}
            para={"From finding the right location to finalizing your deal, we ensure you feel at home every step of the way."}
            titleStyles={"mb-10"}
          />
          <div className='max-w-xl w-full flex flex-col gap-4 items-start text-left'>
            {faqsData.map((faq, index) => (
              <div key={index} className='flex flex-col items-start w-full'>
                <div className='flex items-center justify-between w-full cursor-pointer bg-secondary/10 border-slate-900/10 p-2 px-4 rounded-lg' onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <h2 className='text-sm'>{faq.question}</h2>
                  <img src={assets.down} alt="arrowDown" width={20} />
                </div>
                <p className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq