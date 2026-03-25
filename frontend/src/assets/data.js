import logoImg from "./logo.png";
import logoDuplicate from "./logoDuplicate.png";
import search from './search.svg'
import user from './user.svg'
import menu from './menu.svg'
import close from './close.svg'
import right from './right.svg'
import pin from './pin.svg'
import calendar from './calendar.svg'
import users from './users.svg'
import badge from './badge.svg'
import star from './star.svg'
import sliders from './sliders.svg'
import bath from './bath.svg'
import bed from './bed.svg'
import car from './car.svg'
import ruler from './ruler.svg'
import facebook from './facebook.svg'
import instagram from './instagram.svg'
import twitter from './twitter.svg'
import linkedin from './linkedin.svg'
import rocket from './rocket.svg'
import mail from './mail.svg'
import phone from './phone.svg'
import house from './house.svg'
import dollar from './dollar.svg'
import calendarCheck from './calendar-check.svg'
import down from './down.svg'
import calendarSecondary from './calendar-secondary.svg'
import graph from './graph.svg'
import pound from './pound.svg'
import map from './map.svg'
import list from './list.svg'
import dashboard from './dashboard.svg'
import housePlus from './house-plus.svg'
import signature from './signature.svg'
import userImg from './user.png'
import user1 from './user1.png'
import user2 from './user2.png'
import user3 from './user3.png'
import user4 from './user4.png'
import img1 from "../assets/img1.png"
import img2 from "../assets/img2.png"
import img3 from "../assets/img3.png"
import img4 from "../assets/img4.png"
import img5 from "../assets/img5.png"
import img6 from "../assets/img6.png"
import pImg2 from "../assets/pImg2.png"
import pImg3 from "../assets/pImg3.png"
import pImg4 from "../assets/pImg4.png"
import client1 from '../assets/client1.jpg'
import client2 from '../assets/client2.jpg'
import client3 from '../assets/client3.jpg'
import client4 from '../assets/client4.jpg'
import about from '../assets/about.png'
import faq from '../assets/faq.png'
import createPrp from "../assets/createPrp.png"


// Blogs
import blog1 from "../assets/blogs/blog1.jpg";
import blog2 from "../assets/blogs/blog2.jpg";
import blog3 from "../assets/blogs/blog3.jpg";
import blog4 from "../assets/blogs/blog4.jpg";
import blog5 from "../assets/blogs/blog5.jpg";
import blog6 from "../assets/blogs/blog6.jpg";
import blog7 from "../assets/blogs/blog7.jpg";
import blog8 from "../assets/blogs/blog8.jpg";
import Faq from '../components/Faq';

export const assets = {
    logoImg,
    logoDuplicate,
    search,
    user,
    menu,
    close,
    right,
    pin,
    calendar,
    users,
    badge,
    star,
    sliders,
    bath,
    bed,
    car,
    ruler,
    facebook,
    instagram,
    twitter,
    linkedin,
    rocket,
    mail,
    phone,
    dollar,
    house,
    calendarCheck,
    down,
    graph,
    pound,
    calendarSecondary,
    map,
    dashboard,
    housePlus,
    list,
    signature,
    userImg,
    user1,
    user2,
    user3,
    user4,
    createPrp,
    client1,
    client2,
    client3,
    client4,
    about,
    faq
}

export const cities = [
    "Itahari",
    "Biratnagar",
    "Dharan",
    "Kathmandu",
    "Pokhara",
    "Dhangadhi",
    "Dhulikhel",
    "Birgunj",
    "Dhangadhi",
];


export const dummyAgentData = {
    "_id": "agent_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Ramesh Adhikari",
    "image": userImg,
    "role": "propertyOwner", 
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": ["Kathmandu", "Lalitpur", "Bhaktapur"]
  }
  
  
  // Agency Dummy Data
  export const dummyAgencyData = {
    "_id": "67f7642a197ac559e4089b99",
    "name": "Himalayan Property Services",
    "contact": "01-5321456",
    "email": "info@himalayanproperty.com", 
    "address": "Putalisadak, Kathmandu, Nepal",
    "owner": dummyAgentData,
    "city": "Kathmandu",
    "createdAt": "2025-04-12T10:45:30.000Z",
    "updatedAt": "2025-04-12T10:45:30.000Z",
    "__v": 0
}


// Property Listings Dummy Data
export const dummyProperties = [
  {
    "_id": "67f7647c197ac559e4089b96",
    "agency": dummyAgencyData,
    "title": "Itahari Modern Family House",
    "description": "A modern family home offering comfort and convenience in the heart of Itahari. This residence features spacious bedrooms, elegant interiors, and a balcony with city views. Perfect for families seeking a balance of tranquility and connectivity.",
    "address": "Itahari-3, Sunsari",
    "city": "Itahari",
    "country": "Nepal",
    "propertyType": "House",
    "price": {
      "rent": 10000
    },
    "facilities": {
      "bedrooms": 3,
      "bathrooms": 2,
      "garages": 1
    },
    "area": 1200,
    "amenities": ["Balcony", "Backyard"],
    "images": [img1, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:26:04.013Z",
    "updatedAt": "2026-01-26T06:26:04.013Z",
    "__v": 0
  },
  {
    "_id": "67f76452197ac559e4089b8e",
    "agency": dummyAgencyData,
    "title": "Dharan Luxury Apartment",
    "description": "Located in the serene hills of Dharan, this apartment combines modern architecture with scenic views. Features a rooftop terrace, well-ventilated rooms, and premium finishes for a luxurious lifestyle.",
    "address": "Dharan-12, Sunsari",
    "city": "Dharan",
    "country": "Nepal",
    "propertyType": "Apartment",
    "price": {
      "rent": 25000
    },
    "facilities": {
      "bedrooms": 2,
      "bathrooms": 2,
      "garages": 1
    },
    "area": 800,
    "amenities": ["Backyard", "Balcony", "Garden"],
    "images": [img2, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:25:22.593Z",
    "updatedAt": "2026-01-26T06:25:22.593Z",
    "__v": 0
  },
  {
    "_id": "67f76406197ac559e4089b82",
    "agency": dummyAgencyData,
    "title": "Biratnagar Villa",
    "description": "A stunning villa in Biratnagar offering modern luxury with practical amenities. Ideal for families, with open spaces, elegant interiors, and a rooftop terrace.",
    "address": "Biratnagar-9, Morang",
    "city": "Biratnagar",
    "country": "Nepal",
    "propertyType": "Villa",
    "price": {
      "rent": 35000
    },
    "facilities": {
      "bedrooms": 3,
      "bathrooms": 2,
      "garages": 1
    },
    "area": 1000,
    "amenities": ["Terrace", "Parking", "Balcony", "Garden"],
    "images": [img3, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:24:06.285Z",
    "updatedAt": "2026-01-26T06:24:06.285Z",
    "__v": 0
  },
  {
    "_id": "67f763d8197ac559e4089b7a",
    "agency": dummyAgencyData,
    "title": "Kathmandu Garden House",
    "description": "Modern townhouse in Kathmandu, perfect for city dwellers seeking style and convenience. Enjoy a private garden, terrace, and easy access to nearby amenities.",
    "address": "Lazimpat Road, Kathmandu",
    "city": "Kathmandu",
    "country": "Nepal",
    "propertyType": "Townhouse",
    "price": {
      "rent": 15000
    },
    "facilities": {
      "bedrooms": 3,
      "bathrooms": 2,
      "garages": 1
    },
    "area": 1100,
    "amenities": ["Terrace", "Backyard", "Balcony", "Garden"],
   "images": [img4, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:23:20.252Z",
    "updatedAt": "2026-01-26T06:23:20.252Z",
    "__v": 0
  },
  {
    "_id": "67f765aa197ac559e4089b9c",
    "agency": dummyAgencyData,
    "title": "Pokhara Lakeside House",
    "description": "Experience lakeside living in Pokhara. This modern house offers panoramic views, spacious interiors, and contemporary amenities, ideal for vacations or permanent residence.",
    "address": "Lakeside Road, Pokhara, Kaski",
    "city": "Pokhara",
    "country": "Nepal",
    "propertyType": "House",
    "price": {
      "rent": 20000
    },
    "facilities": {
      "bedrooms": 4,
      "bathrooms": 3,
      "garages": 2
    },
    "area": 1300,
    "amenities": ["Swimming Pool", "Balcony", "Private Garden"],
    "images": [img5, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:27:30.013Z",
    "updatedAt": "2026-01-26T06:27:30.013Z",
    "__v": 0
  },
  {
    "_id": "67f765f4197ac559e4089ba4",
    "agency": dummyAgencyData,
    "title": "Dharan Apartment",
    "description": "A peaceful apartment surrounded by greenery in Dharan. Featuring cozy interiors, spacious living areas, and a private garden for relaxation and serenity.",
    "address": "Bhanu road, Dharan, Sunsari",
    "city": "Dharan",
    "country": "Nepal",
    "propertyType": "Apartment",
    "price": {
      "rent": 17000
    },
    "facilities": {
      "bedrooms": 2,
      "bathrooms": 1,
      "garages": 1
    },
    "area": 900,
    "amenities": ["Garden", "Fireplace", "Parking"],
    "images": [img6, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2026-01-26T06:28:50.013Z",
    "updatedAt": "2026-01-26T06:28:50.013Z",
    "__v": 0
  }
]




// User Bookings Dummy Data
export const dummyBookingsData = [
    {
    "_id": "67f76839994a731e97d3b8ce",
    "user": dummyAgentData,
    "property": dummyProperties[1],
    "agency": dummyAgencyData,
    "checkInDate": "2025-04-30T00:00:00.000Z",
    "checkOutDate": "2025-05-05T00:00:00.000Z",  
    "totalPrice": 25000,
    "guests": 4,
    "status": "pending",
    "paymentMethod": "eSewa",
    "isPaid": false,
    "createdAt": "2025-04-10T06:42:01.529Z",
    "updatedAt": "2025-04-10T06:43:54.520Z",
    "__v": 0
},
{
    "_id": "67f76829994a731e97d3b8c3",
    "user": dummyAgentData,
    "property": dummyProperties[0],
    "agency": dummyAgencyData,
    "checkInDate": "2025-04-27T00:00:00.000Z",
    "checkOutDate": "2025-05-02T00:00:00.000Z",
    "totalPrice": 32000,
    "guests": 3,
    "status": "confirmed",
    "paymentMethod": "Cash on Move-in",
    "isPaid": true,
    "createdAt": "2025-04-10T06:41:45.873Z",
    "updatedAt": "2025-04-10T06:41:45.873Z",
    "__v": 0
},
{
    "_id": "67f76810994a731e97d3b8b4",
    "user": dummyAgentData,
    "property": dummyProperties[3],
    "agency": dummyAgencyData,
    "checkInDate": "2025-04-11T00:00:00.000Z",
    "checkOutDate": "2025-04-15T00:00:00.000Z",
    "totalPrice": 12000,
    "guests": 2,
    "status": "active",
    "paymentMethod": "Khalti",
    "isPaid": true,
    "createdAt": "2025-04-10T06:41:20.501Z",
    "updatedAt": "2025-04-10T06:41:20.501Z",
    "__v": 0
}

]


// Blogs Dummy Data (Real Estate Website) with Descriptions
export const blogs = [
  {
    id: 1,
    title: "Top Cities in Nepal to Rent Property in 2025",
    category: "Market Trends",
    image: blog1,
    description: "Kathmandu, Pokhara, Lalitpur, Bhaktapur, and emerging cities like Itahari and Bharatpur—explore where property investment is growing fastest in Nepal.",
    content: "The real estate market in Nepal is witnessing a significant shift. While Kathmandu remains the primary hub, cities like Pokhara and Itahari are emerging as top contenders for rental investments. In 2025, the demand for modern apartments with sustainable features is at an all-time high. Investors are looking beyond traditional residential areas towards developing outskirts where infrastructure projects are underway. This blog explores the top 5 cities and why they should be on your radar for rental properties."
  },
  {
    id: 2,
    title: "How to Choose the Right Rental Home in Nepal",
    category: "Renting Guide",
    image: blog2,
    description: "From water supply and road access to proximity to schools and offices, learn how to choose the best rental home that fits your lifestyle and budget in Nepal.",
    content: "Selecting a rental home in Nepal requires careful consideration of several factors. Water shortage is a common issue in urban areas, so ensure the property has a reliable source. Accessibility to main roads and public transport is crucial for daily commuting. Additionally, check for proximity to essential services like hospitals and grocery stores. Don't forget to verify the legal documents and have a clear rental agreement to avoid future disputes."
  },
  {
    id: 3,
    title: "Interior Design Ideas for Modern Nepali Apartments",
    category: "Home Improvement",
    image: blog3,
    description: "Simple, budget-friendly interior design trends popular in Kathmandu and Pokhara apartments that improve comfort and rental value.",
    content: "Modern Nepali apartments are embracing minimalism with a touch of traditional aesthetics. Using neutral color palettes with vibrant accent pieces can make a small space feel larger. Indoor plants are becoming increasingly popular for improving air quality and aesthetics. Incorporating traditional Nepali crafts, like Thangka paintings or handmade rugs, adds a unique cultural touch. This guide provides 10 affordable ways to transform your rental space into a cozy home."
  },
  {
    id: 4,
    title: "First-Time Home Renter’s Checklist in Nepal",
    category: "Renting Tips",
    image: blog4,
    description: "A complete checklist for first-time renters in Nepal—covering land ownership, Lalpurja verification, bank loans, and legal procedures.",
    content: "Renting for the first time can be overwhelming. Always start by setting a realistic budget that includes utility costs. Inspect the property thoroughly during daylight to identify any repairs needed. Ask about the landlord's policies on guests, pets, and maintenance. Most importantly, understand your rights as a tenant under Nepali law. This checklist ensures you don't miss any critical steps before moving in."
  },
  {
    id: 5,
    title: "How to Increase Rental Income from Your Property in Nepal",
    category: "Investment",
    image: blog5,
    description: "Smart strategies to maximize rental income, attract long-term tenants, and improve ROI in Nepal’s growing rental market.",
    content: "Landlords can significantly increase their rental income by making small yet impactful upgrades. A fresh coat of paint and modern lighting can drastically improve a property's appeal. Providing basic amenities like high-speed internet or dedicated parking can justify higher rent. Building a good relationship with tenants also ensures fewer vacancies. We discuss how to effectively market your property to attract high-quality tenants."
  },
  {
    id: 6,
    title: "Independent House vs Flat: What’s Better in Nepal?",
    category: "Lifestyle",
    image: blog6,
    description: "Compare independent houses and apartment living in Nepal based on cost, security, maintenance, and lifestyle.",
    content: "The choice between an independent house and a flat depends on your priorities. Flats often offer better security and shared amenities like gyms and elevators. Independent houses provide more privacy and space for gardening. In Kathmandu, flats are becoming more popular due to limited space and rising land costs. We weigh the pros and cons of both to help you decide which lifestyle suits you best."
  },
  {
    id: 7,
    title: "How to Prepare Your House for Rent in Nepal",
    category: "Landlord Tips",
    image: blog7,
    description: "Practical tips for Nepali landlords to get their house rental-ready, attract quality tenants, and avoid common mistakes.",
    content: "A well-prepared house attracts better tenants and rents faster. Start by decluttering and doing deep cleaning. Fix any leaking pipes or electrical issues. Enhancing the 'curb appeal' with a tidy entrance can make a great first impression. We also cover the importance of psychological pricing and effective photography for your property listing."
  },
  {
    id: 8,
    title: "Nepal Rental Market Outlook for 2026",
    category: "Market Trends",
    image: blog8,
    description: "An overview of Nepal’s rental trends in 2026, including rental demand, pricing, urban expansion, and investment opportunities.",
    content: "Looking ahead to 2026, the rental market in Nepal is poised for steady growth. Urban expansion in the Terai region is creating new investment pockets. Rental prices are expected to rise moderately in core city areas. Technological integration in property management will become more prevalent. This analysis provides a deep dive into the macroeconomic factors shaping the future of real estate in Nepal."
  }
];


// Dashboard Dummy Data
export const dummyDashboardData = {
    "totalBookings": 3,
    "totalRevenue": 897,
    "bookings": dummyBookingsData
}