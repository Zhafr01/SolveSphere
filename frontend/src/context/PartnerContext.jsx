import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/api';

const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
    const [currentPartner, setCurrentPartner] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract slug from URL pattern /partners/:slug...
        const match = location.pathname.match(/^\/partners\/([^\/]+)/);
        const slug = match ? match[1] : null;

        if (slug) {
            // Only fetch if we don't have a partner or it's a different one
            if (!currentPartner || currentPartner.slug !== slug) {
                api.get(`/partners/${slug}`).then(({ data }) => {
                    setCurrentPartner(data.partner);
                }).catch(err => {
                    console.error("Failed to sync partner context", err);
                    setCurrentPartner(null);
                });
            }
        } else {
            // If we are not in a partner route, clear the context
            if (currentPartner) {
                setCurrentPartner(null);
            }
        }
    }, [location.pathname]);

    return (
        <PartnerContext.Provider value={{ currentPartner, setCurrentPartner }}>
            {children}
        </PartnerContext.Provider>
    );
};

export const usePartner = () => useContext(PartnerContext);
