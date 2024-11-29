export interface ContentCategory {
  name: string;
  confidence: number;
  keywords: string[];
}

export interface Classification {
  primaryCategory: ContentCategory;
  secondaryCategories: ContentCategory[];
}