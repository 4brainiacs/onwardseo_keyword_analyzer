import React from 'react';
import type { PageStructureProps } from '../../types';

export function PageStructure({ title, metaDescription, headings }: PageStructureProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Page Structure</h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Title Tag</h3>
          <p className="mt-1 text-gray-600">{title}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Meta Description</h3>
          <p className="mt-1 text-gray-600">
            {metaDescription || 'No meta description found'}
          </p>
        </div>

        {Object.entries(headings).map(([type, headingList]) => (
          <div key={type} className="space-y-2">
            {headingList.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-gray-900">
                  {type.toUpperCase()} Tags ({headingList.length})
                </h3>
                <ul className="mt-1 list-disc list-inside text-gray-600">
                  {headingList.map((heading, index) => (
                    <li key={index}>{heading}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}