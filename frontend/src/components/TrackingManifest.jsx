import React from 'react';
import { Globe, Shield } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const TrackingManifest = React.forwardRef(({ data, history, trackingNumber }, ref) => {
   if (!data) return null;

   // ELITE LEGACY HEX PALETTE (Bypasses oklch errors)
   const colors = {
     white: '#ffffff',
     slate50: '#f8fafc',
     slate100: '#f1f5f9',
     slate200: '#e2e8f0',
     slate300: '#cbd5e1',
     slate400: '#94a3b8',
     slate500: '#64748b',
     slate700: '#334155',
     slate900: '#0f172a',
     primary: '#0f172a', // Keeping it deep corporate
     rose600: '#e11d48',
     emerald500: '#10b981'
   };

   return (
    <div ref={ref} style={{ width: '790px', minHeight: '1120px', padding: '40px', backgroundColor: colors.white, color: colors.slate900, fontFamily: 'sans-serif', position: 'relative', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Institutional Watermark */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <Globe size={500} color={colors.slate900} />
        </div>
        
        {/* Refined Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `3px solid ${colors.slate900}`, paddingBottom: '24px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Shield size={20} color={colors.slate900} />
                    <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: colors.slate500 }}>Global Transit Network</span>
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: colors.slate900, margin: 0 }}>Chain of Custody Log</h1>
                <p style={{ fontSize: '10px', fontWeight: 700, color: colors.slate500, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>Official Location Transit Manifest</p>
            </div>
            <div style={{ textAlign: 'right', minWidth: '200px' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Terminal ID</div>
                <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace' }}>TRK-{trackingNumber}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: colors.slate500, marginTop: '4px', textTransform: 'uppercase', backgroundColor: colors.slate100, padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                    LOGGED: {new Date().toLocaleString()}
                </div>
            </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
             <div style={{ backgroundColor: colors.slate50, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '12px' }}>
                 <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '6px' }}>Subject Asset</span>
                 <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', color: colors.slate900, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.parcelName || 'Secured Cargo'}</h3>
                 <p style={{ fontSize: '12px', fontWeight: 500, color: colors.slate600, marginTop: '4px' }}>Unit Mass: {data.weight} KG</p>
             </div>
             <div style={{ backgroundColor: colors.slate50, padding: '20px', border: `1px solid ${colors.slate200}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '6px' }}>Target Destination</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', color: colors.slate900, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.destination}</h3>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: colors.slate600, marginTop: '4px' }}>Consignee: {data.receiverName}</p>
                 </div>
                 <div style={{ marginLeft: '12px', padding: '4px', border: `1px solid ${colors.slate200}`, backgroundColor: colors.white, borderRadius: '6px' }}>
                    <QRCodeSVG value={`SCAN:${trackingNumber}`} size={40} level="M" fgColor={colors.slate900} bgColor={colors.white} />
                 </div>
             </div>
        </div>
        
        {/* Digital Asset Matrix & Description */}
        <div style={{ marginBottom: '32px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) 2fr', gap: '20px' }}>
                {/* Textual Description */}
                <div style={{ backgroundColor: colors.slate50, padding: '16px', borderRadius: '8px', border: `1px solid ${colors.slate200}` }}>
                    <span style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '8px' }}>Detailed Item Manifest</span>
                    <p style={{ fontSize: '10px', fontWeight: 600, color: colors.slate600, margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                        {data.description || "The consignor has documented this cargo as part of a secured transit manifest without additional itemization nodes."}
                    </p>
                </div>

                {/* Images */}
                {data.images && data.images.length > 0 && (
                    <div>
                        <span style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, display: 'block', marginBottom: '8px' }}>Verified Cargo Assets</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {data.images.slice(0, 8).map((img, i) => (
                                <div key={i} style={{ height: '70px', border: `1px solid ${colors.slate200}`, borderRadius: '6px', overflow: 'hidden', backgroundColor: colors.slate50 }}>
                                    <img src={img} alt="Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Transit Matrix Table */}
        <div style={{ border: `1px solid ${colors.slate300}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '32px', position: 'relative', zIndex: 10, backgroundColor: colors.white }}>
            <table style={{ width: '100%', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: colors.slate900, color: colors.white }}>
                        <th style={{ padding: '12px 16px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, width: '160px' }}>Timestamp [UTC]</th>
                        <th style={{ padding: '12px 16px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900 }}>Logged Terminal Node</th>
                        <th style={{ padding: '12px 16px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, width: '120px' }}>State Matrix</th>
                    </tr>
                </thead>
                <tbody>
                    {history && history.length > 0 ? (
                        [...history].reverse().map((record, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.slate50, borderTop: `1px solid ${colors.slate200}` }}>
                                <td style={{ padding: '12px 16px', color: colors.slate500, fontSize: '10px' }}>
                                    {new Date(record.updatedAt).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'})}
                                </td>
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: colors.slate900 }}>
                                    {record.currentLocation.toUpperCase() || 'UNKNOWN NODE'}
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: record.status==='impounded' ? colors.rose600 : record.status==='delivered' ? colors.emerald500 : colors.slate900 }}>
                                    {record.status || 'ACTIVE'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px', fontWeight: 900, color: colors.slate400 }}>Synchronization Pending...</td></tr>
                    )}
                </tbody>
            </table>
        </div>
          
        {/* Footer Authorization Section */}
        <div style={{ marginTop: 'auto', borderTop: `1px solid ${colors.slate200}`, paddingTop: '24px', position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ flex: 1 }}>
                <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: colors.slate400, margin: 0 }}>
                    End of Verified Digital Logging Manifest.
                </p>
                <p style={{ fontSize: '8px', color: colors.slate300, textTransform: 'uppercase', marginTop: '4px' }}>Secure Electronic Route Validated // System ID v.4.01</p>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ width: '120px', height: '1px', backgroundColor: colors.slate300, marginBottom: '8px' }}></div>
                <span style={{ fontSize: '8px', fontStyle: 'italic', color: colors.slate500 }}>Digital Signature Authority</span>
             </div>
        </div>
    </div>
   );
});

export default TrackingManifest;
