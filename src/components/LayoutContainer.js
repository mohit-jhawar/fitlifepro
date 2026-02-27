import React from 'react';

/**
 * LayoutContainer — global page container.
 * max-w-7xl (1280px), mx-auto, px-6 mobile / lg:px-8 desktop, py-10
 */
const LayoutContainer = ({ children, className = '' }) => (
    <div className={`max-w-7xl mx-auto px-6 lg:px-8 py-10 ${className}`}>
        {children}
    </div>
);

export default LayoutContainer;
