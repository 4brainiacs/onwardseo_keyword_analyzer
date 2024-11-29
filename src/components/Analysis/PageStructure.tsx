import type { PageHeadings } from '../../types';
import type { Classification } from '../../types/classification';

interface PageStructureProps {
  title: string;
  metaDescription?: string;
  classification?: Classification;
  headings: PageHeadings;
}

export function PageStructure({ title, metaDescription, classification, headings }: PageStructureProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Page Structure</h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        {classification?.primaryCategory && (
          <div>
            <h3 className="text-lg font-medium text-gray-900">Content Classification</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <span className="text-gray-600">Primary Category:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {classification.primaryCategory.name}
                  <span className="ml-2 text-sm text-gray-500">
                    ({(classification.primaryCategory.confidence * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
              {classification?.secondaryCategories && classification.secondaryCategories.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span>Related Categories: </span>
                  {classification.secondaryCategories.map((cat: { name: string; confidence: number }, idx: number) => (
                    <span key={cat.name}>
                      {cat.name} ({(cat.confidence * 100).toFixed(1)}%)
                      {idx < (classification.secondaryCategories?.length || 0) - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
                  {headingList.map((heading: string, index: number) => (
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