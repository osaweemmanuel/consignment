import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Calculator, 
  Package, 
  User, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FilePlus,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
  Hash,
  Globe,
  Navigation2,
  Mail,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useCreateParcelMutation, useGetAllParcelsQuery } from '../../features/parcel/parcelApiSlice';

const genderOptions = ['Male', 'Female', 'Other'];
const serviceTypeOptions = ['Air Freight', 'Road Freight', 'Sea Freight', 'Express Global'];

const ParcelFormModal = () => {
  const [open, setOpen] = useState(false);
  const [parcelData, setParcelData] = useState({
    senderName: '',
    senderGender: '',
    senderPhone: '',
    senderNationality: '',
    senderEmail: '',
    receiverName: '',
    receiverPhone: '',
    receiverGender: '',
    receiverNationality: '',
    receiverEmail: '',
    origin: '',
    originLatitude: '',
    originLongitude: '',
    currentLatitude: '',
    currentLongitude: '',
    weight: '',
    destination: '',
    destinationLatitude: '',
    destinationLongitude: '',
    service_type: '',
    description: '',
    parcelName: '',
    dispatchDate: '',
    deliveryDate: '',
    image: null,
    freight_charge: 0,
    insurance_fee: 0,
    tax_due: 0
  });

  const [searchQuery, setSearchQuery] = useState({ field: '', value: '' });
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle Image Preview Cleanup
  useEffect(() => {
    if (!parcelData.image) return;
    
    const urls = parcelData.image.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [parcelData.image]);

  useEffect(() => {
    if (searchQuery.value.length > 3) {
      const delayFn = setTimeout(() => {
        setIsSearching(true);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery.value)}`)
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
  }, [searchQuery]);

  const selectLocation = (loc, field) => {
    if (field === 'origin') {
        setParcelData(prev => ({
            ...prev,
            origin: loc.display_name,
            originLatitude: loc.lat,
            originLongitude: loc.lon,
            // also set initial current position to origin
            currentLatitude: loc.lat,
            currentLongitude: loc.lon
        }));
    } else {
        setParcelData(prev => ({
            ...prev,
            destination: loc.display_name,
            destinationLatitude: loc.lat,
            destinationLongitude: loc.lon
        }));
    }
    setSearchQuery({ field: '', value: '' });
    setLocationResults([]);
  };

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { refetch } = useGetAllParcelsQuery();
  const [createParcel, { isSuccess, isLoading, isError, error: apiError }] = useCreateParcelMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleClose();
      showNotification('Consignment successfully registered in the manifest.');
    }
    if (isError) {
      showNotification(apiError?.data?.message || 'Failed to initialize shipment.', 'error');
    }
  }, [isSuccess, isError, refetch, apiError]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setParcelData({
      senderName: '', senderGender: '', senderPhone: '', senderNationality: '', senderEmail: '',
      receiverName: '', receiverPhone: '', receiverGender: '', receiverNationality: '', receiverEmail: '',
      origin: '', weight: '', destination: '', destinationLatitude: '', destinationLongitude: '',
      service_type: '', description: '', parcelName: '', dispatchDate: '', deliveryDate: '', image: null,
      freight_charge: 0, insurance_fee: 0, tax_due: 0, quantity: 1
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      const newFiles = Array.from(files);
      setParcelData(prev => ({ 
        ...prev, 
        image: prev.image ? [...prev.image, ...newFiles] : newFiles 
      }));
    } else {
      setParcelData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    setParcelData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const clearAllImages = () => {
    setParcelData(prev => ({ ...prev, image: null }));
  };

  const autoCalculate = () => {
    const weightVal = parseFloat(parcelData.weight) || 0;
    if (weightVal === 0) return showNotification('Please enter weight first.', 'error');
    
    const freight = weightVal * 12.5; 
    const insurance = freight * 0.08;
    const tax = freight * 0.15;
    
    setParcelData(prev => ({
      ...prev,
      freight_charge: freight.toFixed(2),
      insurance_fee: insurance.toFixed(2),
      tax_due: tax.toFixed(2)
    }));
    showNotification('Financial estimates projected.');
  };

  const handleParcelSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(parcelData).forEach(key => {
      if (key === 'image' && Array.isArray(parcelData[key])) {
          parcelData[key].forEach(file => {
              formData.append('image', file);
          });
      } else {
        formData.append(key, parcelData[key]);
      }
    });

    try {
      await createParcel(formData).unwrap();
    } catch (err) {}
  };

  const inputClass = "w-full h-11 bg-white border border-slate-300 rounded-lg px-4 text-xs font-bold text-slate-700 outline-none transition-all focus:border-primary-main focus:ring-4 focus:ring-primary-main/5 placeholder:text-slate-300";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block";

  return (
    <>
      <button 
        onClick={handleOpen}
        className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-md flex items-center gap-2 group"
      >
        <Plus className="w-4 h-4" />
        Register Consignment
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-scale-in flex flex-col">
            
            {/* Professional Clean Header */}
            <div className="px-10 py-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-main/5 rounded-xl flex items-center justify-center text-primary-main">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Consignment Manifest</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> New Entry Registration Protocol
                        </p>
                    </div>
                </div>
                <button 
                  onClick={handleClose} 
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 transition-all active:scale-95"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
                <form onSubmit={handleParcelSubmit} className="space-y-12">
                    {/* SECTION: SENDER INFORMATION */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Sender Information</h4>
                            <div className="h-px bg-slate-200 w-full" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Full Legal Name</label>
                                <input name="senderName" value={parcelData.senderName} onChange={handleChange} placeholder="Consignor Name" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Contact Number</label>
                                <input name="senderPhone" value={parcelData.senderPhone} onChange={handleChange} placeholder="+1 (000) 123-4567" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Sender Gender</label>
                                <select name="senderGender" value={parcelData.senderGender} onChange={handleChange} className={inputClass}>
                                    <option value="">Select Gender</option>
                                    {genderOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Sender Email Address</label>
                                <input name="senderEmail" type="email" value={parcelData.senderEmail} onChange={handleChange} placeholder="sender@domain.com" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: RECIPIENT INFORMATION */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Recipient Information</h4>
                            <div className="h-px bg-slate-200 w-full" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Target Recipient</label>
                                <input name="receiverName" value={parcelData.receiverName} onChange={handleChange} placeholder="Consignee Name" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Dispatch Email Address</label>
                                <input name="receiverEmail" type="email" value={parcelData.receiverEmail} onChange={handleChange} placeholder="recipient@domain.com" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Recipient Contact</label>
                                <input name="receiverPhone" value={parcelData.receiverPhone} onChange={handleChange} placeholder="+1 (000) 123-4567" className={inputClass} required />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: CONSIGNMENT DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Consignment Details</h4>
                            <div className="h-px bg-slate-200 w-full" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2">
                                <label className={labelClass}>Consignment Title / Name</label>
                                <input name="parcelName" value={parcelData.parcelName} onChange={handleChange} placeholder="e.g. Industrial Equipment, Personal Electronics" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Verified Mass (KG)</label>
                                <input name="weight" type="number" step="0.01" value={parcelData.weight} onChange={handleChange} placeholder="0.00" className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Service Tier</label>
                                <select name="service_type" value={parcelData.service_type} onChange={handleChange} className={inputClass}>
                                    <option value="">Select Tier</option>
                                    {serviceTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className={labelClass}>Origin Terminal (Search)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input 
                                        name="origin" 
                                        value={parcelData.origin} 
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSearchQuery({ field: 'origin', value: e.target.value });
                                        }} 
                                        placeholder="Departure City/Terminal" 
                                        className={`${inputClass} pl-10`} 
                                        required 
                                    />
                                    {isSearching && searchQuery.field === 'origin' && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-main animate-spin" size={14} />}
                                </div>
                                {locationResults.length > 0 && searchQuery.field === 'origin' && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xl z-[110] mt-1 max-h-48 overflow-y-auto">
                                        {locationResults.map((loc, i) => (
                                            <button key={i} type="button" onClick={() => selectLocation(loc, 'origin')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[10px] font-bold text-slate-600 border-b border-slate-100 last:border-0">
                                                {loc.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className={labelClass}>Final Destination (Search)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input 
                                        name="destination" 
                                        value={parcelData.destination} 
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSearchQuery({ field: 'destination', value: e.target.value });
                                        }} 
                                        placeholder="Target City/Address" 
                                        className={`${inputClass} pl-10`} 
                                        required 
                                    />
                                    {isSearching && searchQuery.field === 'destination' && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-main animate-spin" size={14} />}
                                </div>
                                {locationResults.length > 0 && searchQuery.field === 'destination' && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-2xl z-[110] mt-1 max-h-48 overflow-y-auto">
                                        {locationResults.map((loc, i) => (
                                            <button key={i} type="button" onClick={() => selectLocation(loc, 'destination')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[10px] font-bold text-slate-600 border-b border-slate-100 last:border-0">
                                                {loc.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>Dispatch Date</label>
                                <input name="dispatchDate" type="date" value={parcelData.dispatchDate} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Estimated Delivery</label>
                                <input name="deliveryDate" type="date" value={parcelData.deliveryDate} onChange={handleChange} className={inputClass} required />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: FINANCIALS & ASSETS */}
                    <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                            <Calculator size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <h4 className="text-[11px] font-black text-primary-light uppercase tracking-widest whitespace-nowrap">Financial Projection</h4>
                                <div className="h-px bg-white/10 w-full" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">Freight ($)</label>
                                    <input name="freight_charge" type="number" value={parcelData.freight_charge} onChange={handleChange} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs font-black text-white outline-none focus:border-primary-light transition-all text-center" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">Insurance ($)</label>
                                    <input name="insurance_fee" type="number" value={parcelData.insurance_fee} onChange={handleChange} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs font-black text-white outline-none focus:border-primary-light transition-all text-center" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">Tax Applied ($)</label>
                                    <input name="tax_due" type="number" value={parcelData.tax_due} onChange={handleChange} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs font-black text-white outline-none focus:border-primary-light transition-all text-center" />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={autoCalculate}
                                    className="h-10 bg-primary-main hover:bg-white hover:text-primary-main text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group px-4"
                                >
                                    <Calculator size={16} /> Auto-Project
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DETAILED MANIFEST & IMAGE UPLOAD */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-black text-primary-main uppercase tracking-widest whitespace-nowrap">Asset Manifest & Itemization</h4>
                            {parcelData.image && parcelData.image.length > 0 && (
                                <button 
                                    type="button" 
                                    onClick={clearAllImages}
                                    className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 size={12} /> Purge All Assets
                                </button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Detailed Description */}
                            <div className="space-y-4">
                                <label className={labelClass}>Detailed Item Manifest / Notes</label>
                                <textarea 
                                    name="description" 
                                    value={parcelData.description} 
                                    onChange={handleChange} 
                                    placeholder="Provide a comprehensive breakdown of the consignment contents, serial numbers, or special handling instructions..." 
                                    className={`${inputClass} h-[240px] py-4 resize-none leading-relaxed`}
                                    required
                                />
                            </div>

                            {/* Image Upload & Previews */}
                            <div className="space-y-4 flex flex-col">
                                <label className={labelClass}>Digital Asset Induction (Photos)</label>
                                <div className="flex-1 space-y-4">
                                    <div className="relative group overflow-hidden border-2 border-dashed border-slate-200 rounded-xl hover:border-primary-main hover:bg-primary-main/5 transition-all h-32">
                                        <input type="file" name="image" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" multiple />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-300 group-hover:text-primary-main group-hover:border-primary-main transition-all">
                                                <FilePlus size={20} />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 px-4 text-center">
                                                Bridge photos to ledger
                                            </p>
                                        </div>
                                    </div>

                                    {/* PREVIEW CONTAINER */}
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[92px] flex-1">
                                        {imagePreviews.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {imagePreviews.map((url, index) => (
                                                    <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                        <img src={url} alt="Manifest" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeImage(index)}
                                                                className="p-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-300 min-h-[60px]">
                                                <ImageIcon size={24} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Induction</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                                    JPG, PNG, WEBP (MAX 5MB/UNIT)
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-10 py-6 border-t border-slate-200 bg-white flex justify-end gap-4 sticky bottom-0">
                <button 
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                  onClick={handleParcelSubmit}
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-primary-main hover:bg-primary-dark text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-main/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Init Tracking Log
                </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION HUB */}
      {notification.show && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up border ${
            notification.type === 'success' ? 'bg-slate-900 text-white border-white/5' : 'bg-red-600 text-white border-red-500'
        }`}>
            {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={18} /> : <AlertCircle size={18} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification({ show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={14} /></button>
        </div>
      )}
    </>
  );
};

export default ParcelFormModal;
