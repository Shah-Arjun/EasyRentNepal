import { blogs } from "../assets/data";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="bg-linear-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container">
        {/* Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-12">
          {blogs.map((blog) => (
            <div key={blog.id} className="relative group">
              <Link to={`/blog/${blog.id}`} className="block bg-secondary/10 p-4 rounded-2xl overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="shadow-xl shadow-slate-900/20 rounded-xl group-hover:scale-105 transition-all duration-500"
                />
              </Link>
              {/* Info */}
              <p className="medium-14 mt-6 text-secondary font-bold">{blog.category}</p>
              <h5 className="h5 pr-4 mb-1 line-clamp-2 hover:text-secondary transition-colors cursor-pointer">
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </h5>
              <p className="text-slate-500 line-clamp-3 regular-14">{blog.description}</p>
              <Link to={`/blog/${blog.id}`} className="underline mt-2 bold-14 text-slate-800 hover:text-secondary block">Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
