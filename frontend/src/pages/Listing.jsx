import React from "react";
import { useAppContext } from "../context/Appcontext";
import Item from "../components/Item";

const Listing = () => {
  const { properties } = useAppContext();
  const sortOptions = ["Relevant", "Low to High", "High to Low"];

  const propertyTypes = [
    "Room",
    "House",
    "Apartment",
    "Villa",
  ];

  const priceRange = [
    "0 to 10000",
    "10000 to 20000",
    "20000 to 30000",
    "30000+",
  ];

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container flex flex-col sm:flex-row gap-8 mb-16">
        {/* Left Side - Filters */}
        <div className="bg-secondary/10 ring-1 ring-slate-900/5 p-4 sm:min-w-60 sm:h-[600px] rounded-xl ">
          {/* Sort by price */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-3">Sort By</h5>
            <select className="bg-secondary/10 border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full rounded px-2">
              {sortOptions.map((sort, index) => (
                <option key={index} value="sort">{sort}</option>
              ))}</select>
          </div>
          {/* Property Type */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-4">Property Type</h5>
            {propertyTypes.map((type) => (
              <label key={type} className="flex gap-2 medium-14">
                <input type="checkbox" />
                {type}
              </label>
            ))}
          </div>
          {/* Price Range */}
          <div className="py-3 mt-2">
            <h5 className="h5 mb-4">Price Range</h5>
            {priceRange.map((price) => (
              <label key={price} className="flex gap-2 medium-14">
                <input type="checkbox" />
                Rs.{price}
              </label>
            ))}
          </div>
        </div>
        {/* Right Side  */}
        <div className="min-h-[97vh] overflow-y-scroll rounded-xl">
          {properties.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ">
              {properties.map((property) => (
                <Item key={property._id} property={property}/>
              ))}
            </div>
          ) :(
            <div className="text-center text-gray-500 mt-20">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Listing;
