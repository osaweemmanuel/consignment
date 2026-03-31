import React from 'react';
import { ShieldCheck, Anchor } from 'lucide-react';
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
    slate900: '#0f172a',
    emerald50: '#f0fdf4',
    emerald500: '#10b981'
};

const ClearanceCertificate = React.forwardRef(({ data, trackingNumber }, ref) => {
  if (!data) return null;
  const issueDate = new Date().toLocaleDateString();

  const freightValue = Number(data.freight_charge) || 0;
  const insuranceValue = Number(data.insurance_fee) || 0;
  const taxValue = Number(data.tax_due) || 0;
  const totalValue = freightValue + insuranceValue + taxValue;

  return (
    <div 
      ref={ref} 
      style={{ width: '790px', minHeight: '1120px', padding: '40px', backgroundColor: colors.slate50, color: colors.slate900, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <ShieldCheck size={500} color={colors.slate900} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${colors.slate900}`, paddingBottom: '24px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `3px solid ${colors.slate900}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Anchor size={28} color={colors.slate900} />
            </div>
            <div>
               <h1 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: colors.slate900, margin: 0 }}>Border Authorities</h1>
               <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.4em', color: colors.slate500, textTransform: 'uppercase', marginTop: '2px' }}>Official Customs Declaration</h2>
            </div>
         </div>
         <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400, marginBottom: '2px' }}>Form C-88/4</div>
             <div style={{ padding: '6px 12px', border: `2px solid ${colors.slate900}`, display: 'inline-block', fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, backgroundColor: colors.white }}>
                 CERT-{(trackingNumber || '0000').slice(-6)}
             </div>
         </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: colors.slate900, borderTop: `2px solid ${colors.slate200}`, borderBottom: `2px solid ${colors.slate200}`, padding: '12px 32px', display: 'inline-block' }}>
              CERTIFICATE OF CLEARANCE
          </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <div style={{ backgroundColor: colors.white, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '4px' }}>
             <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '12px', borderBottom: `1px solid ${colors.slate100}`, paddingBottom: '6px' }}>Consignee Details</span>
             <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px', margin: 0 }}>{data.receiverName}</h3>
             <p style={{ fontSize: '11px', fontWeight: 500, color: colors.slate600, fontFamily: 'monospace', margin: 0 }}>DEST: {data.destination}</p>
         </div>
         
         <div style={{ backgroundColor: colors.white, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '4px' }}>Reg ID</span>
                <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', marginBottom: '8px' }}>{trackingNumber}</div>
                <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '4px' }}>Issue Date</span>
                <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: colors.slate900 }}>{issueDate}</div>
             </div>
             <div style={{ padding: '6px', backgroundColor: colors.slate100, border: `1px solid ${colors.slate200}` }}>
                <QRCodeSVG value={`CLEARED: ${trackingNumber}`} size={60} level="M" fgColor={colors.slate900} bgColor={colors.white} />
             </div>
         </div>
      </div>

      <div style={{ marginBottom: '48px', position: 'relative', zIndex: 10 }}>
         <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '12px' }}>Tariff Liquidation</span>
         <table style={{ width: '100%', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', borderCollapse: 'collapse', backgroundColor: colors.white }}>
            <thead>
                <tr style={{ backgroundColor: colors.slate900, color: colors.white }}>
                    <th style={{ padding: '12px', border: `1px solid ${colors.slate900}`, fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>DESCRIPTION</th>
                    <th style={{ padding: '12px', border: `1px solid ${colors.slate900}`, fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>CODE</th>
                    <th style={{ padding: '12px', border: `1px solid ${colors.slate900}`, fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>VALUE</th>
                </tr>
            </thead>
            <tbody>
                {[
                    { desc: "Transit Operations & Handling", code: "OP-401", val: freightValue },
                    { desc: "Cargo Security Indemnity", code: "IN-892", val: insuranceValue },
                    { desc: "Import Duties & Regional Tax", code: "TX-910", val: taxValue }
                ].map((item, i) => (
                    <tr key={i}>
                        <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, color: colors.slate700 }}>{item.desc}</td>
                        <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, color: colors.slate500 }}>{item.code}</td>
                        <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, textAlign: 'right', fontWeight: 700 }}>${item.val.toFixed(2)}</td>
                    </tr>
                ))}
                <tr style={{ backgroundColor: colors.slate100 }}>
                    <td colSpan="2" style={{ padding: '12px', border: `1px solid ${colors.slate200}`, textAlign: 'right', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate900 }}>Total Remitted</td>
                    <td style={{ padding: '12px', border: `1px solid ${colors.slate200}`, textAlign: 'right', fontSize: '18px', fontWeight: 900, color: colors.slate900 }}>${totalValue.toFixed(2)}</td>
                </tr>
            </tbody>
         </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 10, marginTop: '64px' }}>
         <div style={{ width: '33%', textAlign: 'center' }}>
            <div style={{ borderBottom: `1px solid ${colors.slate300}`, paddingBottom: '6px', marginBottom: '6px', color: colors.slate900, fontSize: '24px', fontStyle: 'italic', fontWeight: 500 }}>Verified Cleared</div>
            <div style={{ fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate500 }}>Authorizing Officer Signature</div>
         </div>
         
         <div style={{ transform: 'rotate(-12deg)', backgroundColor: 'white', padding: '12px', border: '6px solid #0f172a', borderRadius: '50%', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
             <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: colors.slate900 }}>CUSTOMS<br/>CLEARED</span>
         </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: '32px', left: '40px', right: '40px', textAlign: 'center', borderTop: `1px solid ${colors.slate200}`, paddingTop: '16px' }}>
         <p style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400, fontWeight: 700, maxWidth: '500px', margin: '0 auto', lineHeight: 1.4 }}>
             Verification of statutory compliance. Consignment unbound from customs holding. No erasure or alteration permitted.
         </p>
      </div>

    </div>
  );
});

export default ClearanceCertificate;
