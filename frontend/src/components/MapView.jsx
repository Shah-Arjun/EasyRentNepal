import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Only inject what Tailwind cannot reach — Leaflet's internal tooltip DOM
const LEAFLET_OVERRIDES = `
  .hostel-tooltip.leaflet-tooltip {
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .hostel-tooltip.leaflet-tooltip::before { display: none !important; }
`

const MapView = () => {
    const mapRef = useRef(null)
    const navigate = useNavigate()
    const { hostels } = useSelector((state) => state.publicHostel)

    useEffect(() => {
        const STYLE_ID = 'basobas-map-styles'
        if (!document.getElementById(STYLE_ID)) {
            const styleEl = document.createElement('style')
            styleEl.id = STYLE_ID
            styleEl.textContent = LEAFLET_OVERRIDES
            document.head.appendChild(styleEl)
        }

        if (!mapRef.current) return

        const map = L.map(mapRef.current, {
            center: [27.7000, 85.3240],
            zoom: 13,
            zoomControl: false,
        })

        L.control.zoom({ position: 'topright' }).addTo(map)
        L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map)

        // CartoDB Voyager — vibrant colors, roads, parks, English labels; no token needed
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CartoDB</a>',
            maxZoom: 19,
        }).addTo(map)

        const markers = []

        hostels.forEach((hostel) => {
            const lat = hostel?.coordinates?.lat
            const lng = hostel?.coordinates?.lng
            if (!lat || !lng) return

            const id = hostel?._id || hostel?.id
            const photo = hostel?.image || hostel?.imagesUrls?.[0] || ''
            const price = Number(hostel?.price || 0)
            const rating = Number(hostel?.rating || 0)
            const reviewCount = hostel?.reviewCount || 0
            const location = hostel?.location || ''
            const gender = hostel?.gender || ''
            const availableCount = hostel?.availableCount || 0
            const verified = hostel?.verified || hostel?.isVerified

            // ── Price-pill marker (Airbnb-style) — all Tailwind ────────────
            const iconHtml = `
                <div class="flex flex-col items-center drop-shadow-lg cursor-pointer group">
                    <div class="bg-white border-2 border-red-500 rounded-full px-3 py-1 text-[11px] font-extrabold text-red-500 whitespace-nowrap shadow-md
                                group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-red-200 group-hover:shadow-lg
                                transition-all duration-150 min-w-[76px] text-center tracking-tight">
                        Rs ${price.toLocaleString()}
                    </div>
                    <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500 -mt-px"></div>
                </div>
            `

            const icon = L.divIcon({
                className: '',
                html: iconHtml,
                iconSize: [100, 40],
                iconAnchor: [50, 40],
            })

            const marker = L.marker([lat, lng], { icon }).addTo(map)

            // ── Hover card — all Tailwind ────────────────────────────────────
            const photoBlock = photo
                ? `<img src="${photo}" alt="${hostel.name}" class="w-full h-32 object-cover" />`
                : `<div class="w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl">🏠</div>`

            const stars = Array.from({ length: 5 }, (_, i) =>
                `<span class="${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}">★</span>`
            ).join('')

            const availBadge = availableCount > 0
                ? `<div class="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-800">🛏 ${availableCount} room${availableCount > 1 ? 's' : ''} available</div>`
                : `<div class="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-red-50 text-red-800">❌ No rooms available</div>`

            const cardHtml = `
                <div class="w-60 bg-white rounded-2xl overflow-hidden shadow-2xl font-sans">
                    <div class="relative">
                        ${photoBlock}
                        ${verified
                            ? `<span class="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">✓ Verified</span>`
                            : ''}
                        <span class="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">${gender}</span>
                    </div>
                    <div class="p-3 space-y-2">
                        <div class="font-bold text-sm text-gray-900 truncate">${hostel.name || ''}</div>
                        <div class="text-gray-500 text-[11px] truncate">📍 ${location}</div>
                        <div class="flex items-center justify-between">
                            <div class="text-base font-extrabold text-red-500">
                                Rs ${price.toLocaleString()}
                                <span class="text-[11px] text-gray-400 font-normal">/mo</span>
                            </div>
                            <div class="flex items-center gap-0.5 text-sm leading-none">
                                ${stars}
                                <span class="font-bold ml-1 text-xs text-gray-800">${rating.toFixed(1)}</span>
                                <span class="text-gray-400 text-[11px] ml-0.5">(${reviewCount})</span>
                            </div>
                        </div>
                        ${availBadge}
                    </div>
                </div>
            `

            marker.bindTooltip(cardHtml, {
                direction: 'top',
                offset: [0, -44],
                className: 'hostel-tooltip',
                opacity: 1,
                sticky: false,
            })

            marker.on('mouseover', () => marker.openTooltip())
            marker.on('mouseout', () => marker.closeTooltip())
            marker.on('click', () => navigate(`/hostel/${id}`, { state: { hostel } }))

            markers.push(marker)
        })

        if (markers.length) {
            const group = L.featureGroup(markers)
            map.fitBounds(group.getBounds().pad(0.3))
        }

        return () => {
            map.remove()
        }
    }, [hostels, navigate])

    return (
        <div className="sticky top-24 h-[calc(100vh-8rem)] rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
            <div ref={mapRef} className="h-full w-full" />
        </div>
    )
}

export default MapView