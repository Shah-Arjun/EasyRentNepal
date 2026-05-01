import React from "react";
import Title from "./Title";
import { assets } from "../assets/data";



// features list
const info = [
  {
    num: 1,
    icon: assets.calendarSecondary,
    text: "In-app scheduling for property viewings",
  },
  {
    num: 2,
    icon: assets.graph,
    text: "100% transparent pricing",
  },
  {
    num: 3,
    icon: assets.map,
    text: "User-friendly interface for smooth navigation",
  },
  {
    num: 4,
    icon: assets.map,
    text: "Access to off-market properties",
  },
];



// client / raters
const clients = [
  { img: assets.client1 },
  { img: assets.client4 },
  { img: assets.client1 },
];



const About = () => {
  return (
    <section className="max-padd-container py-16 xl:py-28 !pt-36">
      {/* Container */}
      <div className="flex  items-center flex-col lg:flex-row gap-12">
        {/* Info - Left Side/div */}
        <div className="flex-1">
          <Title
            title1={"Your Trusted Home Rental Partner"}
            title2={"Helping You Every Step of the Way"}
            para={
              "Trust, clarity and simplicity are the core of everything we do to make your property journey easy."
            }
            titleStyles={"mb-10"}
          />

          {/* features list */}
          <div className="flex flex-col gap-6 mt-5">
            {info.map((data, index) => (
              <div key={data.num || index} className="flex gap-3">
                <img src={data.icon} alt="" width={20} />
                <p>{data.text}</p>
              </div>
            ))}
          </div> {/* features list section ends here*/}


          {/* Rating */}
          <div className="flex items-center divide-x divide-gray-300 mt-11">
            <div className="flex -space-x-3 pr-3">
              {clients.map((c, i) => (
                <img
                  key={c.id || i}
                  src={c.img || "/def"}
                  alt="client"
                  className="w-12 h-12 rounded-full border-2 border-white hover:-translate-y-1 transition z-10"
                />
              ))}
            </div>

            <div className="pl-3">
              <div className="flex items-center">
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.star} alt="starIcon" width={17} />
                <img src={assets.starHalf} alt="starIcon" width={17} />
                <p className="text-gray-600 medium-16 ml-2">4.5</p>
              </div>
              <p className="text-sm text-gray-500">
                Trusted by{' '}
                <span className="font-medium text-gray-800">1,000+</span> users
              </p>
            </div>
          </div> {/* rating section ends here */}
        </div>  {/* left div ends here */}



        {/* Image - Right Side */}
        <div className="flex-1">
          <div className="relative flex justify-end">
            <img src={assets.about} alt="aboutImg" className="rounded-3xl" />
          </div>
        </div>

      </div>   {/* container ends here */}
    </section>
  );
};

export default About;
