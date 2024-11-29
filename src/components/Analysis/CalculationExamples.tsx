import { Star } from 'lucide-react';

export function CalculationExamples() {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-900">Density Calculation Example</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            For a phrase appearing 12 times in a 1000-word text:<br />
            Density = Occurrences / (Total Words - Phrase Length + 1)<br />
            = 12 / (1000 - 2 + 1)<br />
            = 12 / 999<br />
            ≈ 0.012 or 1.2%
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-900">onwardSEO Prominence Score Calculation Example</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            For a phrase found in title, H1, and at word position 100 of 1000:<br />
            Position Score = 0.9 × (1 - 100/1000) = 0.81<br />
            Title (2.0) + H1 (1.5) + Position (0.81) = 4.31<br />
            Final Score = 4.31 / 7.4 ≈ 0.58 or 58%<br />
            Max possible: (T:2.0 + H1:1.5 + H2:1.2 + H3:1.0 + H4:0.8 + Pos:0.9) / 7.4 = 100%
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What is onwardSEO Prominence Score?
        </h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p className="mb-4">
            The onwardSEO Prominence Score is a proprietary metric that measures the prominence and relevance of a specific keyword or phrase within a webpage's content. The score evaluates the keyword's strategic placement and calculates its contribution to SEO performance based on the following weighted factors:
          </p>
          
          <h4 className="font-medium text-gray-800 mt-4 mb-2">HTML Element Weighting:</h4>
          <p className="mb-4">
            Keywords found in key structural elements like the title (2.0 weight), H1 (1.5 weight), H2 (1.2 weight), H3 (1.0 weight), and H4 (0.8 weight) are assigned corresponding scores to reflect their importance in SEO.
          </p>

          <h4 className="font-medium text-gray-800 mt-4 mb-2">Position Score:</h4>
          <p className="mb-4">
            Keywords' positional relevance within the content is quantified using the formula:
          </p>
          <div className="bg-white p-4 rounded-md mb-4 font-mono text-sm">
            Position Score = 0.9 × (1 - word position / total words)
          </div>
          <p className="mb-4">
            This factor prioritizes keywords appearing earlier in the content, which is generally more impactful for SEO.
          </p>

          <h4 className="font-medium text-gray-800 mt-4 mb-2">Final Score Calculation:</h4>
          <p className="mb-4">
            The weighted scores from the title, headings, and position are summed and normalized against the maximum possible score (7.4) to yield a percentage-based score.
          </p>

          <p className="mt-4 text-gray-700 font-medium">
            The onwardSEO Prominence Score provides a standardized way to assess how effectively a keyword or phrase is integrated into a webpage to maximize visibility and search engine relevance.
          </p>
        </div>
      </div>
    </div>
  );
}