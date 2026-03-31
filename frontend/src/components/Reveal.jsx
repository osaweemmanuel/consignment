import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0, yOffset = 40, width = "100%" }) => {
    return (
        <div style={{ width, overflow: "hidden" }}>
            <motion.div
                initial={{ opacity: 0, y: yOffset }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Reveal;
