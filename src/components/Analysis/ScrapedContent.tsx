interface ScrapedContentProps {
  content: string;
}

export function ScrapedContent({ content }: ScrapedContentProps) {
  const cleanContent = content
    .replace(/\/\* \<\!\[CDATA\[ \*\/|\<\!\[CDATA\[ \*\/|\<\!\[CDATA\[|\]\]\>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Page Content</h2>
      </div>
      <div className="px-6 py-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{cleanContent}</p>
        </div>
      </div>
    </div>
  );
}