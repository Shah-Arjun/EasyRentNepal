import React, { useState } from "react";
import { assets } from "../assets/data";

const PropertyImages = ({ property }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0)
  return (
    <div className="flex max-sm:gap-1 max-md:gap-3 gap-5 h-[400px] w-full">
      {property.images?.map((pImg, index) => {
        const isHovered = hoveredIndex === index

        return (
          <div
            key={index}
            className={`relative group transition-all duration-500 h-[400px] overflow-hidden rounded-2xl ${isHovered ? "flex-row w-full" : "max-sm:w-10 max-md:w-20 w-56"}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(0)}
          >
            <img
              src={pImg.url || pImg}
              alt="property"
              className="h-full w-full object-cover object-center rounded-2xl"
            />

          </div>
        );
      })}
    </div>
  );
};

export default PropertyImages;
