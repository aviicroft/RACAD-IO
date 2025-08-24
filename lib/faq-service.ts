import faqData from '../rathinam_faq_mega_340.json';
import webFaqData from '../datas/web-faq.json';

export interface FAQItem {
  question: string;
  answer: string;
  link: string;
  category: string;
  score?: number;
}

export class FAQService {
  private static instance: FAQService;
  private faqs: FAQItem[] = [];
  private searchIndex: Map<string, FAQItem[]> = new Map();

  private constructor() {
    try {
      this.loadFAQs();
      this.buildSearchIndex();
    } catch (error) {
      console.error('Error initializing FAQ service:', error);
      this.faqs = [];
    }
  }

  public static getInstance(): FAQService {
    if (!FAQService.instance) {
      FAQService.instance = new FAQService();
    }
    return FAQService.instance;
  }

  private loadFAQs() {
    try {
      // Load main FAQ data
      const mainFAQs = faqData as FAQItem[];
      
      // Load web FAQ data and add default category
      const webFAQs = (webFaqData as FAQItem[]).map(faq => ({
        ...faq,
        category: faq.category || 'General Information'
      }));
      
      // Combine both FAQ sources
      this.faqs = [...mainFAQs, ...webFAQs];
      
      console.log(`Loaded ${mainFAQs.length} main FAQs and ${webFAQs.length} web FAQs successfully`);
      console.log(`Total FAQs: ${this.faqs.length}`);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      this.faqs = [];
    }
  }

  private buildSearchIndex() {
    if (this.faqs.length === 0) return;
    
    // Create a search index for faster lookups
    this.faqs.forEach(faq => {
      // Index by category
      if (!this.searchIndex.has(faq.category)) {
        this.searchIndex.set(faq.category, []);
      }
      this.searchIndex.get(faq.category)!.push(faq);

      // Index by keywords in question
      const keywords = this.extractKeywords(faq.question);
      keywords.forEach(keyword => {
        if (!this.searchIndex.has(keyword)) {
          this.searchIndex.set(keyword, []);
        }
        this.searchIndex.get(keyword)!.push(faq);
      });
    });
    
    console.log(`Built search index with ${this.searchIndex.size} entries`);
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Only words longer than 3 characters
    
    return [...new Set(words)]; // Remove duplicates
  }

  public getAllFAQs(): FAQItem[] {
    return [...this.faqs];
  }

  public getFAQsByCategory(category: string): FAQItem[] {
    return this.searchIndex.get(category) || [];
  }

  public getCategories(): string[] {
    return [...new Set(this.faqs.map(faq => faq.category))];
  }

  public searchFAQs(query: string): FAQItem[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (normalizedQuery.length < 3) {
      return [];
    }

    const results: FAQItem[] = [];
    const queryWords = normalizedQuery.split(/\s+/);

    this.faqs.forEach(faq => {
      let score = 0;
      const questionLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();
      const categoryLower = faq.category.toLowerCase();

      // Exact matches get higher scores
      if (questionLower.includes(normalizedQuery)) {
        score += 10;
      }
      if (answerLower.includes(normalizedQuery)) {
        score += 5;
      }
      if (categoryLower.includes(normalizedQuery)) {
        score += 3;
      }

      // Partial word matches
      queryWords.forEach(word => {
        if (questionLower.includes(word)) {
          score += 2;
        }
        if (answerLower.includes(word)) {
          score += 1;
        }
      });

      if (score > 0) {
        results.push({ ...faq, score });
      }
    });

    // Sort by relevance score (highest first)
    return results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  public findBestMatch(query: string): FAQItem | null {
    const results = this.searchFAQs(query);
    return results.length > 0 ? results[0] : null;
  }

  public getRandomFAQ(): FAQItem {
    if (this.faqs.length === 0) {
      throw new Error('No FAQs available');
    }
    const randomIndex = Math.floor(Math.random() * this.faqs.length);
    return this.faqs[randomIndex];
  }

  public getFAQsByPopularTopics(): FAQItem[] {
    const popularTopics = [
      'Admissions',
      'Programs & Departments',
      'Fees & Financial Aid',
      'Facilities & Campus Life',
      'General Information'
    ];

    const popularFAQs: FAQItem[] = [];
    popularTopics.forEach(topic => {
      const topicFAQs = this.getFAQsByCategory(topic);
      if (topicFAQs.length > 0) {
        popularFAQs.push(topicFAQs[0]); // Get first FAQ from each popular topic
      }
    });

    return popularFAQs;
  }

  public getTotalFAQCount(): number {
    return this.faqs.length;
  }

  public getCategoryStats(): { category: string; count: number }[] {
    const stats = new Map<string, number>();
    
    this.faqs.forEach(faq => {
      const current = stats.get(faq.category) || 0;
      stats.set(faq.category, current + 1);
    });

    return Array.from(stats.entries()).map(([category, count]) => ({
      category,
      count
    }));
  }

  public isServiceReady(): boolean {
    return this.faqs.length > 0;
  }
}

export default FAQService;
