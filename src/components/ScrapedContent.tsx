interface ScrapedContentProps {
  content: string;
}

export function ScrapedContent({ content }: ScrapedContentProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Page Content</h2>
      </div>
      <div className="px-6 py-4">
        <div className="max-h-96 overflow-y-auto prose prose-sm">
          {content}
        </div>
      </div>
    </div>
  );
}