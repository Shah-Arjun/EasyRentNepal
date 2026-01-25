import logoImg from "./logo.png";
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


export const assets = {
    logoImg,
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
    "username": "Izabella Stress",
    "image": userImg,
    "role": "agencyOwner", 
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": ["Abu Dhabi", "New York", "Toronto", "Los Angeles"]
  }
  
  
  // Agency Dummy Data
  export const dummyAgencyData = {
    "_id": "67f7642a197ac559e4089b99",
    "name": "Prime Solutions",
    "contact": "0123456789",
    "email": "contact@agencyname.com", 
    "address": "Suite 405, Midtown Business Tower, Park Avenue",
    "owner": dummyAgentData,
    "city": "Los Angeles",
    "createdAt": "2025-04-12T10:45:30.000Z",
    "updatedAt": "2025-04-12T10:45:30.000Z",
    "__v": 0
}


// Property Listings Dummy Data
export const dummyProperties = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "agency": dummyAgencyData,
        "title": "Oceanview Oasis Serenity Escape",
        "description": "Discover a harmonious blend of modern luxury and timeless elegance. Nestled in the heart of this area, our newest residency offers a sanctuary where every detail is meticulously crafted to elevate your lifestyle. From breathtaking architectural designs to unparalleled amenities, each aspect is thoughtfully curated to redefine the meaning of home. Step into a world of sophistication as you explore our spacious and meticulously designed residences, each boasting premium finishes and panoramic views that inspire awe. Whether you seek a serene retreat to unwind or a vibrant community to connect with, Offers an array of lifestyle amenities tailored to your every need.",
        "address": "789 Park Lane, New York, USA",
        "city": "New York",
        "country": "USA",
        "propertyType": "House",
        "price":{
          "rent": 299,
          "sale": 33000
        },
        "facilities": {
          "bedrooms": 3,
          "bathrooms": 2,
          "garages": 1
        },
        "area": 800,
        "amenities": [ "Balcony", "High-Speed Internet", "Backyard",],
        "images": [img1, pImg2, pImg3, pImg4],
        "isAvailable": true,
        "status": "available",
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "agency": dummyAgencyData,
        "title": "Mountain Majesty Tranquility Haven",
        "description": "This villa is a stunning masterpiece of luxury and art. Adorned with two helipads for convenient aerial access, the expansive interiors provide ample space for relaxation and entertainment. The villa offers panoramic sea views that can be enjoyed from multiple vantage points, while the walls are graced with astonishing, bold artworks that add a touch of sophistication and elegance to the entire property. Every detail of this villa exudes opulence and grandeur, making it a truly exceptional and unique residence.",
        "address": "301 Sunset Boulevard, Los Angeles, USA",
        "city": "Los Angeles",
        "country": "USA",
        "propertyType": "Apartment",
        "price":{
         "rent": 599,
         "sale": 99000
        },
         "facilities": {
          "bedrooms": 2,
          "bathrooms": 2,
          "garages": 1
        },
        "area": 500,
        "amenities": ["Backyard", "Garage", "Fireplace"],
        "images": [img2, pImg3, pImg4, pImg2],
        "isAvailable": true,
        "status": "available",
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "agency": dummyAgencyData,
        "title": "Urban Elegance Sophistication Haven",
        "description": "This villa is a stunning masterpiece of luxury and art. Adorned with two helipads for convenient aerial access, the expansive interiors provide ample space for relaxation and entertainment. The villa offers panoramic sea views that can be enjoyed from multiple vantage points, while the walls are graced with astonishing, bold artworks that add a touch of sophistication and elegance to the entire property. Every detail of this villa exudes opulence and grandeur, making it a truly exceptional and unique residence.",
        "address": "900 Bay Street, Toronto, Canada",
        "city": "Toronto",
        "country": "Canada",
        "propertyType": "Villa",
        "price":{
          "rent": 299,
          "sale": 20000
        },
         "facilities": {
          "bedrooms": 2,
          "bathrooms": 1,
          "garages": 1
        },
        "area": 200,
        "amenities": ["Fitness Center", "Terrace", "Parking"],
        "images": [img3, pImg4, pImg3, pImg2],
        "isAvailable": true,
        "status": "available",
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "agency": dummyAgencyData,
        "title": "Garden Grove Oasis Retreat Haven",
        "description": "This villa is a stunning masterpiece of luxury and art. Adorned with two helipads for convenient aerial access, the expansive interiors provide ample space for relaxation and entertainment. The villa offers panoramic sea views that can be enjoyed from multiple vantage points, while the walls are graced with astonishing, bold artworks that add a touch of sophistication and elegance to the entire property. Every detail of this villa exudes opulence and grandeur, making it a truly exceptional and unique residence.",
        "address": "29 Alexanderplatz, Berlin, Germany",
        "city": "Berlin",
        "country": "Germany",
        "propertyType": "Townhouse",
         "price":{
           "rent": 399,
           "sale": 33000
        },
         "facilities": {
          "bedrooms": 3,
          "bathrooms": 2,
          "garages": 1
        },
        "area": 500,
        "amenities": ["Terrace", "Backyard", "Fitness Center"],
        "images": [img4, pImg2, pImg3, pImg4],
        "isAvailable": true,
        "status": "available",
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
    "_id": "67f765aa197ac559e4089b9c",
    "agency": dummyAgencyData,
    "title": "Seaside Bliss Modern Retreat",
    "description": "Experience seaside living with contemporary design and ocean views from every room. Perfect for vacation rentals or permanent residence. Offers panoramic sea views that can be enjoyed from multiple vantage points, while the walls are graced with astonishing, bold artworks that add a touch of sophistication and elegance to the entire property. Every detail of this villa exudes opulence and grandeur, making it a truly exceptional and unique residence.",
    "address": "45 Marina Bay, Miami, USA",
    "city": "Miami",
    "country": "USA",
    "propertyType": "House",
     "price":{
      "rent": 499,
      "sale": 44000
    },
    "facilities": {
      "bedrooms": 4,
      "bathrooms": 3,
      "garages": 2
    },
    "area": 250,
    "amenities": ["Swimming Pool", "Balcony", "Private Beach"],
    "images": [img5, pImg3, pImg2, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2025-04-10T06:27:30.013Z",
    "updatedAt": "2025-04-10T06:27:30.013Z",
    "__v": 0
  },

  {
    "_id": "67f765f4197ac559e4089ba4",
    "agency": dummyAgencyData,
    "title": "Countryside Charm Rustic Escape",
    "description": "Enjoy a peaceful countryside retreat with spacious gardens, natural wood interiors, and cozy fireplaces. offers panoramic sea views that can be enjoyed from multiple vantage points, while the walls are graced with astonishing, bold artworks that add a touch of sophistication and elegance to the entire property. Every detail of this villa exudes opulence and grandeur, making it a truly exceptional and unique residence.",
    "address": "88 Willow Lane, Edinburgh, UK",
    "city": "Edinburgh",
    "country": "UK",
    "propertyType": "Apartment",
    "price":{
      "rent": 199,
      "sale": 12000
    },
    "facilities": {
      "bedrooms": 2,
      "bathrooms": 1,
      "garages": 1
    },
    "area": 700,
    "amenities": ["Garden", "Fireplace", "Parking"],
    "images": [img6, pImg2, pImg3, pImg4],
    "isAvailable": true,
    "status": "available",
    "createdAt": "2025-04-10T06:28:50.013Z",
    "updatedAt": "2025-04-10T06:28:50.013Z",
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
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 4,
        "status": "pending",
        "paymentMethod": "Stripe",
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
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 399,
        "guests": 3,
        "status": "pending",
        "paymentMethod": "Pay at Check-in",
        "isPaid": false,
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
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 199,
        "guests": 3,
        "status": "pending",
        "paymentMethod": "Pay at Check-in",
        "isPaid": true,
        "createdAt": "2025-04-10T06:41:20.501Z",
        "updatedAt": "2025-04-10T06:41:20.501Z",
        "__v": 0
    }
]


// Blogs Dummy Data (Real Estate Website) with Descriptions
export const blogs = [
  {
    title: "Top 10 Cities to Buy Property in 2025",
    category: "Market Trends",
    image: blog1,
    description: "Discover the most promising cities for real estate investment and future growth in 2025."
  },
  {
    title: "How to Choose the Right Rental Property",
    category: "Renting Guide",
    image: blog2,
    description: "A practical guide to help renters select the perfect home based on lifestyle, budget, and location."
  },
  {
    title: "Interior Design Trends for Modern Apartments",
    category: "Home Improvement",
    image: blog3,
    description: "Explore the latest interior design trends that add value and style to modern living spaces."
  },
  {
    title: "A First-Time Home Buyer's Complete Checklist",
    category: "Buying Tips",
    image: blog4,
    description: "Step-by-step checklist every new home buyer should follow to make confident purchase decisions."
  },
  {
    title: "Maximizing ROI on Your Rental Property",
    category: "Investment",
    image: blog5,
    description: "Proven strategies to increase income and long-term value from your rental properties."
  },
  {
    title: "Pros and Cons of Living in a Gated Community",
    category: "Lifestyle",
    image: blog6,
    description: "Weigh the benefits and drawbacks of buying or renting in a gated residential area."
  },
  {
    title: "How to Stage Your Home for a Quick Sale",
    category: "Selling Tips",
    image: blog7,
    description: "Learn simple yet effective tips to stage your home and attract serious buyers faster."
  },
  {
    title: "2025 Real Estate Forecast: What to Expect",
    category: "Market Trends",
    image: blog8,
    description: "An expert overview of the expected trends and shifts in the real estate market for 2025."
  },
];


// Dashboard Dummy Data
export const dummyDashboardData = {
    "totalBookings": 3,
    "totalRevenue": 897,
    "bookings": dummyBookingsData
}