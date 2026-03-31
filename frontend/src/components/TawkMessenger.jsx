import { useEffect } from 'react';

const TawkMessenger = () => {
    useEffect(() => {
        // Prevent manual re-injection if already exists
        if (window.Tawk_API) return;

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const s1 = document.createElement("script");
        s1.async = true;
        s1.src = 'https://embed.tawk.to/67bcd4ad199fe71913c453be/1iksptheg';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        
        document.head.appendChild(s1);

        // Optional: Clean up on unmount if needed, but usually Tawk.to remains
    }, []);

    return null; // Side-effect only component
};

export default TawkMessenger;
