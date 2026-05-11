import React from 'react'

const ItemSkeleton = () => {
  return (
    <div className='block rounded-lg bg-white ring-1 ring-slate-900/5 animate-pulse'>
      {/* Image Skeleton */}
      <div className='relative bg-slate-200 h-[13rem] w-full rounded-t-xl' />
      
      {/* Info Skeleton */}
      <div className="p-3">
        {/* Property Type & Price */}
        <div className="flexBetween mb-3">
          <div className='h-4 bg-slate-200 rounded w-20' />
          <div className='h-4 bg-slate-200 rounded w-24' />
        </div>
        
        {/* Title */}
        <div className='h-5 bg-slate-200 rounded w-full mb-3' />
        
        {/* Facilities */}
        <div className="flexCenter gap-4 py-2 mb-3">
          <div className='flex items-center gap-2 border-r border-slate-900/5 pr-4'>
            <div className='h-5 w-5 bg-slate-200 rounded' />
            <div className='h-4 bg-slate-200 rounded w-8' />
          </div>
          <div className='flex items-center gap-2 border-r border-slate-900/5 pr-4'>
            <div className='h-5 w-5 bg-slate-200 rounded' />
            <div className='h-4 bg-slate-200 rounded w-8' />
          </div>
          <div className='flex items-center gap-2 border-r border-slate-900/5 pr-4'>
            <div className='h-5 w-5 bg-slate-200 rounded' />
            <div className='h-4 bg-slate-200 rounded w-8' />
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 bg-slate-200 rounded w-8' />
          </div>
        </div>
        
        {/* Description */}
        {/* <div className='space-y-2'>
          <div className='h-4 bg-slate-200 rounded w-full' />
          <div className='h-4 bg-slate-200 rounded w-5/6' />
        </div> */}
      </div>
    </div>
  )
}

export default ItemSkeleton
