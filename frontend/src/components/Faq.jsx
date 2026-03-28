import React from 'react'
import { assets } from '../assets/data'
import Title from './Title'

const Faq = () => {

  const [openIndex, setOpenIndex] = React.useState(null)
  const faqsData = [
    {
      question: "How quickly can I book a property?",
      answer: "You can find and book your ideal home in seconds with minimal wait time for a smooth experience."
    },
    {
      question: "Can I customize my property search?",
      answer: "Yes, you can filter by size, type, amenities, price and location to match your exact needs."
    },
    {
      question: "Do you show properties based on my preference?",
      // answer: "Yes, we display listings tailored to your city such as Itahari, Dharan, Biratnagar, and other locations across Nepal."
      answer: "Yes, we display listings based on your preferences across Nepal."
    },
    {
      question: "Are the property listings verified?",
      answer: "All properties are carefully checked for authenticity, so you can rent with confidence."
    },
    {
      question: "Can I find homes near schools or markets?",
      answer: "Yes, you can explore homes near schools, markets, and transportation for a more convenient lifestyle."
    }
  ]


  return (
    <section className='max-padd-container py-14 xl:py-20'>
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
        </div>   {/*image section ends here */}



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
                  <img
                    src={assets.down}
                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </div>
                <p className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>    {/*right div ends here */}

      </div>
    </section>
  )
}

export default Faq