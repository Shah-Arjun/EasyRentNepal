import React, { useState } from "react";

const PropertyImages = ({ property }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0)

  const imageCaptions = [
    {
      heading: "Front View",
      desc: "A welcoming exterior with modern design and excellent curb appeal, giving a great first impression.",
    },
    {
      heading: "Modern Kitchen",
      desc: "Fully equipped modern kitchen with smart layout and ample storage for convenient cooking.",
    },
    {
      heading: "Living Area",
      desc: "Spacious and well-lit living area, perfect for family time and daily comfort.",
    },
    {
      heading: "Bedroom",
      desc: "Cozy and peaceful bedroom designed for relaxation and quality rest.",
    },
    
  ];

  return (
    <div className="flex max-sm:gap-1 max-md:gap-3 gap-5 h-[400px] w-full">
      {property.images.map((pImg, index) => {
        const caption = imageCaptions[index]

        const isHovered = hoveredIndex === index

        return (
          <div
            key={index}
            className={`relative group transition-all duration-500 h-[400px] overflow-hidden rounded-2xl ${isHovered ? "flex-row w-full" : "max-sm:w-10 max-md:w-20 w-56"}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(0)}
          >
            <img
              src={pImg}
              alt="property"
              className="h-full w-full object-cover object-center rounded-2xl"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl ">
              <h3 className="h3">{caption.heading}</h3>
              <p className="text-white/90">{caption.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyImages;
