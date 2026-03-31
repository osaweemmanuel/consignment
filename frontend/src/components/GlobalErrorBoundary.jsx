import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical System Catch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#0f172a',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>System Interrupt</h1>
            <p style={{ maxWidth: '500px', opacity: 0.8, lineHeight: 1.6, marginBottom: '30px' }}>
                The terminal encountered a non-recoverable render error. 
                Our neural command nodes have been informed.
            </p>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'left', wordBreak: 'break-all', maxWidth: '80%' }}>
                <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>CRITICAL FAULT:</span>
                <code style={{ fontSize: '0.9rem', opacity: 0.7 }}>{this.state.error ? this.state.error.toString() : 'NO_TELEMETRY'}</code>
            </div>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    padding: '15px 40px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
            >
                RE-ESTABLISH LINK
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
