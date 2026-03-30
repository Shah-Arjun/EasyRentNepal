import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Item from "../components/Item";

const Listing = () => {
  const { properties, loading } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filterProperties, setFilterProperties] = useState([]);
  const [category, setCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [sortType, setSortType] = useState('Relevant');

  // Extract search params from URL
  const searchPlace = searchParams.get('place') || '';
  const searchDate = searchParams.get('date') || '';
  const searchTenants = parseInt(searchParams.get('tenants')) || 0;
  const hasSearch = searchPlace || searchDate || searchTenants > 0;

  const propertyTypes = ["Room", "House", "Apartment", "Villa"];

  const priceRanges = [
    "0 to 10000",
    "10000 to 20000",
    "20000 to 30000",
    "30000+",
  ];

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const togglePriceRange = (e) => {
    if (priceRange.includes(e.target.value)) {
      setPriceRange(prev => prev.filter(item => item !== e.target.value));
    } else {
      setPriceRange(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let tempProperties = properties.slice();

    // --- Search Param Filters (from Hero form) ---
    if (searchPlace) {
      const keyword = searchPlace.toLowerCase();
      tempProperties = tempProperties.filter(p => {
        const loc = p.location || {};
        return (
          (loc.municipality || '').toLowerCase().includes(keyword) ||
          (loc.district || '').toLowerCase().includes(keyword) ||
          (loc.tole || '').toLowerCase().includes(keyword) ||
          (loc.province || '').toLowerCase().includes(keyword)
        );
      });
    }

    if (searchTenants > 0) {
      tempProperties = tempProperties.filter(p => {
        // bedCount is the closest proxy for occupancy; fall back to bedrooms
        const capacity = p.bedCount || p.bedrooms || 1;
        return capacity >= searchTenants;
      });
    }

    // --- Sidebar Filters ---
    if (category.length > 0) {
      tempProperties = tempProperties.filter(p => category.includes(p.category));
    }

    if (priceRange.length > 0) {
      tempProperties = tempProperties.filter(p => {
        const price = p.price?.value || 0;
        return priceRange.some(range => {
          if (range === "30000+") return price >= 30000;
          const [min, , max] = range.split(' ');
          return price >= parseInt(min) && price <= parseInt(max);
        });
      });
    }

    // Sorting
    switch (sortType) {
      case 'Low to High':
        setFilterProperties(tempProperties.sort((a, b) => (a.price?.value || 0) - (b.price?.value || 0)));
        break;
      case 'High to Low':
        setFilterProperties(tempProperties.sort((a, b) => (b.price?.value || 0) - (a.price?.value || 0)));
        break;
      default:
        setFilterProperties(tempProperties);
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, priceRange, sortType, properties, searchPlace, searchTenants]);

  const clearSearch = () => {
    navigate('/listing');
  };

  return (
    <div className="bg-linear-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container flex flex-col sm:flex-row gap-8 mb-16">
        {/* Left Side - Filters */}
        <div className="bg-secondary/10 ring-1 ring-slate-900/5 p-4 sm:min-w-60 sm:h-fit rounded-xl">
          {/* Sort by price */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-3">Sort By</h5>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="bg-secondary/10 border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full rounded px-2"
            >
              <option value="Relevant">Relevant</option>
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
            </select>
          </div>
          {/* Property Type */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-4">Property Type</h5>
            {propertyTypes.map((type) => (
              <label key={type} className="flex gap-2 medium-14 cursor-pointer">
                <input
                  type="checkbox"
                  value={type}
                  onChange={toggleCategory}
                  checked={category.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
          {/* Price Range */}
          <div className="py-3 mt-2">
            <h5 className="h5 mb-4">Price Range</h5>
            {priceRanges.map((range) => (
              <label key={range} className="flex gap-2 medium-14 cursor-pointer">
                <input
                  type="checkbox"
                  value={range}
                  onChange={togglePriceRange}
                  checked={priceRange.includes(range)}
                />
                Rs.{range}
              </label>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="min-h-[97vh] overflow-y-scroll rounded-xl w-full">

          {/* Active search banner */}
          {hasSearch && (
            <div className="mb-5 flex flex-wrap items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3">
              <span className="medium-14 text-gray-600">Search results for:</span>
              {searchPlace && (
                <span className="bg-secondary/20 text-secondary medium-13 px-3 py-1 rounded-full">
                  📍 {searchPlace}
                </span>
              )}
              {searchDate && (
                <span className="bg-secondary/20 text-secondary medium-13 px-3 py-1 rounded-full">
                  📅 Move-in: {new Date(searchDate).toLocaleDateString('en-GB')}
                </span>
              )}
              {searchTenants > 0 && (
                <span className="bg-secondary/20 text-secondary medium-13 px-3 py-1 rounded-full">
                  👤 {searchTenants} tenant{searchTenants > 1 ? 's' : ''}
                </span>
              )}
              <button
                onClick={clearSearch}
                className="ml-auto text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer underline"
              >
                Clear search
              </button>
            </div>
          )}

          {loading ? (
            <div className="flexCenter flex-col mt-32 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              <p className="mt-4 text-gray-400 medium-14">Searching for properties...</p>
            </div>
          ) : filterProperties.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filterProperties.map((property) => (
                <Item key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              {hasSearch
                ? `No properties found matching "${searchPlace}"${searchTenants > 0 ? ` for ${searchTenants} tenant${searchTenants > 1 ? 's' : ''}` : ''}.`
                : 'No matches found for the selected filters.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;