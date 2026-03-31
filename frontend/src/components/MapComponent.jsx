import React, { useMemo, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline,
  ZoomControl,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPin, Navigation, Globe, Activity, Crosshair } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// FedEx / DHL Style Industrial Icons
const currentPosIcon = L.divIcon({
  className: 'custom-div-icon',
  html: renderToString(
    <div className="relative">
        <div className="absolute inset-0 bg-primary-main rounded-full blur-[8px] opacity-40 animate-pulse" />
        <div className="relative bg-slate-950 p-2.5 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform duration-300">
            <Truck size={18} strokeWidth={3} />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 border-2 border-white rotate-45 -z-10" />
    </div>
  ),
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});

const waypointIcon = L.divIcon({
  className: 'custom-div-icon',
  html: renderToString(
    <div className="bg-white w-4 h-4 rounded-full border-[3px] border-slate-300 shadow-md transition-colors" />
  ),
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const originIcon = L.divIcon({
  className: 'custom-div-icon',
  html: renderToString(
    <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[6px] opacity-30 animate-pulse" />
        <div className="relative bg-emerald-600 p-2 rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white transform hover:scale-125 transition-all duration-300">
            <MapPin size={12} strokeWidth={3} />
        </div>
    </div>
  ),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const destinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: renderToString(
    <div className="relative group">
        <div className="absolute inset-0 bg-rose-500 rounded-full blur-[6px] opacity-30 animate-pulse" />
        <div className="relative bg-rose-600 p-2 rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white transform hover:scale-125 transition-all duration-300">
            <MapPin size={12} strokeWidth={3} />
        </div>
    </div>
  ),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Component to dynamically adjust map view based on markers
function MapResizer({ coords, center }) {
    const map = useMap();
    useEffect(() => {
        if (coords.length > 1) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [100, 100], maxZoom: 8 });
        } else if (center) {
            map.setView(center, 12);
        }
    }, [coords, center, map]);
    return null;
}

const MapComponent = ({ 
  originLat, originLng, 
  currentLat, currentLng, 
  destLat, destLng, 
  history = [],
  parcelDestination 
}) => {
  
  const routeData = useMemo(() => {
    const oLat = parseFloat(originLat);
    const oLng = parseFloat(originLng);
    const cLat = parseFloat(currentLat || destLat); // Fallback if current is not set
    const cLng = parseFloat(currentLng || destLng);
    const dLat = parseFloat(destLat);
    const dLng = parseFloat(destLng);
    
    // Extract valid coordinates from history
    const historyCoords = history
      .filter(h => h.destinationLatitude && h.destinationLongitude)
      .map(h => [parseFloat(h.destinationLatitude), parseFloat(h.destinationLongitude)]);
    
    const validOrigin = !isNaN(oLat) && !isNaN(oLng) && oLat !== 0;
    const validCurrent = !isNaN(cLat) && !isNaN(cLng) && cLat !== 0;
    const validDest = !isNaN(dLat) && !isNaN(dLng) && dLat !== 0;

    // Build the full path for the polyline
    const allCoords = [];
    if (validOrigin) allCoords.push([oLat, oLng]);
    allCoords.push(...historyCoords);
    if (validCurrent) allCoords.push([cLat, cLng]);
    // Note: We don't necessarily want to draw a line to the target yet if it's "future", 
    // but the user asked to see "from location to destination".
    // Let's add the target to the path but maybe with a different style if it's in the future?
    // For now, let's include it to show the full route.
    if (validDest) allCoords.push([dLat, dLng]);

    // Determine the map center
    const fallbackCenter = [25.2048, 55.2708]; // Dubai
    const center = validCurrent ? [cLat, cLng] : (validDest ? [dLat, dLng] : (validOrigin ? [oLat, oLng] : fallbackCenter));

    return {
      origin: validOrigin ? [oLat, oLng] : null,
      current: validCurrent ? [cLat, cLng] : null,
      dest: validDest ? [dLat, dLng] : null,
      historyCoords,
      allCoords,
      center,
      mapId: `map-${center.join('-')}` // Unique key to force re-render on center change
    };
  }, [originLat, originLng, currentLat, currentLng, destLat, destLng, history]);

  return (
    <div className="relative h-full w-full bg-slate-100 group overflow-hidden rounded-[2.5rem]">
      <MapContainer
        key={routeData.mapId}
        center={routeData.center}
        zoom={routeData.current ? 6 : 4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <ZoomControl position="bottomright" />
        <MapResizer coords={routeData.allCoords} center={routeData.center} />

        {/* Global Logistics Route Path */}
        {routeData.allCoords.length > 1 && (
          <Polyline 
            positions={routeData.allCoords} 
            pathOptions={{ 
              color: '#3b82f6', 
              weight: 3, 
              dashArray: '10, 15', 
              opacity: 0.6,
              lineCap: 'round'
            }} 
          />
        )}

        {/* Origin Marker */}
        {routeData.origin && (
          <Marker position={routeData.origin} icon={originIcon}>
            <Popup className="custom-popup">
              <div className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white">
                <span className="block border-b border-slate-100 pb-2 mb-2 text-emerald-600">Origin Point</span>
                Departure Terminal
              </div>
            </Popup>
          </Marker>
        )}

        {/* History / Transit Nodes */}
        {routeData.historyCoords.map((coord, idx) => (
          <Marker key={`hist-${idx}`} position={coord} icon={waypointIcon}>
            <Popup className="custom-popup">
              <div className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white">
                <span className="block border-b border-slate-100 pb-2 mb-2">Transit Node</span>
                {history[idx]?.currentLocation}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Final Destination Marker */}
        {routeData.dest && (
          <Marker position={routeData.dest} icon={destinationIcon}>
            <Popup className="custom-popup">
              <div className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white">
                <span className="block border-b border-slate-100 pb-2 mb-2 text-rose-600">Final Destination</span>
                Target Address
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current / Active Position Marker */}
        {routeData.current && (
          <Marker position={routeData.current} icon={currentPosIcon}>
            <Popup className="custom-popup" autoPan={true}>
               <div className="p-6 space-y-4 min-w-[240px] bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-black text-primary-main uppercase tracking-[0.3em] flex items-center gap-2">
                        <Activity size={14} className="animate-pulse" /> Live Telemetry
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Terminal Active</span>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Current Localization</p>
                          <h4 className="text-sm font-black text-slate-950 leading-tight uppercase tracking-tighter italic">{parcelDestination}</h4>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LAT</span>
                              <span className="text-[10px] font-mono font-bold text-slate-900">{routeData.current[0].toFixed(5)}</span>
                          </div>
                          <div className="flex flex-col text-right">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LNG</span>
                              <span className="text-[10px] font-mono font-bold text-slate-900">{routeData.current[1].toFixed(5)}</span>
                          </div>
                      </div>
                  </div>
               </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Spatial Legend Overlay */}
      <div className="absolute top-6 left-6 z-[1000] p-6 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] space-y-5 pointer-events-none transition-all duration-700">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                <Globe size={18} />
            </div>
            <div>
                <h5 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-0.5 shadow-white">Route Telemetry</h5>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Origin to Destination</p>
            </div>
         </div>
         <div className="h-px bg-slate-100" />
          <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest opacity-70">Induction Terminal (Origin)</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary-main shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest opacity-70">Dispatch Asset (Cargo)</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 bg-white rounded-full border border-slate-300" />
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest opacity-70">Legacy Waypoints</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest opacity-70">Target Extraction (Dest)</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MapComponent;
