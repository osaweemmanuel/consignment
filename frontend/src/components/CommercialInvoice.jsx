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
    slate700: '#334155',
    slate900: '#0f172a',
    primary: '#7c3aed', // Institutional Violet
    green50: '#f0fdf4',
    green500: '#10b981',
    emerald100: '#d1fae5',
    emerald500: '#10b981'
};

const CommercialInvoice = React.forwardRef(({ data, trackingNumber }, ref) => {
  if (!data) return null;
  const issueDate = new Date().toLocaleDateString();
  
  const freightValue = Number(data.freight_charge) || 0;
  const insuranceValue = Number(data.insurance_fee) || 0;
  const taxValue = Number(data.tax_due) || 0;
  const totalValueValue = freightValue + insuranceValue + taxValue;

  return (
    <div 
      ref={ref} 
      style={{ width: '790px', minHeight: '1120px', padding: '40px', backgroundColor: colors.white, color: colors.slate900, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.02, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <Globe size={500} color={colors.slate900} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', position: 'relative', zIndex: 10, borderBottom: `3px solid ${colors.slate900}`, paddingBottom: '24px' }}>
        <div>
           <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', color: colors.slate900, margin: 0 }}>COMMERCIAL INVOICE</h1>
           <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: colors.slate500, display: 'block', marginTop: '6px' }}>LOGISTICS FINANCIAL LEDGER</span>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400, marginBottom: '2px' }}>Invoice ID</div>
           <div style={{ padding: '6px 12px', border: `2px solid ${colors.slate900}`, display: 'inline-block', fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, backgroundColor: colors.slate50 }}>
               INV-{(trackingNumber || '0000').slice(-6)}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
          <div style={{ backgroundColor: colors.white, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '12px' }}>
              <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '12px', borderBottom: `1px solid ${colors.slate200}`, paddingBottom: '6px' }}>Shipper (Consignor)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px', margin: 0 }}>{data.senderName}</h3>
              <p style={{ fontSize: '10px', fontWeight: 500, color: colors.slate600, fontFamily: 'monospace', margin: 0 }}>EMAIL: {data.senderEmail || 'N/A'}</p>
          </div>
          <div style={{ backgroundColor: colors.slate50, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '12px' }}>
              <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '12px', borderBottom: `1px solid ${colors.slate200}`, paddingBottom: '6px' }}>Billed To (Consignee)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px', margin: 0 }}>{data.receiverName}</h3>
              <p style={{ fontSize: '10px', fontWeight: 500, color: colors.slate600, fontFamily: 'monospace', marginBottom: '2px', margin: 0 }}>EMAIL: {data.receiverEmail}</p>
              <p style={{ fontSize: '10px', fontWeight: 500, color: colors.slate600, fontFamily: 'monospace', margin: 0 }}>DEST: {data.destination}</p>
          </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
          <div style={{ backgroundColor: colors.white, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '4px' }}>Tracking</span>
                <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', marginBottom: '12px', color: colors.slate900 }}>{trackingNumber}</div>
                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '4px' }}>Issue Date</span>
                <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: colors.slate900 }}>{issueDate}</div>
             </div>
             <div style={{ padding: '6px', border: `1px solid ${colors.slate200}`, backgroundColor: colors.slate50, borderRadius: '8px' }}>
                <QRCodeSVG value={`INV: ${trackingNumber} | $${totalValueValue.toFixed(2)}`} size={60} level="M" fgColor={colors.slate900} bgColor={colors.white} />
             </div>
         </div>
      </div>

      <div style={{ marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: colors.slate400, display: 'block', marginBottom: '12px' }}>Itemized Liquidation Matrix</span>
         <table style={{ width: '100%', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', borderCollapse: 'collapse', backgroundColor: colors.white, border: `1px solid ${colors.slate900}` }}>
            <thead>
                <tr style={{ backgroundColor: colors.slate900, color: colors.white }}>
                    <th style={{ padding: '12px', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', width: '40px', textAlign: 'center', borderRight: `1px solid ${colors.slate700}` }}>QTY</th>
                    <th style={{ padding: '12px', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', borderRight: `1px solid ${colors.slate700}` }}>Service Description</th>
                    <th style={{ padding: '12px', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Net Value</th>
                </tr>
            </thead>
            <tbody>
                {[
                    { desc: "Freight Carriage & Global Dispatch", val: freightValue },
                    { desc: "Asset Insurance & Transit Security", val: insuranceValue },
                    { desc: "Regional Duties, Taxes, & VAT", val: taxValue }
                ].map((item, i) => (
                    <tr key={i}>
                        <td style={{ padding: '12px', textAlign: 'center', border: `1px solid ${colors.slate200}`, fontWeight: 700, color: colors.slate500 }}>1</td>
                        <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, color: colors.slate900, fontWeight: 700, textTransform: 'uppercase' }}>{item.desc}</td>
                        <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, textAlign: 'right', fontWeight: 900 }}>${item.val.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr style={{ backgroundColor: colors.slate50 }}>
                    <td colSpan="2" style={{ padding: '16px', border: `1px solid ${colors.slate300}`, textAlign: 'right', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400 }}>Gross Valuation (USD)</td>
                    <td style={{ padding: '16px', border: `1px solid ${colors.slate300}`, textAlign: 'right', fontSize: '24px', fontWeight: 900, color: colors.slate900 }}>${totalValueValue.toFixed(2)}</td>
                </tr>
            </tfoot>
         </table>
      </div>

      <div style={{ position: 'absolute', bottom: '32px', left: '40px', right: '40px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ 
             padding: '8px 32px', 
             borderRadius: '9999px', 
             fontWeight: 900, 
             textTransform: 'uppercase', 
             letterSpacing: '0.3em', 
             fontSize: '11px', 
             border: '2px solid',
             backgroundColor: data.payment_status?.toLowerCase() === 'paid' ? colors.white : colors.slate50,
             borderColor: data.payment_status?.toLowerCase() === 'paid' ? colors.emerald500 : colors.slate900,
             color: data.payment_status?.toLowerCase() === 'paid' ? colors.emerald500 : colors.slate900
         }}>
             LEDGER STATUS: {data.payment_status?.toUpperCase() || 'PENDING'}
         </div>
         <p style={{ marginTop: '24px', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400, fontWeight: 700, maxWidth: '500px', textAlign: 'center', lineHeight: 1.4 }}>
             Please remit payment to clear listed balances. Access live digital tracking for settlement details.
         </p>
      </div>

    </div>
  );
});

export default CommercialInvoice;
