import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import L from 'leaflet'
import { Clock, LocateFixed, MapPin, Navigation, Phone, X } from 'lucide-react'
import { Button, Logo } from '../components/ui'
import { LOCATIONS, PHOTOS, distanceKm, type ArenaLocation } from '../lib/data'

/* ---------- Screen 9: Find closest location ---------- */
export function FindLocationScreen({ name, onFind }: { name: string; onFind: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-ink">
      <motion.img
        src={PHOTOS.walker}
        alt="Golfer carrying a bag across a fairway"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-ink" />
      <Logo className="relative ml-6 mt-14" />
      <div className="relative mt-auto px-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-mst-bright">
            You're all set, {name.split(' ')[0]}
          </div>
          <h1 className="font-display text-[56px] font-extrabold uppercase italic leading-[0.88]">
            Your bay
            <br />
            is waiting
          </h1>
          <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-white/70">
            All-weather hitting bays, music, and Tee Box food & drinks. Let's find the Arena nearest you.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button className="mt-8" onClick={onFind}>
            <MapPin size={18} /> Find your closest MST location
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

/* ---------- Screen 10: Map ---------- */
const KL_CENTRE = { lat: 3.139, lng: 101.6869 }

const pinIcon = (active: boolean, pulse: boolean) => {
  const s = active ? 38 : 30
  return L.divIcon({
    className: 'mst-pin',
    iconSize: [44, 52],
    iconAnchor: [22, 50],
    html: `<div style="position:relative;width:44px;height:52px;display:flex;justify-content:center">${
      active || pulse
        ? '<div style="position:absolute;top:4px;width:36px;height:36px;border-radius:9999px;background:rgba(0,150,57,.35);animation:mstPulse 1.8s ease-out infinite"></div>'
        : ''
    }<div style="position:relative;width:${s}px;height:${s}px;margin-top:${active ? 2 : 6}px;border-radius:9999px 9999px 9999px 2px;transform:rotate(-45deg);background:${
      active ? '#19c25a' : '#009639'
    };border:3px solid #fff;box-shadow:0 8px 20px rgba(0,0,0,.5);display:grid;place-items:center"><div style="transform:rotate(45deg);width:${
      active ? 12 : 9
    }px;height:${active ? 12 : 9}px;border-radius:9999px;background:#fff"></div></div></div>`,
  })
}

const userIcon = L.divIcon({
  className: 'mst-pin',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: '<div style="width:20px;height:20px;border-radius:9999px;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 8px rgba(59,130,246,.25)"></div>',
})

export function MapScreen({ onNextTime }: { onNextTime: () => void }) {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markers = useRef<Record<string, L.Marker>>({})
  const userMarker = useRef<L.Marker | null>(null)
  const [me, setMe] = useState(KL_CENTRE)
  const [usingGps, setUsingGps] = useState(false)
  const [selected, setSelected] = useState<ArenaLocation | null>(null)
  const [locating, setLocating] = useState(false)

  const sorted = useMemo(
    () => LOCATIONS.map((l) => ({ ...l, km: distanceKm(me, l) })).sort((a, b) => a.km - b.km),
    [me],
  )
  const closestId = sorted[0].id

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return
    const map = L.map(mapEl.current, { zoomControl: false }).setView([3.1, 101.66], 11)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)
    LOCATIONS.forEach((loc) => {
      markers.current[loc.id] = L.marker([loc.lat, loc.lng], { icon: pinIcon(false, false) })
        .addTo(map)
        .on('click', () => setSelected(loc))
    })
    userMarker.current = L.marker([KL_CENTRE.lat, KL_CENTRE.lng], { icon: userIcon, interactive: false }).addTo(map)
    mapRef.current = map
    // The phone frame and screen transition may finish layout after mount.
    const t = setTimeout(() => map.invalidateSize(), 400)
    return () => {
      clearTimeout(t)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    LOCATIONS.forEach((loc) => {
      markers.current[loc.id]?.setIcon(pinIcon(selected?.id === loc.id, loc.id === closestId && !selected))
    })
    if (selected && mapRef.current) {
      mapRef.current.flyTo([selected.lat - 0.03, selected.lng], 13, { duration: 0.8 })
    }
  }, [selected, closestId])

  useEffect(() => {
    userMarker.current?.setLatLng([me.lat, me.lng])
  }, [me])

  const locate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setMe(p)
        setUsingGps(true)
        setLocating(false)
        const nearest = LOCATIONS.map((l) => ({ l, km: distanceKm(p, l) })).sort((a, b) => a.km - b.km)[0]
        mapRef.current?.fitBounds(
          L.latLngBounds([
            [p.lat, p.lng],
            [nearest.l.lat, nearest.l.lng],
          ]),
          { padding: [60, 60], maxZoom: 13 },
        )
      },
      () => setLocating(false),
      { timeout: 8000 },
    )
  }

  const sel = selected ? sorted.find((s) => s.id === selected.id)! : null
  const directions = (l: ArenaLocation) =>
    `https://www.google.com/maps/dir/?api=1&origin=${me.lat},${me.lng}&destination=${encodeURIComponent(
      l.address,
    )}&travelmode=driving`

  return (
    <div className="relative h-full overflow-hidden bg-ink">
      <style>{'@keyframes mstPulse{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.2);opacity:0}}'}</style>
      <div ref={mapEl} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] bg-gradient-to-b from-ink via-ink/80 to-transparent px-6 pb-10 pt-14">
        <div className="pointer-events-auto flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-mst-bright">MST Golf Arena</div>
            <h1 className="font-display text-4xl font-extrabold uppercase italic leading-none">Near you</h1>
            <div className="mt-1 text-xs text-white/50">
              {usingGps ? 'Using your location' : 'Distances from KL city centre · tap ◎ to use yours'}
            </div>
          </div>
          <button
            onClick={locate}
            aria-label="Use my location"
            className="grid h-11 w-11 place-items-center rounded-full bg-ink-2 ring-1 ring-white/15 hover:bg-ink-3"
          >
            <LocateFixed size={18} className={locating ? 'animate-spin text-mst-bright' : ''} />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[500]">
        <AnimatePresence mode="wait">
          {sel ? (
            <motion.div
              key="detail"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="mx-3 mb-1 rounded-[28px] bg-ink-2/95 p-5 ring-1 ring-white/10 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {sel.id === closestId && (
                    <span className="mb-2 inline-block rounded-full bg-mst/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mst-bright">
                      Closest to you
                    </span>
                  )}
                  <h2 className="font-display text-2xl font-bold uppercase italic leading-none">{sel.name}</h2>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/55">{sel.address}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/10"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat k="Distance" v={`${sel.km.toFixed(1)} km`} />
                <Stat k="Bays" v={String(sel.bays)} />
                <Stat k="Drive" v={`~${Math.max(5, Math.round(sel.km * 2.2))} min`} />
              </div>
              <div className="mt-4 space-y-2 text-[13px] text-white/70">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-mst-bright" /> {sel.hours}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sel.features.map((f) => (
                    <span key={f} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] ring-1 ring-white/10">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
                <a
                  href={`tel:${sel.phone.replace(/[\s-]/g, '')}`}
                  aria-label="Call"
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/5 ring-1 ring-white/15 hover:bg-white/10"
                >
                  <Phone size={17} />
                </a>
                <a
                  href={directions(sel)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-mst text-sm font-bold hover:bg-mst-bright"
                >
                  <Navigation size={16} /> Directions in Google Maps
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
                {sorted.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className={`w-[220px] shrink-0 snap-start rounded-3xl p-4 text-left ring-1 backdrop-blur-xl transition ${
                      i === 0 ? 'bg-mst/25 ring-mst' : 'bg-ink-2/90 ring-white/10 hover:bg-ink-3'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                      <span className={i === 0 ? 'text-mst-bright' : 'text-white/45'}>{i === 0 ? 'Closest' : l.area}</span>
                      <span className="text-white/70">{l.km.toFixed(1)} km</span>
                    </div>
                    <div className="mt-2 font-display text-xl font-bold uppercase italic leading-none">
                      {l.name.replace('Golf Arena · ', '')}
                    </div>
                    <div className="mt-1 text-[12px] text-white/50">
                      {l.bays} bays · {l.hours}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="bg-gradient-to-t from-ink via-ink/90 to-transparent px-6 pb-8 pt-3">
          <Button variant="light" onClick={onNextTime}>
            Next time
          </Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-black/30 py-2.5 ring-1 ring-white/5">
      <div className="font-display text-lg font-bold leading-none">{v}</div>
      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">{k}</div>
    </div>
  )
}
