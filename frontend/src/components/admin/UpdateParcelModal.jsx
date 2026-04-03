import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calculator, 
  AlertTriangle, 
  Bell, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  DollarSign, 
  History,
  Loader2,
  CheckCircle,
  X,
  Package,
  Globe,
  Clock,
  Navigation2,
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  FilePlus,
  Plus
} from 'lucide-react';
import { useUpdateParcelMutation, useGetParcelQuery } from '../../features/parcel/parcelApiSlice';
import { motion, AnimatePresence } from 'framer-motion';

const UpdateParcelForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const trackingNumber = queryParams.get('trackingNumber');

  const { data: existingData, isLoading: isFetching } = useGetParcelQuery(trackingNumber, {
    skip: !trackingNumber
  });

  const [parcelData, setParcelData] = useState({
    currentLocation: '',
    originLatitude: '',
    originLongitude: '',
    currentLatitude: '',
    currentLongitude: '',
    destinationLatitude: '',
    destinationLongitude: '',
    progressStatus: 0,
    status: '',
    dispatchDate: '',
    deliveryDate: '',
    updatedAt: new Date().toISOString().split('T')[0],
    freight_charge: 0,
    insurance_fee: 0,
    tax_due: 0,
    payment_status: 'Pending',
    hold_reason: '',
    release_fee: 0,
    description: '',
    newImages: [], // For new uploads
    existingImages: [], // Loaded from DB
    quantity: 1
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelMutation();

  const [searchQuery, setSearchQuery] = useState({ field: '', value: '' });
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const query = searchQuery.value;
    if (query && query.length > 3) {
      const delayFn = setTimeout(() => {
        setIsSearching(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
             setLocationResults(data);
             setIsSearching(false);
          }).catch(() => setIsSearching(false));
      }, 700);
      return () => clearTimeout(delayFn);
    } else {
      setLocationResults([]);
    }
  }, [searchQuery.value]);

  const selectLocation = (loc) => {
    if (searchQuery.field === 'current') {
        setParcelData(prev => ({
          ...prev,
          currentLocation: loc.display_name,
          currentLatitude: loc.lat,
          currentLongitude: loc.lon
        }));
    } else {
        setParcelData(prev => ({
            ...prev,
            destination: loc.display_name,
            destinationLatitude: loc.lat,
            destinationLongitude: loc.lon,
            destinationName: loc.display_name
        }));
    }
    setSearchQuery({ field: '', value: '' });
    setLocationResults([]);
    showNotification('Geographic coordinates synchronized.');
  };

  useEffect(() => {
    if (existingData?.result) {
      const res = existingData.result;
      setParcelData({
        currentLocation: res.currentLocation || '',
        originLatitude: res.originLatitude || '',
        originLongitude: res.originLongitude || '',
        currentLatitude: res.currentLatitude || '',
        currentLongitude: res.currentLongitude || '',
        destinationLatitude: res.destinationLatitude || '',
        destinationLongitude: res.destinationLongitude || '',
        progressStatus: res.progressStatus || 0,
        status: res.status || '',
        dispatchDate: res.dispatchDate || '',
        deliveryDate: res.deliveryDate || '',
        updatedAt: res.updatedAt ? new Date(res.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        freight_charge: res.freight_charge || 0,
        insurance_fee: res.insurance_fee || 0,
        tax_due: res.tax_due || 0,
        payment_status: res.payment_status || 'Pending',
        hold_reason: res.hold_reason || '',
        release_fee: res.release_fee || 0,
        description: res.description || '',
        existingImages: res.images || [],
        newImages: [],
        destinationName: res.destination || '',
        quantity: res.quantity || 1
      });
    }
  }, [existingData]);

  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!parcelData.newImages) return;
    const urls = parcelData.newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [parcelData.newImages]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e) => {
    setParcelData(prev => ({ ...prev, progressStatus: Number(e.target.value) }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files) {
      setParcelData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...Array.from(files)]
      }));
    }
  };

  const removeNewImage = (idx) => {
    setParcelData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== idx)
    }));
  };

  const removeExistingImage = (url) => {
    setParcelData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(u => u !== url)
    }));
  };

  const autoCalculateFees = () => {
    const weight = existingData?.result?.weight || 1;
    const baseFreight = weight * 15; 
    const insurance = baseFreight * 0.05; 
    const tax = baseFreight * 0.12; 
    
    setParcelData(prev => ({
      ...prev,
      freight_charge: baseFreight.toFixed(2),
      insurance_fee: insurance.toFixed(2),
      tax_due: tax.toFixed(2)
    }));
    showNotification('Financial estimates projected.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber) return showNotification('Tracking number missing', 'error');

    const formData = new FormData();
    Object.keys(parcelData).forEach(key => {
      if (key === 'newImages') {
          parcelData.newImages.forEach(file => formData.append('image', file));
      } else if (key === 'existingImages') {
          formData.append('keepImages', JSON.stringify(parcelData.existingImages));
      } else {
          formData.append(key, parcelData[key]);
      }
    });

    try {
      await updateParcel({
        trackingNumber,
        data: formData
      }).unwrap();
      showNotification('Logistic stream updated successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      showNotification(error?.data?.message || 'Update failed', 'error');
    }
  };

  const inputClass = "w-full h-12 bg-white border border-slate-300 rounded-xl px-12 text-sm font-bold text-slate-700 outline-none transition-all focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-300";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1";

  if (isFetching) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4 bg-[#F3F4F6] min-h-screen">
        <Loader2 className="w-12 h-12 text-primary-main animate-spin" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Verifying Asset Manifest...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 px-6">
      <div className="max-w-4xl mx-auto mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 hover:text-primary-main font-black text-[10px] uppercase tracking-widest transition-all group"
          >
            <ArrowLeft size={16} />
            Back to Command Terminal
          </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-200"
      >
        {/* Professional Header */}
        <div className="px-10 py-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary-main/5 rounded-2xl flex items-center justify-center text-primary-main shadow-inner">
                    <Package size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1.5 underline decoration-primary-main/10">Modify Transit Node</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-main animate-pulse" /> Asset Tracking: <span className="text-slate-900 border-b border-slate-200">{trackingNumber}</span>
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Audit Year</p>
                    <p className="text-sm font-black text-slate-900">FY 2026/27</p>
                </div>
                <div className="h-10 w-px bg-slate-100 mx-2 hidden lg:block" />
                <span className="px-4 py-2 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl">
                    Executive Access
                </span>
            </div>
        </div>

        <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-16">
                {/* SECTION: TRANSIT & GEO-LOCATION */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Transit & Geo-Location</h4>
                        <div className="h-px bg-slate-200 w-full" />
                    </div>
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1 relative group">
                                <label className={labelClass}>Current Node Coordinate (Live Search)</label>
                                <div className="relative flex items-center">
                                    <MapPin className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                    <input 
                                        name="currentLocation" 
                                        value={parcelData.currentLocation} 
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSearchQuery({ field: 'current', value: e.target.value });
                                        }} 
                                        placeholder="Terminal, Airport, or City..."
                                        className={inputClass}
                                        required
                                    />
                                    {isSearching && searchQuery.field === 'current' && <Loader2 className="absolute right-4 text-primary-main animate-spin" size={18} />}
                                </div>
                                
                                <AnimatePresence>
                                    {locationResults.length > 0 && searchQuery.field === 'current' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-2 overflow-hidden"
                                        >
                                            {locationResults.map((loc, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => selectLocation(loc)}
                                                    className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-start gap-4 transition-all"
                                                >
                                                    <Navigation size={14} className="mt-1 text-slate-300" />
                                                    <div>
                                                        <p className="text-[12px] font-bold text-slate-800 line-clamp-1">{loc.display_name}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                            COORD: {parseFloat(loc.lat).toFixed(4)}N / {parseFloat(loc.lon).toFixed(4)}E
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Current Node Latitude</label>
                                    <input 
                                        name="currentLatitude" 
                                        value={parcelData.currentLatitude} 
                                        onChange={handleChange} 
                                        placeholder="e.g. 40.7128"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Current Node Longitude</label>
                                    <input 
                                        name="currentLongitude" 
                                        value={parcelData.currentLongitude} 
                                        onChange={handleChange} 
                                        placeholder="e.g. -74.0060"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 opacity-50 focus-within:opacity-100 transition-opacity">
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Final Target Latitude</label>
                                    <input 
                                        name="destinationLatitude" 
                                        value={parcelData.destinationLatitude} 
                                        onChange={handleChange} 
                                        placeholder="Target Latitude"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Final Target Longitude</label>
                                    <input 
                                        name="destinationLongitude" 
                                        value={parcelData.destinationLongitude} 
                                        onChange={handleChange} 
                                        placeholder="Target Longitude"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className={labelClass}>Final Target (Search Update)</label>
                                <div className="relative flex items-center">
                                    <MapPin className="absolute left-4 text-slate-300 group-focus-within:text-primary-main transition-colors" size={18} />
                                    <input 
                                        name="parcelDestination" 
                                        value={parcelData.destinationName || ''} 
                                        onChange={(e) => {
                                            setParcelData(prev => ({ ...prev, destinationName: e.target.value }));
                                            setSearchQuery({ field: 'destination', value: e.target.value });
                                        }} 
                                        placeholder="Update Final Destination Address..."
                                        className={inputClass}
                                    />
                                    {isSearching && searchQuery.field === 'destination' && <Loader2 className="absolute right-4 text-primary-main animate-spin" size={18} />}
                                </div>
                                <AnimatePresence>
                                    {locationResults.length > 0 && searchQuery.field === 'destination' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 py-2"
                                        >
                                            {locationResults.map((loc, idx) => (
                                                <button key={idx} type="button" onClick={() => {
                                                    setParcelData(prev => ({
                                                        ...prev,
                                                        destination: loc.display_name,
                                                        destinationLatitude: loc.lat,
                                                        destinationLongitude: loc.lon,
                                                        destinationName: loc.display_name
                                                    }));
                                                    setLocationResults([]);
                                                }} className="w-full text-left px-5 py-3 hover:bg-slate-50 text-[10px] font-bold text-slate-600">
                                                    {loc.display_name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-1">
                                <label className={labelClass}>Operational Movement Status</label>
                                <div className="relative flex items-center">
                                    <Navigation2 className="absolute left-4 text-slate-300" size={18} />
                                    <select name="status" value={parcelData.status} onChange={handleChange} className={inputClass} required>
                                        <option value="picked up">Picked Up</option>
                                        <option value="in transit">In Transit</option>
                                        <option value="arrived at facility">Arrived at Facility</option>
                                        <option value="out for delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="impounded">⚠ HELD BY CUSTOMS (IMPOUNDED)</option>
                                        <option value="sealed">⚠ SEALED BY CUSTOMS</option>
                                        <option value="insurance_held">⚠ INSURANCE HEADER HELD</option>
                                        <option value="security_audit">⚠ SECURITY AUDIT RESTRICTION</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className={labelClass}>Dispatch Date</label>
                                <div className="relative flex items-center">
                                    <Clock className="absolute left-4 text-slate-300" size={18} />
                                    <input 
                                        type="date"
                                        name="dispatchDate" 
                                        value={parcelData.dispatchDate} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className={labelClass}>Expected Delivery</label>
                                    <div className="relative flex items-center">
                                        <Clock className="absolute left-4 text-slate-300" size={18} />
                                        <input 
                                            type="date"
                                            name="deliveryDate" 
                                            value={parcelData.deliveryDate} 
                                            onChange={handleChange} 
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className={labelClass}>Dispatch Quantity (Units)</label>
                                    <div className="relative flex items-center">
                                        <Package className="absolute left-4 text-slate-300" size={18} />
                                        <input 
                                            type="number"
                                            name="quantity" 
                                            value={parcelData.quantity} 
                                            onChange={handleChange} 
                                            placeholder="1"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {['impounded', 'sealed', 'insurance_held', 'security_audit'].includes(parcelData.status) && (
                                <div className="md:col-span-2 p-6 bg-rose-50 border border-rose-100 rounded-xl space-y-4 animate-pulse">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                                <AlertTriangle size={14} /> Restriction Clause / Reason
                                            </label>
                                            <textarea 
                                              name="hold_reason" 
                                              rows="2" 
                                              value={parcelData.hold_reason} 
                                              onChange={handleChange} 
                                              placeholder="Enter internal restriction codes or reason..."
                                              className="w-full bg-white border border-rose-200 rounded-lg p-4 text-xs font-bold text-rose-900 outline-none focus:border-rose-500 transition-all resize-none"
                                            />
                                        </div>
                                        <div className="w-full md:w-64 space-y-2">
                                            <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                                <DollarSign size={14} /> Release Settlement Fee ($)
                                            </label>
                                            <input 
                                              type="number" 
                                              name="release_fee" 
                                              value={parcelData.release_fee || 0} 
                                              onChange={handleChange} 
                                              className="w-full h-12 bg-white border border-rose-200 rounded-lg px-4 text-sm font-black text-rose-900 outline-none focus:border-rose-500 transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest italic mt-2 flex items-center gap-2">
                                        <ShieldCheck size={12} /> Institutional Notice: Commit will generate an automated financial settlement receipt.
                                    </p>
                                </div>
                            )}
                        </div>
                    

                    <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-8">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Load Index</span>
                            <span className="text-2xl font-black text-primary-main">{parcelData.progressStatus}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={parcelData.progressStatus} 
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-main"
                        />
                        <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-50">
                            <span>Origin Terminal</span>
                            <span>Mid-Point Transit</span>
                            <span>Final Resolution</span>
                        </div>
                    </div>
                </div>

                {/* SECTION: FINANCIALS & CLEARANCE */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Financials & Clearance</h4>
                        <div className="h-px bg-slate-200 w-full" />
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none">
                            <Calculator size={140} />
                        </div>
                        <div className="relative z-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center block">Freight ($)</label>
                                    <input name="freight_charge" type="number" value={parcelData.freight_charge} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-lg font-black text-white outline-none focus:border-primary-light transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center block">Insurance ($)</label>
                                    <input name="insurance_fee" type="number" value={parcelData.insurance_fee} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-lg font-black text-white outline-none focus:border-primary-light transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center block">Duties ($)</label>
                                    <input name="tax_due" type="number" value={parcelData.tax_due} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-lg font-black text-white outline-none focus:border-primary-light transition-all" />
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-full">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-1">Ledger Settle State</label>
                                    <select name="payment_status" value={parcelData.payment_status} onChange={handleChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-black text-white outline-none focus:border-primary-light transition-all">
                                        <option value="Pending" className="bg-slate-900">Pending Payment</option>
                                        <option value="Paid" className="bg-slate-900">Payment Settled</option>
                                        <option value="Refunded" className="bg-slate-900">Refunded</option>
                                    </select>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={autoCalculateFees} 
                                    className="w-full md:w-2/3 h-12 mt-6 bg-primary-main hover:bg-white hover:text-primary-main text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                                >
                                    <Calculator size={18} /> Refactor Fees
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: ASSET MANIFEST (IMAGES & DESCRIPTION) */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Asset Manifest & Description Modification</h4>
                        <div className="h-px bg-slate-200 w-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* ITEM DESCRIPTION */}
                        <div className="space-y-6">
                            <label className={labelClass}>Detailed Item Manifest / Notes</label>
                            <textarea 
                                name="description" 
                                value={parcelData.description} 
                                onChange={handleChange} 
                                placeholder="Update consignment breakdown..." 
                                className="w-full h-[320px] bg-white border border-slate-300 rounded-2xl p-6 text-sm font-bold text-slate-700 outline-none focus:border-primary-main transition-all resize-none shadow-inner"
                            />
                        </div>

                        {/* IMAGES MANAGEMENT */}
                        <div className="space-y-8 flex flex-col">
                            {/* NEW ASSETS UPLOAD */}
                            <div className="space-y-4">
                                <label className={labelClass}>Inbound Asset Staging (Photos)</label>
                                <div className="relative group overflow-hidden border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary-main hover:bg-primary-main/5 transition-all text-center h-32 flex items-center justify-center">
                                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" multiple />
                                    <div className="p-4">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mx-auto group-hover:text-primary-main transition-all mb-2">
                                            <FilePlus size={20} />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bridge photos to terminal</p>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW & EXISTING */}
                            <div className="flex-1 space-y-4">
                                <label className={labelClass}>Manifest Visual Archive (Existing & Staged)</label>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[140px]">
                                    <div className="grid grid-cols-4 gap-3">
                                        {/* Existing */}
                                        {parcelData.existingImages.map((url, idx) => (
                                            <div key={`ex-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 bg-white shadow-sm">
                                                <img src={url} alt="Existing" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeExistingImage(url)} className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors shadow-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* New */}
                                        {imagePreviews.map((url, idx) => (
                                            <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-primary-light">
                                                <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeNewImage(idx)} className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 shadow-xl">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {parcelData.existingImages.length === 0 && imagePreviews.length === 0 && (
                                            <div className="col-span-4 py-8 text-center text-slate-300">
                                                <ImageIcon size={24} className="mx-auto mb-2 opacity-20" />
                                                <p className="text-[9px] font-black uppercase tracking-widest">Archive Empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ACTION FOOTER */}
                <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="px-12 py-3 bg-primary-main hover:bg-primary-dark text-white rounded-xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-primary-main/20 flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={18} />}
                      Commit Log Changes
                    </button>
                </div>
            </form>
        </div>
      </motion.div>

      {/* NOTIFICATION HUB */}
      {notification.show && (
        <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-white/5' : 'bg-red-600 text-white border-red-500'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default UpdateParcelForm;
