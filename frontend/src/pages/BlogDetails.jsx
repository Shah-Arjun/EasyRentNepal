import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogs, assets } from '../assets/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar } from '@fortawesome/free-solid-svg-icons'

const BlogDetails = () => {
    const { id } = useParams()
    const blog = blogs.find((b) => b.id === parseInt(id))

    if (!blog) {
        return (
            <div className='min-h-screen py-28 flexCenter'>
                <div className='text-center'>
                    <h2 className='h2'>Blog not found</h2>
                    <Link to="/blog" className='btn-secondary rounded-xl px-8 py-2 mt-4 inline-block'>Back to Blogs</Link>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff] py-28 min-h-screen'>
            <div className='max-padd-container'>
                <Link to="/blog" className='flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all mb-8'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Blogs</span>
                </Link>

                <div className='max-w-4xl mx-auto'>
                    {/* Header */}
                    <div className='mb-10'>
                        <div className='flex items-center gap-4 mb-4'>
                            <span className='px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold border border-secondary/20'>
                                {blog.category}
                            </span>
                            <div className='flex items-center gap-2 text-slate-400 text-sm'>
                                <FontAwesomeIcon icon={faCalendar} />
                                <span>March 25, 2026</span>
                            </div>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-6'>
                            {blog.title}
                        </h1>
                        <div className='flex items-center gap-3'>
                            <img src={assets.userImg} alt="" className='w-10 h-10 rounded-full border-2 border-white shadow-sm' />
                            <div>
                                <h5 className='bold-15 text-slate-700'>EasyRent Editorial</h5>
                                <p className='text-xs text-slate-400'>Real Estate Expert</p>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className='rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 mb-12'>
                        <img src={blog.image} alt={blog.title} className='w-full h-auto object-cover' />
                    </div>

                    {/* Content */}
                    <div className='prose prose-slate lg:prose-xl max-w-none'>
                        <p className='text-xl text-slate-600 font-medium leading-relaxed mb-8 italic border-l-4 border-secondary pl-6'>
                            {blog.description}
                        </p>
                        <div className='text-lg text-slate-700 leading-loose space-y-6'>
                            {blog.content.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Footer / Share */}
                    <div className='mt-16 pt-8 border-t border-slate-200 flexBetween flex-wrap gap-4'>
                        <div className='flex items-center gap-4'>
                            <span className='text-slate-500 bold-14'>Tags:</span>
                            <div className='flex gap-2 font-medium text-xs text-slate-600'>
                                <span className='bg-slate-100 px-3 py-1 rounded-lg'>#NepalRealEstate</span>
                                <span className='bg-slate-100 px-3 py-1 rounded-lg'>#PropertyInNepal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetails
