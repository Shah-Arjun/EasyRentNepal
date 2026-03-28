import { assets } from "../assets/data";

// testimonials data
const cardsData = [
  {
    image: assets.user1,
    name: 'Sujal Shrestha',
    location: 'Itahari, Nepal',
    date: 'April 20, 2025',
    testimonial: "The platform's recommendations helped me find the perfect apartment quickly, and the rent prediction ensured I paid a fair price."
  },
  {
    image: assets.user2,
    name: 'Samiksha Shrestha',
    location: 'Dharan, Nepal',
    date: 'May 10, 2025',
    testimonial: "Verified listings and accurate predictions made renting a home stress-free. Highly recommend it!"
  },
  {
    image: assets.user1,
    name: 'Sujal Shrestha',
    location: 'Itahari, Nepal',
    date: 'April 20, 2025',
    testimonial: "The platform's recommendations helped me find the perfect apartment quickly, and the rent prediction ensured I paid a fair price."
  },
  {
    image: assets.user2,
    name: 'Samiksha Shrestha',
    location: 'Dharan, Nepal',
    date: 'May 10, 2025',
    testimonial: "Verified listings and accurate predictions made renting a home stress-free. Highly recommend it!"
  },
];



const Testimonial = () => {

  // function to generate card
  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0">
      <div className="flex gap-2">
        <img className="w-11 h-11 rounded-full" src={card.image} alt={`Profile image of ${card.name}`} />
        <div className="flex flex-col">
          <p className="font-semibold">{card.name}</p>
          <span className="text-xs text-slate-500">{card.location}</span>
        </div>
      </div>
      <p className="text-sm py-4 text-gray-800">{card.testimonial}</p>
      <div className="flex items-center justify-between text-slate-500 text-xs">
        <p>{card.date}</p>
      </div>
    </div>
  );


  return (
    <section className="max-padd-container py-16 xl:py-22">
      <>
      {/* css for marque */}
        <style>{`
            @keyframes marqueeScroll {
              0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
            .marquee-inner:hover {
              animation-play-state: paused;
            }
        `}</style>

        <div className="text-center mb-10">
          <h2 className="h2">What Our Users Say</h2>
          <p className="text-slate-500 mt-2">
            Real experiences from people who found their perfect homes using our platform.
          </p>
      </div>

        <div className="marquee-row overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#fffbee] to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
        </div>

        <div className="marquee-row overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#fffbee] to-transparent"></div>
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white via-transparent to-transparent"></div>
        </div>
      </>
    </section>
  )
}

export default Testimonial