import React from 'react';

/**
 * PageHeader — standardized page title + subtitle block.
 * Usage: <PageHeader icon={<Icon />} iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
 *           title="Page Title" subtitle="Subtitle text" />
 */
const PageHeader = ({ icon, iconBg = 'bg-gradient-to-br from-purple-500 to-pink-500', title, subtitle, children }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
            {icon && (
                <div className={`${iconBg} p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg`}>
                    {icon}
                </div>
            )}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
        {children}
    </div>
);

export default PageHeader;
