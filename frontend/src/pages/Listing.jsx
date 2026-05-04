import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Item from "../components/Item";
import { useSearchParams } from "react-router-dom";
import { assets, cities } from "../assets/data";



const Listing = () => {
  const { properties, loading } = useAppContext();
  const [filterProperties, setFilterProperties] = useState([]);
  const [category, setCategory] = useState([]);
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState([]);
  const [sortType, setSortType] = useState('Relevant');
  const [searchParams, setSearchParams] = useSearchParams();      //to get searched text from url
  const searchText = searchParams.get("location") || "";  //get from Hero section search and store search text from url  eg. /listing?location=Kathmandu
  const [locationInput, setLocationInput] = useState(searchText);   // to control the input field value
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [featuredOnly, setFeaturedOnly] = useState(false);



  const propertyTypes = [
    "Room",
    "House",
    "Apartment",
    "Flat",
    "Office",
    "Shutter",
    "Land",
  ];

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

    // location filter based on search text
    if(locationInput){
      console.log(locationInput)
      tempProperties = tempProperties.filter(p =>
        p.location?.province?.toLowerCase().includes(locationInput.toLowerCase()) ||
        p.location?.district?.toLowerCase().includes(locationInput.toLowerCase()) ||
        p.location?.municipality?.toLowerCase().includes(locationInput.toLowerCase()) ||
        p.location?.tole?.toLowerCase().includes(locationInput.toLowerCase())  ||
        p.title?.toLowerCase().includes(locationInput.toLowerCase())
      )
    }


    // Category Filter
    if (category.length > 0) {
      tempProperties = tempProperties.filter(p => category.includes(p.category));
    }

    // Price Range Filter
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


    // Featured Only Filter
    if(featuredOnly){
      tempProperties = tempProperties.filter(p => p.isFeatured === true);
    }


    // Bedroom Filter
    if (bedrooms) {
      tempProperties = tempProperties.filter(p => {
        const beds = p.bedrooms || 0;

        if (bedrooms === "1") return beds === 1;

        if (bedrooms.startsWith("upto-")) {
          const max = Number(bedrooms.split("-")[1]);
          return beds <= max;
        }

        if (bedrooms === "5+") return beds >= 5;

        return true;
      });
    }


    // Sorting
    switch (sortType) {
      case 'Low to High':
        setFilterProperties(tempProperties.sort((a,b) => (a.price?.value || 0) - (b.price?.value || 0)));
        break;
      case 'High to Low':
        setFilterProperties(tempProperties.sort((a,b) => (b.price?.value || 0) - (a.price?.value || 0)));
        break;
      default:
        setFilterProperties(tempProperties);
        break;
    }
  };



  // handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setSearchParams({ location: locationInput });
  };




  useEffect(() => {
    const filterAndScroll = async () => {
      await applyFilter(); // wait for data
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    filterAndScroll();
  }, [locationInput, searchText, category, priceRange,featuredOnly, bedrooms, sortType, properties]);



  // sync url when page changes
  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set("page", currentPage);
      return params;
    });
  }, [currentPage]);



  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [locationInput, category, priceRange, bedrooms, sortType]);


  //Sync state when URL changes
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);



  // apply pagination logic
  const itemsPerPage = 30;

  const totalPages = Math.ceil(filterProperties.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = filterProperties.slice(startIndex, endIndex);



  return (
    <div className="bg-linear-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container flex flex-col sm:flex-row gap-8 mb-16">
        {/* Left Side - Filters */}
        <div className="sticky top-20 bg-secondary/10 ring-1 ring-slate-900/5 p-4 sm:min-w-60 rounded-xl h-fit">          {/* Sort by price - order */}
          <div className="py-3">
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
          {/* featured only */}
          <div className="py-3 mt-4">
            <label className="flex gap-2 medium-14 text-black font-bold cursor-pointer">
              <input 
                type="checkbox" 
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
              />
              Featured Properties Only
            </label>
          </div>
          {/* Bedroom filter */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-3">Bedrooms</h5>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="bg-secondary/10 border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full rounded px-2"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="upto-2">Upto 2</option>
              <option value="upto-3">Upto 3</option>
              <option value="upto-4">Upto 4</option>
              <option value="5+">5+</option>
            </select>
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



        {/* Right Side  */}
        <div className="min-h-[97vh] rounded-xl w-full ">
          {/* SEARCH FORM */}
          <form onSubmit={handleSearchSubmit} className='flex items-center justify-center bg-secondary/10 ring-1 ring-slate-900/5 text-gray-500 rounded-lg px-6 py-4 flex-row lg:flex-row gap-4 lg:gap-x-8 max-w-full mb-4 relative'>
            {/* location logo */}
            <div className='flex items-center justify-evenly'>
              <img src={assets.pin} alt="pinIcon" width={38} />
            </div>
            {/* input */}
            <input 
              list="destinations"   // connects input to datalist for autocomplete 
              id="destinationInput"
              type="text" 
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className='rounded border bg-white/90 border-gray-300 px-3 py-2.5 text-sm outline-gray-500 w-full'
              placeholder='Enter your preferred location.'
              required
            />
            <datalist id='destinations'>
              {cities.map((city, index) => (
                <option value={city} key={index}/>
              ))}
            </datalist>

            {/* button */}
            <button type='submit' className='flex items-center justify-center gap-1 rounded-md bg-black p-2 md:py-3 md:px-6 lg:py-3 lg:px-6 text-white my-auto cursor-pointer'>
              <img src={assets.search} alt="searchIcon" width={20} className='invert w-8'/>
              <span className='hidden md:block lg:block'>Search</span>
            </button>
          </form>


          {/* listings */}
          {loading ? (
            <div className="flexCenter flex-col mt-32 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              <p className="mt-4 text-gray-400 medium-14">Searching for properties...</p>
            </div>
          ) : currentItems.length > 0 ? (
            // show filtered and paginated properties
            <>
            {properties.length !== filterProperties.length && <div className="text-sm "><span>Searched Result: {filterProperties.length}</span></div>}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-8">
                {currentItems.map((property) => (
                  <Item key={property._id} property={property}/>
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
                <span className="text-sm">Showing ({startIndex + 1}-{Math.min(endIndex, filterProperties.length)}) of {filterProperties.length}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
            </>
          ) :(
            <div className="text-center text-gray-500 mt-20">No matches found for the selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Listing;