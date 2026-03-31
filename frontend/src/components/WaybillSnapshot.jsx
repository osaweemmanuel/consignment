import React from 'react';
import { Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ELITE LEGACY HEX PALETTE (Bypasses oklch errors)
const colors = {
    white: '#ffffff',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate900: '#0f172a',
    primary: '#7c3aed', // Institutional Violet
    green50: '#f0fdf4',
    green100: '#dcfce7',
    green600: '#16a34a',
    red50: '#fef2f2',
    red100: '#fee2e2',
    red600: '#dc2626'
};

const WaybillSnapshot = React.forwardRef(({ data, trackingNumber }, ref) => {
  if (!data) return null;

  const freightValue = Number(data.freight_charge) || 0;
  const insuranceValue = Number(data.insurance_fee) || 0;
  const taxValue = Number(data.tax_due) || 0;
  const totalValue = freightValue + insuranceValue + taxValue;

  return (
    <div 
      ref={ref} 
      style={{ width: '790px', minHeight: '1120px', padding: '40px', backgroundColor: colors.white, color: colors.slate900, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.02, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <Globe size={500} color={colors.slate900} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: colors.slate900, borderRadius: '12px', color: colors.white }}>
            <Globe size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>TUNSPHRESH GLOBAL</h1>
            <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.4em', color: colors.slate400 }}>LOGISTICS COMMAND</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: colors.primary, letterSpacing: '-0.05em', margin: 0 }}>AIRWAY BILL</h2>
          <p style={{ fontSize: '9px', fontWeight: 700, color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Manifest #TRS-{trackingNumber}</p>
        </div>
      </div>

      <div style={{ backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}`, padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <div>
            <span style={{ fontSize: '8px', fontWeight: 900, color: colors.primary, letterSpacing: '0.4em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>VALIDATED TRACKING ID</span>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>{trackingNumber}</div>
         </div>
         <div style={{ padding: '8px', backgroundColor: colors.white, borderRadius: '12px', border: `1px solid ${colors.slate200}` }}>
            <QRCodeSVG value={`https://tunshpreshgloballtd.com/parcels/${trackingNumber}`} size={70} level="M" fgColor={colors.slate900} bgColor={colors.white} />
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <div>
            <span style={{ fontSize: '8px', fontWeight: 900, color: colors.primary, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', borderBottom: `1px solid ${colors.slate100}`, paddingBottom: '6px' }}>SHIPPER / CONSIGNOR</span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', margin: 0 }}>{data.senderName}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', fontWeight: 500, color: colors.slate600 }}>
                <p style={{ margin: 0 }}>CONTACT: {data.senderPhone}</p>
                <p style={{ margin: 0 }}>EMAIL: {data.senderEmail || 'N/A'}</p>
                <p style={{ margin: 0 }}>ORIGIN NODE: {data.origin}</p>
                <p style={{ fontWeight: 700, color: colors.slate900, marginTop: '8px', textTransform: 'uppercase' }}>NATIONALITY: {data.senderNationality}</p>
            </div>
         </div>
         <div>
            <span style={{ fontSize: '8px', fontWeight: 900, color: colors.primary, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', borderBottom: `1px solid ${colors.slate100}`, paddingBottom: '6px' }}>CONSIGNEE / RECEIVER</span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', margin: 0 }}>{data.receiverName}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', fontWeight: 500, color: colors.slate600 }}>
                <p style={{ margin: 0 }}>CONTACT: {data.receiverPhone}</p>
                <p style={{ margin: 0 }}>SECURE EMAIL: {data.receiverEmail}</p>
                <p style={{ fontWeight: 700, color: colors.slate900, marginTop: '8px', textTransform: 'uppercase' }}>FINAL DESTINATION: {data.destination}</p>
            </div>
         </div>
      </div>

      <div style={{ marginBottom: '48px', position: 'relative', zIndex: 10 }}>
        <span style={{ fontSize: '8px', fontWeight: 900, color: colors.primary, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '16px', borderBottom: `1px solid ${colors.slate100}`, paddingBottom: '6px' }}>SHIPMENT PARAMETERS</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {[
                { label: 'MASS (KG)', val: data.weight },
                { label: 'SERVICE TIER', val: data.service_type || 'EXPRESS' },
                { label: 'CONTENT CODE', val: data.parcelName || 'SECURED' },
                { label: 'DISPATCHED', val: data.dispatchDate ? new Date(data.dispatchDate).toLocaleDateString() : 'N/A' },
                { label: 'EXP. ARRIVAL', val: data.deliveryDate ? new Date(data.deliveryDate).toLocaleDateString() : 'N/A' }
            ].map((item, i) => (
                <div key={i} style={{ padding: '10px', backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}`, borderRadius: '12px' }}>
                    <span style={{ fontSize: '7px', fontWeight: 900, color: colors.slate400, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{item.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '-0.02em', color: colors.slate900 }}>{item.val}</span>
                </div>
            ))}
        </div>
      </div>

      <div style={{ padding: '24px', backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}`, borderRadius: '24px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <span style={{ fontSize: '8px', fontWeight: 900, color: colors.slate400, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>OPERATIONAL DESCRIPTION</span>
         <p style={{ fontSize: '11px', fontWeight: 500, fontStyle: 'italic', color: colors.slate600, lineHeight: 1.4, margin: 0 }}>"{data.description || 'No specialized operational notes provided.'}"</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', relative: 'relative', zIndex: 10 }}>
         <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 500, color: colors.slate500 }}>
               <span>Freight Charges</span>
               <span style={{ fontWeight: 700, color: colors.slate900 }}>${freightValue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 500, color: colors.slate500 }}>
               <span>Security & Insurance</span>
               <span style={{ fontWeight: 700, color: colors.slate900 }}>${insuranceValue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 500, color: colors.slate500 }}>
               <span>Regional Tax</span>
               <span style={{ fontWeight: 700, color: colors.slate900 }}>${taxValue.toFixed(2)}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: colors.slate100, margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.primary }}>
               <span style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase' }}>Gross Total</span>
               <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.05em' }}>
                 ${totalValue.toFixed(2)}
               </span>
            </div>
            <div style={{ 
                textAlign: 'right', 
                marginTop: '8px', 
                padding: '6px 12px', 
                borderRadius: '8px', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                fontSize: '8px', 
                letterSpacing: '0.1em', 
                border: '1px solid',
                backgroundColor: data.payment_status?.toLowerCase() === 'paid' ? colors.green50 : colors.red50,
                borderColor: data.payment_status?.toLowerCase() === 'paid' ? colors.green100 : colors.red100,
                color: data.payment_status?.toLowerCase() === 'paid' ? colors.green600 : colors.red600
            }}>
               STATUS: {data.payment_status?.toUpperCase() || 'PENDING'}
            </div>
         </div>
      </div>

      <div style={{ position: 'absolute', bottom: '32px', left: '40px', right: '40px', borderTop: `1px solid ${colors.slate100}`, paddingTop: '24px', textAlign: 'center', opacity: 0.3 }}>
         <p style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Automated Waybill Hub v5.0 // © Tunshpresh Global Logistics</p>
      </div>
    </div>
  );
});

export default WaybillSnapshot;
