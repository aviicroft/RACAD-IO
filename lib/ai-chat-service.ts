import FAQService, { FAQItem } from './faq-service';
import { programService, departments } from './services/program-service'

interface UserIntent {
  type: string;
  keywords: string[];
  sentiment: string;
}

interface ConversationContext {
  topic: string;
  mood: string;
  depth: string;
}

export interface ChatResponse {
  answer: string;
  confidence: number;
  source: 'ai_generated' | 'faq_enhanced' | 'conversational' | 'creative' | 'fallback';
  relatedFAQs?: FAQItem[];
  category?: string;
  link?: string;
  reasoning?: string;
}

export class AIChatService {
  private static instance: AIChatService;
  private faqService: FAQService;
  private conversationContext: string[] = [];
  // Track recently shown related questions to avoid repetition
  private recentlyShownQuestions: Set<string> = new Set();
  private questionRotationIndex: Map<string, number> = new Map();

  private constructor() {
    this.faqService = FAQService.getInstance();
  }

  public static getInstance(): AIChatService {
    if (!AIChatService.instance) {
      AIChatService.instance = new AIChatService();
    }
    return AIChatService.instance;
  }

  public async processMessage(userMessage: string): Promise<ChatResponse> {
    // Update conversation context
    this.updateConversationContext(userMessage);
    
    // Clean and normalize the user message
    const normalizedMessage = this.normalizeMessage(userMessage);
    
    // Check for conversational/introductory messages first
    const conversationalResponse = this.handleConversationalMessage(normalizedMessage);
    if (conversationalResponse) {
      return conversationalResponse;
    }

    // Try to understand the user's intent and generate intelligent response
    const aiResponse = this.generateIntelligentResponse(userMessage, normalizedMessage);
    if (aiResponse) {
      return aiResponse;
    }

    // Fallback to enhanced FAQ response
    return this.createEnhancedFAQResponse(userMessage);
  }

  // Public method to reset question rotation (useful for testing or manual reset)
  public resetQuestionRotation(): void {
    this.recentlyShownQuestions.clear();
    this.questionRotationIndex.clear();
  }

  private updateConversationContext(message: string): void {
    this.conversationContext.push(message);
    // Keep only last 5 messages for context
    if (this.conversationContext.length > 5) {
      this.conversationContext.shift();
    }
  }

  private normalizeMessage(message: string): string {
    return message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private handleConversationalMessage(message: string): ChatResponse | null {
    const conversationalPatterns = [
      {
        patterns: ['hello', 'hi', 'hey'],
        response: "Hello! I'm RACAD IO, your AI assistant for Rathinam College of Arts and Science. I'm here to help you with information about our programs, admissions, campus life, and more. How can I assist you today?"
      },
      {
        patterns: ['who are you', 'what are you', 'tell me about yourself', 'introduce yourself'],
        response: "I'm RACAD IO, an AI-powered chatbot designed specifically for Rathinam College of Arts and Science. I can help you with:\n\n• Academic programs and courses\n• Admission procedures and requirements\n• Campus facilities and student life\n• Faculty information and research\n• Fees, scholarships, and financial aid\n• And much more!\n\nI'm here to make your college experience easier by providing quick, accurate information. What would you like to know?"
      },
      {
        patterns: ['how are you', 'how do you do'],
        response: "I'm functioning perfectly and ready to help you with all your questions about Rathinam College! What information are you looking for today?"
      },
      {
        patterns: ['thank you', 'thanks', 'thx'],
        response: "You're welcome! I'm happy to help. Is there anything else you'd like to know about Rathinam College?"
      },
      {
        patterns: ['bye', 'goodbye', 'see you', 'good night'],
        response: "Goodbye! Feel free to come back anytime if you have more questions about Rathinam College. Have a great day!"
      },
      {
        patterns: ['help', 'what can you do', 'capabilities', 'features'],
        response: "I'm RACAD IO, your comprehensive guide to Rathinam College! Here's what I can help you with:\n\n📚 **Academic Information**: Programs, courses, curriculum, faculty\n🎓 **Admissions**: Application process, requirements, deadlines\n💰 **Financial**: Fees, scholarships, payment options\n🏫 **Campus Life**: Facilities, clubs, events, student activities\n📞 **Contact**: Department contacts, office locations\n\nJust ask me anything specific, and I'll provide detailed information. What would you like to explore?"
      }
    ];

    // More precise matching - only exact matches for conversational patterns
    for (const pattern of conversationalPatterns) {
      const messageWords = message.toLowerCase().split(/\s+/);
      const hasExactMatch = pattern.patterns.some(p => {
        const patternWords = p.toLowerCase().split(/\s+/);
        return patternWords.every(word => messageWords.includes(word));
      });
      
      if (hasExactMatch) {
        return {
          answer: pattern.response,
          confidence: 0.95,
          source: 'conversational',
          relatedFAQs: this.faqService.getFAQsByPopularTopics().slice(0, 3)
        };
      }
    }

    return null;
  }

  private generateIntelligentResponse(userMessage: string, normalizedMessage: string): ChatResponse | null {
    // Analyze user intent and generate contextual responses
    const intent = this.analyzeUserIntent(userMessage);
    const context = this.analyzeConversationContext();
    
    // Check for general program overview questions first
    if (this.isGeneralProgramOverviewQuestion(userMessage)) {
      return this.generateGeneralProgramOverview();
    }
    
    // Generate creative, AI-like responses based on intent and context
    switch (intent.type) {
      case 'program_specific':
        return this.generateProgramSpecificResponse(userMessage, intent, context);
      
      case 'academic_advice':
        return this.generateAcademicAdvice(userMessage, intent, context);
      
      case 'campus_life':
        return this.generateCampusLifeResponse(userMessage, intent, context);
      
      case 'career_guidance':
        return this.generateCareerGuidance(userMessage, intent, context);
      
      case 'comparison':
        return this.generateComparisonResponse(userMessage, intent, context);
      
      case 'personalized':
        return this.generatePersonalizedResponse(userMessage, intent, context);
      
      case 'creative':
        return this.generateCreativeResponse(userMessage, intent, context);
      
      default:
        return null;
    }
  }

  private analyzeUserIntent(message: string): UserIntent {
    const lowerMessage = message.toLowerCase();
    const keywords = this.extractKeywords(message);
    
    // Program-specific intent detection (highest priority)
    if (this.isProgramSpecificQuestion(lowerMessage)) {
      return { type: 'program_specific', keywords, sentiment: 'curious' };
    }
    
    // Academic intent detection
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('course') || 
        lowerMessage.includes('program') || lowerMessage.includes('curriculum') || lowerMessage.includes('syllabus')) {
      return { type: 'academic_advice', keywords, sentiment: 'curious' };
    }
    
    // Campus life intent
    if (lowerMessage.includes('campus') || lowerMessage.includes('facility') || lowerMessage.includes('club') || 
        lowerMessage.includes('event') || lowerMessage.includes('activity') || lowerMessage.includes('student life')) {
      return { type: 'campus_life', keywords, sentiment: 'interested' };
    }
    
    // Career guidance intent
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('future') || 
        lowerMessage.includes('placement') || lowerMessage.includes('opportunity') || lowerMessage.includes('profession')) {
      return { type: 'career_guidance', keywords, sentiment: 'concerned' };
    }
    
    // Comparison intent
    if (lowerMessage.includes('vs') || lowerMessage.includes('compare') || lowerMessage.includes('difference') || 
        lowerMessage.includes('better') || lowerMessage.includes('which') || lowerMessage.includes('versus')) {
      return { type: 'comparison', keywords, sentiment: 'analytical' };
    }
    
    // Personalized intent
    if (lowerMessage.includes('my') || lowerMessage.includes('i want') || lowerMessage.includes('i need') || 
        lowerMessage.includes('help me') || lowerMessage.includes('advice')) {
      return { type: 'personalized', keywords, sentiment: 'personal' };
    }
    
    // Creative/exploratory intent
    if (lowerMessage.includes('imagine') || lowerMessage.includes('what if') || lowerMessage.includes('suppose') || 
        lowerMessage.includes('creative') || lowerMessage.includes('interesting') || lowerMessage.includes('unique')) {
      return { type: 'creative', keywords, sentiment: 'exploratory' };
    }
    
    return { type: 'general', keywords, sentiment: 'neutral' };
  }

  private isProgramSpecificQuestion(message: string): boolean {
    // Use the program service to search for specific programs
    const searchResults = programService.searchPrograms(message);
    
    // Check if the message contains specific program names or related terms
    const programIndicators = [
      'bsc', 'bcom', 'bba', 'bca', 'mba', 'm.sc', 'm.a', 'phd',
      'computer science', 'ai', 'machine learning', 'data science',
      'cyber security', 'digital forensic', 'biotechnology', 'psychology',
      'visual communication', 'commerce', 'management', 'english',
      'mathematics', 'physics', 'costume design', 'fashion'
    ];
    
    // Check if message contains program indicators
    const hasProgramIndicators = programIndicators.some(indicator => 
      message.toLowerCase().includes(indicator.toLowerCase())
    );
    
    // Return true if we found specific programs or if message contains program indicators
    return searchResults.length > 0 || hasProgramIndicators;
  }

  private analyzeConversationContext(): ConversationContext {
    if (this.conversationContext.length === 0) {
      return { topic: 'general', mood: 'neutral', depth: 'surface' };
    }
    
    const recentMessages = this.conversationContext.slice(-3);
    const topics = recentMessages.flatMap(msg => this.extractKeywords(msg));
    const commonTopics = this.findCommonTopics(topics);
    
    return {
      topic: commonTopics.length > 0 ? commonTopics[0] : 'general',
      mood: this.detectMood(recentMessages),
      depth: this.conversationContext.length > 2 ? 'deep' : 'surface'
    };
  }

  private generateProgramSpecificResponse(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    // Search for specific programs in the message
    const searchResults = programService.searchPrograms(message);
    
    let answer = '';
    
    if (searchResults.length > 0) {
      // Found specific programs - provide detailed information
      answer += `**🎯 Program Information Found!**\n\n`;
      
      searchResults.forEach((program, index) => {
        answer += `${index + 1}. **${program.name}**\n`;
        answer += `   📚 **Department:** ${program.department.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
        answer += `   🎓 **Level:** ${program.level.charAt(0).toUpperCase() + program.level.slice(1)}\n`;
        answer += `   ⏱️ **Duration:** ${program.duration}\n\n`;
        answer += `   **Overview:** ${program.overview}\n\n`;
        
        if (program.core_subjects && program.core_subjects.length > 0) {
          answer += `   **📖 Core Subjects:** ${program.core_subjects.slice(0, 5).join(', ')}${program.core_subjects.length > 5 ? '...' : ''}\n\n`;
        }
        
        if (program.skills_gained && program.skills_gained.length > 0) {
          answer += `   **🛠️ Skills You'll Gain:** ${program.skills_gained.slice(0, 4).join(', ')}${program.skills_gained.length > 4 ? '...' : ''}\n\n`;
        }
        
        if (program.career_opportunities && program.career_opportunities.india && program.career_opportunities.india.length > 0) {
          answer += `   **💼 Career Opportunities:** ${program.career_opportunities.india.slice(0, 3).join(', ')}${program.career_opportunities.india.length > 3 ? '...' : ''}\n\n`;
        }
        
        if (program.salary_scope && program.salary_scope.india) {
          answer += `   **💰 Salary Scope (India):** ${program.salary_scope.india}\n\n`;
        }
        
        answer += `   **🔗 Learn More:** Visit our [Programs Page](/programs) for complete details, curriculum, and admission information.\n\n`;
        
        if (index < searchResults.length - 1) {
          answer += `---\n\n`;
        }
      });
      
      if (searchResults.length > 1) {
        answer += `**💡 Multiple Programs Found:** I found ${searchResults.length} programs matching your query. Each offers unique opportunities and specializations.\n\n`;
      }
      
      answer += `**🎯 Next Steps:**\n`;
      answer += `• Visit our [Programs Page](/programs) for detailed information\n`;
      answer += `• Compare programs side-by-side\n`;
      answer += `• Get personalized recommendations based on your interests\n`;
      answer += `• Contact our admissions team for specific queries\n\n`;
      
    } else {
      // No specific programs found, but message contains program indicators
      const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
      
      answer += `**🔍 Program Search Results**\n\n`;
      answer += `I understand you're asking about programs related to: **${intent.keywords.join(', ')}**\n\n`;
      
      if (faqData.length > 0) {
        answer += `${faqData[0].answer}\n\n`;
      }
      
      // Provide general program information based on keywords
      answer += `**📚 Related Programs at Rathinam College:**\n\n`;
      
      if (intent.keywords.some(k => k.includes('computer') || k.includes('ai') || k.includes('data'))) {
        answer += `💻 **Computer Science & IT Programs:**\n`;
        answer += `• B.Sc Computer Science (Multiple Specializations)\n`;
        answer += `• B.Sc Artificial Intelligence & Machine Learning\n`;
        answer += `• B.Sc Data Science and Analytics\n`;
        answer += `• BCA and M.Sc Programs\n\n`;
      }
      
      if (intent.keywords.some(k => k.includes('commerce') || k.includes('business'))) {
        answer += `💼 **Commerce & Business Programs:**\n`;
        answer += `• B.Com with CA, Banking, Insurance specializations\n`;
        answer += `• BBA in Logistics and Supply Chain\n`;
        answer += `• MBA Programs\n\n`;
      }
      
      if (intent.keywords.some(k => k.includes('science') || k.includes('bio') || k.includes('psychology'))) {
        answer += `🔬 **Science Programs:**\n`;
        answer += `• B.Sc in various Science disciplines\n`;
        answer += `• Research-oriented curriculum\n`;
        answer += `• Modern laboratory facilities\n\n`;
      }
      
      answer += `**🔗 Explore All Programs:** Visit our comprehensive [Programs Page](/programs) to:\n`;
      answer += `• Browse programs by department\n`;
      answer += `• Search and filter programs\n`;
      answer += `• Get detailed curriculum information\n`;
      answer += `• Compare programs side-by-side\n\n`;
    }
    
    return {
      answer: answer,
      confidence: searchResults.length > 0 ? 0.95 : 0.85,
      source: 'ai_generated',
      relatedFAQs: searchResults.length > 0 ? [] : this.faqService.searchFAQs(intent.keywords.join(' ')).slice(0, 3),
      reasoning: `Generated program-specific response for ${searchResults.length > 0 ? searchResults.length + ' specific programs' : 'general program inquiry'} with detailed information and programs page link`
    };
  }

  private isGeneralProgramOverviewQuestion(message: string): boolean {
    const generalProgramQuestions = [
      'ug programs',
      'undergraduate programs',
      'what programs',
      'which programs',
      'programs offered',
      'courses offered',
      'degrees offered',
      'bachelor programs',
      'bachelor degrees',
      'all programs',
      'list of programs',
      'available programs',
      'what ug programs',
      'what undergraduate programs',
      'what courses',
      'what degrees',
      'tell me about programs',
      'show me programs',
      'programs available',
      'courses available',
      'degrees available',
      'departments',
      'what departments',
      'which departments',
      'academic departments',
      'faculty departments',
      'schools',
      'what schools',
      'which schools',
      'academic schools',
      'study areas',
      'what can i study',
      'what subjects',
      'what fields',
      'academic fields',
      'study programs',
      'academic programs',
      'college programs',
      'university programs'
    ];

    const lowerMessage = message.toLowerCase();
    return generalProgramQuestions.some(q => lowerMessage.includes(q));
  }

  private getDepartmentContext() {
    const departmentInfo = departments.map((dept: any) => {
      const programs = programService.getProgramsByDepartment(dept.id);
      const ugCount = programs.filter((p: any) => p.level === 'undergraduate').length;
      const pgCount = programs.filter((p: any) => p.level === 'postgraduate').length;
      
      return {
        name: dept.name,
        description: dept.description,
        icon: dept.icon,
        programCount: programs.length,
        undergraduatePrograms: ugCount,
        postgraduatePrograms: pgCount,
        samplePrograms: programs.slice(0, 3).map((p: any) => p.name)
      };
    });
    
    return {
      totalDepartments: departments.length,
      departments: departmentInfo,
      programsPageUrl: '/programs'
    };
  }

  private generateGeneralProgramOverview(): ChatResponse {
    // Get department information from the program service
    const deptContext = this.getDepartmentContext();
    
    let answer = `**🎓 Academic Departments at Rathinam College**\n\n`;
    answer += `We have **${deptContext.totalDepartments} specialized departments** offering cutting-edge programs:\n\n`;
    
    deptContext.departments.forEach((dept: any) => {
      answer += `${dept.icon} **${dept.name}**\n`;
      answer += `   ${dept.description}\n`;
      answer += `   📚 **${dept.programCount} Programs** (${dept.undergraduatePrograms} UG, ${dept.postgraduatePrograms} PG)\n`;
      if (dept.samplePrograms.length > 0) {
        answer += `   🎯 **Sample Programs:** ${dept.samplePrograms.join(', ')}\n`;
      }
      answer += `\n`;
    });
    
    answer += `🔍 **Explore All Programs**\n`;
    answer += `For detailed information about all programs, course structures, career opportunities, and salary details, visit our comprehensive **[Programs Page](${deptContext.programsPageUrl})**.\n\n`;
    
    answer += `💡 **Quick Navigation:**\n`;
    answer += `• **Browse by Department** - See all programs organized by department\n`;
    answer += `• **Search & Filter** - Find programs by name, subjects, or skills\n`;
    answer += `• **Get Recommendations** - Based on your interests and career goals\n`;
    
    answer += `**🔗 Additional Resources:**\n`;
    answer += `• [Admissions](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
    answer += `• [Campus Info](https://rathinamcollege.ac.in/infrastructure)\n\n`;
    
    answer += `**💡 Tip:** Click the Programs Page link above for the most comprehensive and up-to-date information about all our academic offerings!`;

    return {
      answer: answer,
      confidence: 0.95,
      source: 'ai_generated',
      reasoning: `Generated comprehensive department overview with programs page link`
    };
  }

  // Handle specific department queries
  private generateDepartmentSpecificResponse(departmentName: string): ChatResponse | null {
    const dept = departments.find(d => 
      d.name.toLowerCase().includes(departmentName.toLowerCase()) ||
      d.id.toLowerCase().includes(departmentName.toLowerCase())
    );
    
    if (!dept) return null;
    
    const programs = programService.getProgramsByDepartment(dept.id);
    const ugCount = programs.filter((p: any) => p.level === 'undergraduate').length;
    const pgCount = programs.filter((p: any) => p.level === 'postgraduate').length;
    
    let answer = `${dept.icon} **${dept.name}**\n\n`;
    answer += `${dept.description}\n\n`;
    answer += `**📚 Programs Offered:** ${programs.length} total programs\n`;
    answer += `• **Undergraduate:** ${ugCount} programs\n`;
    answer += `• **Postgraduate:** ${pgCount} programs\n\n`;
    
    if (programs.length > 0) {
      answer += `**🎯 Available Programs:**\n`;
      programs.forEach((program: any) => {
        const level = program.level === 'undergraduate' ? 'UG' : 'PG';
        answer += `• **${program.name}** (${level})\n`;
        answer += `  ${program.overview.substring(0, 100)}...\n\n`;
      });
    }
    
    answer += `🔍 **Explore Full Details**\n`;
    answer += `For complete information about programs, curriculum, career opportunities, and salary details, visit our **[Programs Page](/programs)** and browse by department.\n\n`;
    
    answer += `**💡 Quick Access:** Navigate to the Programs page and click on the "${dept.name}" department to see all available programs with detailed information!`;

    return {
      answer: answer,
      confidence: 0.90,
      source: 'ai_generated',
      reasoning: `Generated department-specific response for ${dept.name}`
    };
  }

  private generateAcademicAdvice(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    let baseAnswer = '';
    
    if (faqData.length > 0) {
      baseAnswer = faqData[0].answer;
    }
    
    // Generate intelligent, contextual academic advice
    let answer = `Based on your interest in ${intent.keywords.join(', ')}, let me provide you with some thoughtful academic guidance:\n\n`;
    
    if (baseAnswer) {
      answer += `${baseAnswer}\n\n`;
    }
    
    // Add AI-generated insights
    answer += `**My AI Analysis & Recommendations:**\n\n`;
    
    if (intent.keywords.includes('study')) {
      answer += `🎯 **Study Strategy**: Consider your learning style - are you more visual, auditory, or kinesthetic? Rathinam College offers various learning environments to accommodate different preferences.\n\n`;
    }
    
    if (intent.keywords.includes('program') || intent.keywords.includes('course')) {
      answer += `📚 **Program Selection**: Think about your long-term goals. What excites you intellectually? What problems do you want to solve? This will help guide your program choice.\n\n`;
    }
    
    if (intent.keywords.includes('curriculum')) {
      answer += `📖 **Curriculum Insight**: The curriculum is designed to build both theoretical knowledge and practical skills. Look for courses that offer hands-on projects and real-world applications.\n\n`;
    }
    
    answer += `**Pro Tip**: Don't just focus on grades - engage with faculty, participate in research opportunities, and build a network of like-minded peers. Your college experience is what you make of it!\n\n`;
    
    answer += `Would you like me to dive deeper into any specific aspect of academic planning?`;
    
    return {
      answer: answer,
      confidence: 0.85,
      source: 'ai_generated',
      relatedFAQs: faqData.slice(0, 3),
      reasoning: `Generated contextual academic advice based on user intent: ${intent.type} and keywords: ${intent.keywords.join(', ')}`
    };
  }

  private generateCampusLifeResponse(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    
    let answer = `Let me paint you a picture of campus life at Rathinam College that goes beyond the basics:\n\n`;
    
    if (faqData.length > 0) {
      answer += `${faqData[0].answer}\n\n`;
    }
    
    answer += `**🎭 The Rathinam Experience - Beyond the Classroom:**\n\n`;
    
    // Generate creative campus life insights
    if (intent.keywords.includes('facility')) {
      answer += `🏗️ **Facilities That Inspire**: Our campus isn't just buildings - it's a living ecosystem designed to spark creativity. From modern labs that feel like tech startups to cozy study nooks that become your second home.\n\n`;
    }
    
    if (intent.keywords.includes('club') || intent.keywords.includes('activity')) {
      answer += `🌟 **Clubs & Activities**: Imagine finding your tribe among 20+ student organizations. Whether you're into coding marathons, cultural performances, or environmental activism, there's a space for your passion.\n\n`;
    }
    
    if (intent.keywords.includes('event')) {
      answer += `🎪 **Events That Connect**: Think beyond traditional college events. We host hackathons, TEDx-style talks, cultural festivals, and industry meetups that bridge the gap between academia and the real world.\n\n`;
    }
    
    answer += `**💡 My Perspective**: Campus life is about creating memories and connections that last a lifetime. It's where you'll discover not just what you want to study, but who you want to become.\n\n`;
    
    answer += `What aspect of campus life excites you most? I can share more specific details!`;
    
    return {
      answer: answer,
      confidence: 0.88,
      source: 'ai_generated',
      relatedFAQs: faqData.slice(0, 2),
      reasoning: `Generated immersive campus life response based on user interest in ${intent.keywords.join(', ')}`
    };
  }

  private generateCareerGuidance(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    
    let answer = `Let me help you think strategically about your career path at Rathinam College:\n\n`;
    
    if (faqData.length > 0) {
      answer += `${faqData[0].answer}\n\n`;
    }
    
    answer += `**🚀 Career Strategy - My AI Insights:**\n\n`;
    
    // Generate intelligent career guidance
    if (intent.keywords.includes('placement')) {
      answer += `📊 **Placement Reality**: While placement statistics are impressive, focus on building skills that make you placement-ready. What industries are you drawn to? What problems do you want to solve?\n\n`;
    }
    
    if (intent.keywords.includes('future') || intent.keywords.includes('career')) {
      answer += `🔮 **Future-Proofing**: The job market is evolving rapidly. Focus on developing transferable skills like critical thinking, communication, and adaptability alongside your technical expertise.\n\n`;
    }
    
    if (intent.keywords.includes('opportunity')) {
      answer += `💼 **Opportunity Creation**: Don't just wait for opportunities - create them. Start projects, build a portfolio, network with professionals, and stay curious about emerging trends.\n\n`;
    }
    
    answer += `**🎯 My Recommendation**: Choose a program that aligns with your interests, but also consider how it positions you for the future. The best career paths often emerge from the intersection of passion, skills, and market demand.\n\n`;
    
    answer += `What's your vision for your future career? I can help you align your academic choices with your professional goals.`;
    
    return {
      answer: answer,
      confidence: 0.87,
      source: 'ai_generated',
      relatedFAQs: faqData.slice(0, 2),
      reasoning: `Generated strategic career guidance based on user career intent and keywords: ${intent.keywords.join(', ')}`
    };
  }

  private generateComparisonResponse(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    
    let answer = `Great question! Let me break down this comparison with some nuanced insights:\n\n`;
    
    if (faqData.length > 0) {
      answer += `${faqData[0].answer}\n\n`;
    }
    
    answer += `**🔍 Comparative Analysis - My AI Perspective:**\n\n`;
    
    // Generate intelligent comparison insights
    if (intent.keywords.includes('vs') || intent.keywords.includes('compare')) {
      answer += `**The Reality Check**: Every comparison depends on your personal goals and circumstances. What matters most to you - academic rigor, practical skills, career outcomes, or campus culture?\n\n`;
    }
    
    if (intent.keywords.includes('better')) {
      answer += `**Beyond "Better"**: Instead of asking what's "better," ask what's "better for you." Your ideal choice depends on your learning style, career goals, and personal preferences.\n\n`;
    }
    
    if (intent.keywords.includes('difference')) {
      answer += `**Key Differentiators**: Look beyond surface-level differences. Consider factors like faculty expertise, industry connections, research opportunities, and alumni networks.\n\n`;
    }
    
    answer += `**💡 My Approach**: I can help you analyze specific aspects, but remember that the "best" choice is highly personal. What factors are most important to you in this decision?`;
    
    return {
      answer: answer,
      confidence: 0.82,
      source: 'ai_generated',
      relatedFAQs: faqData.slice(0, 2),
      reasoning: `Generated comparative analysis based on user's analytical intent and comparison keywords: ${intent.keywords.join(', ')}`
    };
  }

  private generatePersonalizedResponse(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    
    let answer = `I appreciate you sharing this with me. Let me provide some personalized guidance:\n\n`;
    
    if (faqData.length > 0) {
      answer += `${faqData[0].answer}\n\n`;
    }
    
    answer += `**🎯 Personalized Recommendations - Just for You:**\n\n`;
    
    // Generate personalized insights
    if (intent.keywords.includes('my')) {
      answer += `**Your Unique Path**: Everyone's journey is different. Let's focus on what makes your situation special and how we can tailor the information to your specific needs.\n\n`;
    }
    
    if (intent.keywords.includes('i want') || intent.keywords.includes('i need')) {
      answer += `**Understanding Your Goals**: I can see you have clear objectives. Let me help you find the most direct path to achieving them at Rathinam College.\n\n`;
    }
    
    if (intent.keywords.includes('help me')) {
      answer += `**Supporting Your Success**: I'm here to guide you through this process. Let's break down your question into manageable steps and find the answers you need.\n\n`;
    }
    
    answer += `**🤝 My Commitment**: I want to make sure you get exactly what you need. Can you tell me a bit more about your specific situation so I can provide even more targeted help?`;
    
    return {
      answer: answer,
      confidence: 0.90,
      source: 'ai_generated',
      relatedFAQs: faqData.slice(0, 2),
      reasoning: `Generated personalized response based on user's personal intent and context: ${context.topic}`
    };
  }

  private generateCreativeResponse(message: string, intent: UserIntent, context: ConversationContext): ChatResponse {
    const faqData = this.faqService.searchFAQs(intent.keywords.join(' '));
    
    let answer = `What an interesting and creative question! Let me think outside the box for you:\n\n`;
    
    if (faqData.length > 0) {
      answer += `${faqData[0].answer}\n\n`;
    }
    
    answer += `**🌈 Creative Exploration - Beyond the Obvious:**\n\n`;
    
    // Generate creative, imaginative responses
    if (intent.keywords.includes('imagine')) {
      answer += `**Let's Dream Together**: Imagine Rathinam College not just as a place to study, but as a launchpad for your wildest dreams. What if your classroom became a laboratory for innovation?\n\n`;
    }
    
    if (intent.keywords.includes('what if')) {
      answer += `**The "What If" Scenario**: What if you could design your own learning path? What if every assignment was a real-world project? What if your classmates became your future business partners?\n\n`;
    }
    
    if (intent.keywords.includes('creative') || intent.keywords.includes('unique')) {
      answer += `**Unconventional Thinking**: Sometimes the most creative solutions come from asking unusual questions. What makes you different? How can you turn your unique perspective into an advantage?\n\n`;
    }
    
    answer += `**🚀 My Creative Challenge**: Don't just follow the path - create your own. Rathinam College provides the tools, but you bring the imagination. What's your boldest vision for your future?`;
    
    return {
      answer: answer,
      confidence: 0.85,
      source: 'creative',
      relatedFAQs: faqData.slice(0, 2),
      reasoning: `Generated creative, imaginative response based on user's exploratory intent and creative keywords: ${intent.keywords.join(', ')}`
    };
  }

  private createEnhancedFAQResponse(userMessage: string): ChatResponse {
    const faqMatch = this.findFAQMatch(userMessage);
    
    if (faqMatch) {
      return this.createIntelligentFAQResponse(faqMatch, userMessage);
    }
    
    // Generate intelligent fallback with creative suggestions
    return this.createIntelligentFallbackResponse(userMessage);
  }

  private findFAQMatch(message: string): FAQItem | null {
    // First, try exact matches
    const exactMatch = this.faqService.findBestMatch(message);
    if (exactMatch) {
      return exactMatch;
    }

    // Try semantic search for better matching with higher threshold
    const searchResults = this.faqService.searchFAQs(message);
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      // Increase confidence threshold for better accuracy
      if (bestMatch.score && bestMatch.score > 0.75) {
        return bestMatch;
      }
    }

    // Try to find by specific program/course keywords first
    const programMatch = this.findBySpecificProgram(message);
    if (programMatch) {
      return programMatch;
    }

    // Try to find by common keywords
    const keywords = this.extractCommonKeywords(message);
    for (const keyword of keywords) {
      const match = this.faqService.findBestMatch(keyword);
      if (match) {
        return match;
      }
    }

    // Try category-based matching
    const categoryMatch = this.findByCategory(message);
    if (categoryMatch) {
      return categoryMatch;
    }

    return null;
  }

  private findBySpecificProgram(message: string): FAQItem | null {
    const lowerMessage = message.toLowerCase();
    
    // Specific program keywords that should have high priority
    const programKeywords = [
      'bsc digital and cyber forensic science',
      'bsc digital cyber forensic',
      'digital forensic',
      'cyber forensic',
      'cyber security',
      'digital forensics',
      'cyber forensics',
      'bsc computer science',
      'bsc ai ml',
      'bsc data science',
      'bsc biotechnology',
      'bsc psychology',
      'bsc visual communication',
      'bcom ca',
      'bcom accounting finance',
      'bcom banking insurance',
      'bcom international business',
      'bba logistics',
      'bca',
      'mba',
      'mba iev',
      'm sc data science',
      'm sc microbiology',
      'm a public administration',
      'm a journalism',
      'phd'
    ];

    // Search for exact program matches first
    for (const program of programKeywords) {
      if (lowerMessage.includes(program)) {
        const results = this.faqService.searchFAQs(program);
        if (results.length > 0 && results[0].score && results[0].score > 0.7) {
          return results[0];
        }
      }
    }

    return null;
  }

  private createIntelligentFAQResponse(faq: FAQItem, originalMessage: string): ChatResponse {
    let answer = this.generateNaturalResponse(faq, originalMessage);
    
    // Add intelligent link suggestions for ALL types of queries
    answer += this.generateIntelligentLinkSuggestions(originalMessage, faq.category);
    
    const relatedFAQs = this.findRelatedFAQs(faq, originalMessage);
    
    if (relatedFAQs.length > 0) {
      answer += `\n\n**Related questions you might find helpful:**`;
      relatedFAQs.slice(0, 3).forEach(related => {
        answer += `\n• ${related.question}`;
      });
    }

    return {
      answer: answer,
      confidence: 0.9,
      source: 'faq_enhanced',
      relatedFAQs: relatedFAQs,
      category: faq.category,
      link: faq.link
    };
  }

  private isAdmissionRelatedQuestion(message: string): boolean {
    const admissionKeywords = [
      'apply', 'application', 'admission', 'enroll', 'enrollment',
      'how to apply', 'how do i apply', 'application process',
      'admission procedure', 'admission process', 'apply online',
      'online application', 'admission form', 'application form'
    ];
    
    return admissionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private generateAdmissionSpecificInfo(message: string): string {
    let additionalInfo = '\n\n**🎯 Application Process:**\n\n';
    
    if (message.toLowerCase().includes('apply online') || message.toLowerCase().includes('online application')) {
      additionalInfo += `**📱 Online Application Steps:**\n`;
      additionalInfo += `• **Step 1**: Visit [Admissions Portal](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
      additionalInfo += `• **Step 2**: Click "Apply Now"\n`;
      additionalInfo += `• **Step 3**: Fill personal & academic details\n`;
      additionalInfo += `• **Step 4**: Upload documents\n`;
      additionalInfo += `• **Step 5**: Pay fee online\n`;
      additionalInfo += `• **Step 6**: Submit & confirm\n\n`;
      
      additionalInfo += `**📋 Required Documents:**\n`;
      additionalInfo += `• 10th & 12th mark sheets\n`;
      additionalInfo += `• Transfer certificate (if applicable)\n`;
      additionalInfo += `• Community certificate (if applicable)\n`;
      additionalInfo += `• Passport photos & ID proof\n\n`;
      
      additionalInfo += `**💰 Application Fee:**\n`;
      additionalInfo += `• UG Programs: ₹500 | PG Programs: ₹750\n`;
      additionalInfo += `• Payment: Credit/Debit, UPI, Net Banking\n\n`;
    }
    
    if (message.toLowerCase().includes('upload') || message.toLowerCase().includes('document')) {
      additionalInfo += `**📎 Document Guidelines:**\n`;
      additionalInfo += `• **Format**: PDF, JPG, PNG (max 2MB each)\n`;
      additionalInfo += `• **Quality**: Clear, legible scans\n`;
      additionalInfo += `• **Required**: All documents before submission\n`;
      additionalInfo += `• **Verification**: Originals during admission\n\n`;
    }
    
    if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('office')) {
      additionalInfo += `**📞 Admissions Office:**\n`;
      additionalInfo += `• **Phone**: +91-422-2699 999\n`;
      additionalInfo += `• **Email**: admissions@rathinamcollege.ac.in\n`;
      additionalInfo += `• **Address**: Rathinam College, Eachanari Post, Coimbatore - 641021\n`;
      additionalInfo += `• **Hours**: Mon-Fri, 9:00 AM - 5:00 PM\n\n`;
    }
    
    additionalInfo += `**🔗 Essential Links:**\n`;
    additionalInfo += `• [Apply Now](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
    additionalInfo += `• [Program Details](https://rathinamcollege.ac.in/programmes-offered/)\n`;
    additionalInfo += `• [Fee Structure](https://rathinamcollege.ac.in/pay-fees/)\n`;
    
    additionalInfo += `\n💡 **Pro Tip**: Start early, keep documents ready in digital format`;
    
    return additionalInfo;
  }

  private generateIntelligentLinkSuggestions(message: string, category: string): string {
    const lowerMessage = message.toLowerCase();
    let linkSection = '\n\n**🔗 Quick Access Links:**\n\n';
    
    // Academic & Program Related Queries - Only essential links
    if (this.isAcademicQuestion(lowerMessage) || category.toLowerCase().includes('academic') || category.toLowerCase().includes('program')) {
      linkSection += `• [All Programs](https://rathinamcollege.ac.in/programmes-offered/)\n`;
      linkSection += `• [Admissions](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
      linkSection += `• [Campus Facilities](https://rathinamcollege.ac.in/infrastructure)\n`;
    }
    
    // Admission Related Queries - Only essential links
    else if (this.isAdmissionRelatedQuestion(lowerMessage) || category.toLowerCase().includes('admission')) {
      linkSection += `• [Apply Online](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
      linkSection += `• [Program Details](https://rathinamcollege.ac.in/programmes-offered/)\n`;
      linkSection += `• [Fee Structure](https://rathinamcollege.ac.in/pay-fees/)\n`;
    }
    
    // Campus Life & Facilities - Only essential links
    else if (this.isCampusLifeQuestion(lowerMessage) || category.toLowerCase().includes('campus') || category.toLowerCase().includes('facility')) {
      linkSection += `• [Campus Overview](https://rathinamcollege.ac.in/infrastructure)\n`;
      linkSection += `• [Virtual Tour](https://rathinamcollege.ac.in/virtual-tour/)\n`;
      linkSection += `• [Photo Gallery](https://rathinamcollege.ac.in/gallery/)\n`;
    }
    
    // Financial & Scholarship - Only essential links
    else if (this.isFinancialQuestion(lowerMessage) || category.toLowerCase().includes('fee') || category.toLowerCase().includes('scholarship') || category.toLowerCase().includes('financial')) {
      linkSection += `• [Fee Structure](https://rathinamcollege.ac.in/pay-fees/)\n`;
      linkSection += `• [Payment Portal](https://rathinamcollege.ac.in/pay-fees/)\n`;
      linkSection += `• [Scholarships](https://rathinamcollege.ac.in/pay-fees/)\n`;
    }
    
    // Career & Placement - Only essential links
    else if (this.isCareerQuestion(lowerMessage) || category.toLowerCase().includes('career') || category.toLowerCase().includes('placement') || category.toLowerCase().includes('job')) {
      linkSection += `• [Placement Cell](https://rathinamcollege.ac.in/placement-cell/)\n`;
      linkSection += `• [Career Guidance](https://rathinamcollege.ac.in/placement-cell/)\n`;
      linkSection += `• [Alumni Network](https://rathinamcollege.ac.in/alumni/)\n`;
    }
    
    // Research & Innovation - Only essential links
    else if (this.isResearchQuestion(lowerMessage) || category.toLowerCase().includes('research') || category.toLowerCase().includes('innovation') || category.toLowerCase().includes('phd')) {
      linkSection += `• [Research Centers](https://rathinamcollege.ac.in/research/)\n`;
      linkSection += `• [PhD Programs](https://rathinamcollege.ac.in/programmes-offered/)\n`;
      linkSection += `• [Publications](https://rathinamcollege.ac.in/research/)\n`;
    }
    
    // International & Exchange - Only essential links
    else if (this.isInternationalQuestion(lowerMessage) || category.toLowerCase().includes('international') || category.toLowerCase().includes('exchange') || category.toLowerCase().includes('global')) {
      linkSection += `• [International Programs](https://rathinamcollege.ac.in/international/)\n`;
      linkSection += `• [Global Partnerships](https://rathinamcollege.ac.in/international/)\n`;
      linkSection += `• [Study Abroad](https://rathinamcollege.ac.in/international/)\n`;
    }
    
    // Student Support & Services - Only essential links
    else if (this.isStudentSupportQuestion(lowerMessage) || category.toLowerCase().includes('student') || category.toLowerCase().includes('support') || category.toLowerCase().includes('service')) {
      linkSection += `• [Student Welfare](https://rathinamcollege.ac.in/student-welfare/)\n`;
      linkSection += `• [Hostel Info](https://rathinamcollege.ac.in/infrastructure)\n`;
      linkSection += `• [Transportation](https://rathinamcollege.ac.in/infrastructure)\n`;
    }
    
    // Contact & Location - Only essential links
    else if (this.isContactQuestion(lowerMessage) || category.toLowerCase().includes('contact') || category.toLowerCase().includes('location') || category.toLowerCase().includes('address')) {
      linkSection += `• [Contact Us](https://rathinamcollege.ac.in/contact-us/)\n`;
      linkSection += `• [Campus Location](https://rathinamcollege.ac.in/contact-us/)\n`;
      linkSection += `• [Office Hours](https://rathinamcollege.ac.in/contact-us/)\n`;
    }
    
    // Events & Activities - Only essential links
    else if (this.isEventQuestion(lowerMessage) || category.toLowerCase().includes('event') || category.toLowerCase().includes('activity') || category.toLowerCase().includes('festival')) {
      linkSection += `• [Events Calendar](https://rathinamcollege.ac.in/events/)\n`;
      linkSection += `• [Student Clubs](https://rathinamcollege.ac.in/events/)\n`;
      linkSection += `• [Cultural Programs](https://rathinamcollege.ac.in/events/)\n`;
    }
    
    // Default case - Only 2-3 most essential links
    else {
      linkSection += `• [College Homepage](https://rathinamcollege.ac.in/)\n`;
      linkSection += `• [Programs](https://rathinamcollege.ac.in/programmes-offered/)\n`;
      linkSection += `• [Admissions](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
    }
    
    linkSection += `\n💡 **Click any link above for detailed information**`;
    
    return linkSection;
  }
  
  // Helper methods to categorize different types of questions
  private isAcademicQuestion(message: string): boolean {
    const academicKeywords = [
      'program', 'course', 'curriculum', 'syllabus', 'study', 'learn', 'education',
      'degree', 'bachelor', 'master', 'phd', 'subject', 'class', 'lecture', 'faculty',
      'teacher', 'professor', 'academic', 'scholarly', 'intellectual'
    ];
    return academicKeywords.some(keyword => message.includes(keyword));
  }
  
  private isCampusLifeQuestion(message: string): boolean {
    const campusKeywords = [
      'campus', 'facility', 'infrastructure', 'library', 'lab', 'laboratory',
      'sport', 'gym', 'cafeteria', 'hostel', 'dormitory', 'ground', 'field',
      'building', 'classroom', 'auditorium', 'seminar', 'conference'
    ];
    return campusKeywords.some(keyword => message.includes(keyword));
  }
  
  private isFinancialQuestion(message: string): boolean {
    const financialKeywords = [
      'fee', 'payment', 'cost', 'price', 'scholarship', 'financial', 'money',
      'tuition', 'expense', 'budget', 'afford', 'cheap', 'expensive', 'discount',
      'loan', 'grant', 'fund', 'sponsor'
    ];
    return financialKeywords.some(keyword => message.includes(keyword));
  }
  
  private isCareerQuestion(message: string): boolean {
    const careerKeywords = [
      'career', 'job', 'placement', 'employment', 'work', 'profession', 'vocation',
      'future', 'opportunity', 'industry', 'company', 'corporate', 'business',
      'entrepreneur', 'startup', 'internship', 'training', 'skill'
    ];
    return careerKeywords.some(keyword => message.includes(keyword));
  }
  
  private isResearchQuestion(message: string): boolean {
    const researchKeywords = [
      'research', 'innovation', 'discovery', 'experiment', 'investigation', 'study',
      'analysis', 'development', 'technology', 'science', 'phd', 'doctorate',
      'publication', 'paper', 'journal', 'conference', 'symposium'
    ];
    return researchKeywords.some(keyword => message.includes(keyword));
  }
  
  private isInternationalQuestion(message: string): boolean {
    const internationalKeywords = [
      'international', 'global', 'worldwide', 'foreign', 'abroad', 'overseas',
      'exchange', 'collaboration', 'partnership', 'alliance', 'network',
      'cultural', 'diversity', 'multicultural', 'cross-border'
    ];
    return internationalKeywords.some(keyword => message.includes(keyword));
  }
  
  private isStudentSupportQuestion(message: string): boolean {
    const supportKeywords = [
      'student', 'support', 'help', 'assist', 'service', 'welfare', 'care',
      'counseling', 'guidance', 'advice', 'mentor', 'tutor', 'coach',
      'health', 'medical', 'transport', 'accommodation', 'hostel'
    ];
    return supportKeywords.some(keyword => message.includes(keyword));
  }
  
  private isContactQuestion(message: string): boolean {
    const contactKeywords = [
      'contact', 'reach', 'call', 'phone', 'email', 'address', 'location',
      'place', 'where', 'find', 'locate', 'direction', 'map', 'route',
      'office', 'department', 'staff', 'person'
    ];
    return contactKeywords.some(keyword => message.includes(keyword));
  }
  
  private isEventQuestion(message: string): boolean {
    const eventKeywords = [
      'event', 'activity', 'festival', 'celebration', 'ceremony', 'function',
      'program', 'show', 'performance', 'exhibition', 'fair', 'competition',
      'contest', 'tournament', 'meet', 'gathering', 'assembly'
    ];
    return eventKeywords.some(keyword => message.includes(keyword));
  }

  private generateNaturalResponse(faq: FAQItem, originalMessage: string): string {
    const userQuestion = originalMessage.trim();
    
    if (userQuestion.includes('how') || userQuestion.includes('procedure') || userQuestion.includes('process')) {
      return `Here's how to ${faq.question.toLowerCase().replace('how do i ', '').replace('how can i ', '')}:\n\n${faq.answer}`;
    }
    
    if (userQuestion.includes('what') || userQuestion.includes('information') || userQuestion.includes('details')) {
      return `Here's what you need to know about ${faq.question.toLowerCase().replace('what is ', '').replace('what are ', '')}:\n\n${faq.answer}`;
    }
    
    if (userQuestion.includes('when') || userQuestion.includes('deadline') || userQuestion.includes('schedule')) {
      return `Regarding the timing for ${faq.question.toLowerCase().replace('when ', '').replace('deadline ', '')}:\n\n${faq.answer}`;
    }
    
    if (userQuestion.includes('where') || userQuestion.includes('location') || userQuestion.includes('place')) {
      return `Here's where you can ${faq.question.toLowerCase().replace('where ', '').replace('location ', '')}:\n\n${faq.answer}`;
    }
    
    if (userQuestion.includes('why') || userQuestion.includes('reason') || userQuestion.includes('purpose')) {
      return `Here's why ${faq.question.toLowerCase().replace('why ', '').replace('reason ', '')}:\n\n${faq.answer}`;
    }
    
    return `Based on your question about "${faq.question}", here's the information:\n\n${faq.answer}`;
  }

  private findRelatedFAQs(faq: FAQItem, originalMessage: string): FAQItem[] {
    const sameCategoryFAQs = this.faqService.getFAQsByCategory(faq.category);
    const related = sameCategoryFAQs.filter(f => f.question !== faq.question);
    
    // Sort by relevance first
    const sortedRelated = related.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, originalMessage);
      const bScore = this.calculateRelevanceScore(b, originalMessage);
      return bScore - aScore;
    });

    // Apply rotation to avoid showing the same questions repeatedly
    return this.rotateRelatedQuestions(sortedRelated, faq.category);
  }

  private calculateRelevanceScore(faq: FAQItem, message: string): number {
    const messageWords = message.toLowerCase().split(/\s+/);
    let score = 0;
    
    messageWords.forEach(word => {
      if (faq.question.toLowerCase().includes(word)) {
        score += 1;
      }
    });
    
    return score;
  }

  private rotateRelatedQuestions(questions: FAQItem[], category: string): FAQItem[] {
    if (questions.length === 0) return [];
    
    // Get current rotation index for this category
    const currentIndex = this.questionRotationIndex.get(category) || 0;
    
    // Create a rotated array starting from current index
    const rotatedQuestions = [
      ...questions.slice(currentIndex),
      ...questions.slice(0, currentIndex)
    ];
    
    // Filter out recently shown questions to avoid immediate repetition
    const availableQuestions = rotatedQuestions.filter(q => 
      !this.recentlyShownQuestions.has(q.question)
    );
    
    // If we don't have enough questions that haven't been shown recently,
    // clear the recently shown set and use all questions
    if (availableQuestions.length < 3) {
      this.recentlyShownQuestions.clear();
      // Re-filter after clearing
      const freshQuestions = rotatedQuestions.filter(q => 
        !this.recentlyShownQuestions.has(q.question)
      );
      if (freshQuestions.length >= 3) {
        availableQuestions.push(...freshQuestions.slice(0, 3 - availableQuestions.length));
      }
    }
    
    // Take first 3 questions (or less if not enough available)
    const selectedQuestions = availableQuestions.slice(0, 3);
    
    // Mark these questions as recently shown
    selectedQuestions.forEach(q => this.recentlyShownQuestions.add(q.question));
    
    // Update rotation index for next time (cycle through all questions)
    const nextIndex = (currentIndex + selectedQuestions.length) % Math.max(questions.length, 1);
    this.questionRotationIndex.set(category, nextIndex);
    
    // If we've shown too many questions recently, reset the tracking
    if (this.recentlyShownQuestions.size > 100) {
      this.recentlyShownQuestions.clear();
    }
    
    return selectedQuestions;
  }

  private createIntelligentFallbackResponse(message: string): ChatResponse {
    const categories = this.faqService.getCategories();
    const popularFAQs = this.faqService.getFAQsByPopularTopics();
    
    const messageWords = message.toLowerCase().split(/\s+/);
    const relevantCategories = categories.filter(category => 
      messageWords.some(word => category.toLowerCase().includes(word))
    );
    
    let answer = `I understand you're asking about "${message}". `;
    
    // Check if this is an admission-related question and provide specific guidance
    if (this.isAdmissionRelatedQuestion(message)) {
      answer += `Let me provide you with comprehensive admission information:\n\n`;
      answer += this.generateAdmissionSpecificInfo(message);
      answer += `\n\n**💡 Need More Help?** Try asking about:\n`;
      answer += `• Specific program requirements\n`;
      answer += `• Document preparation\n`;
      answer += `• Application deadlines\n`;
      answer += `• Fee payment options\n`;
      answer += `• Campus visit arrangements`;
    } else {
      // For non-admission questions, provide intelligent link suggestions
      answer += `\n\n`;
      answer += this.generateIntelligentLinkSuggestions(message, 'general');
      answer += `\n\n**💡 Need More Help?** Try asking about:\n`;
      answer += `• Specific program details\n`;
      answer += `• Campus facilities\n`;
      answer += `• Student life\n`;
      answer += `• Research opportunities\n`;
      answer += `• Career guidance`;
      if (relevantCategories.length > 0) {
        answer += `This seems related to: ${relevantCategories.join(', ')}. `;
      }
      
      answer += `While I don't have a specific answer for this question, I can help you with information about:`;
      
      // Use rotation for fallback related questions too
      const rotatedPopularFAQs = this.rotateRelatedQuestions(popularFAQs, 'general');
      rotatedPopularFAQs.forEach(faq => {
        answer += `\n• ${faq.question}`;
      });
      
      answer += `\n\n**Available categories**: ${categories.join(', ')}\n\nFeel free to ask more specific questions, and I'll do my best to help you! You can also try rephrasing your question or asking about a specific topic like admissions, programs, or campus facilities.`;
    }
    
    return {
      answer: answer,
      confidence: 0.3,
      source: 'fallback',
      relatedFAQs: this.rotateRelatedQuestions(popularFAQs, 'general')
    };
  }

  private extractKeywords(message: string): string[] {
    const commonKeywords = [
      'admission', 'apply', 'application', 'program', 'course', 'fee', 'payment',
      'scholarship', 'hostel', 'library', 'lab', 'faculty', 'teacher', 'exam',
      'result', 'certificate', 'document', 'form', 'deadline', 'eligibility',
      'requirement', 'contact', 'phone', 'email', 'address', 'location',
      'transport', 'bus', 'train', 'airport', 'campus', 'facility', 'club',
      'sport', 'cultural', 'event', 'festival', 'placement', 'job', 'career',
      'internship', 'research', 'phd', 'mba', 'bsc', 'msc', 'bcom', 'mcom',
      'study', 'learn', 'curriculum', 'syllabus', 'future', 'opportunity',
      'compare', 'difference', 'better', 'vs', 'versus', 'imagine', 'creative',
      'unique', 'interesting', 'my', 'i want', 'i need', 'help me', 'advice'
    ];

    return commonKeywords.filter(keyword => message.toLowerCase().includes(keyword));
  }

  private extractCommonKeywords(message: string): string[] {
    return this.extractKeywords(message);
  }

  private findByCategory(message: string): FAQItem | null {
    const categories = this.faqService.getCategories();
    
    for (const category of categories) {
      if (message.includes(category.toLowerCase())) {
        const categoryFAQs = this.faqService.getFAQsByCategory(category);
        if (categoryFAQs.length > 0) {
          return categoryFAQs[0];
        }
      }
    }
    
    return null;
  }

  private findCommonTopics(topics: string[]): string[] {
    const topicCount = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  private detectMood(messages: string[]): string {
    const positiveWords = ['excited', 'happy', 'great', 'wonderful', 'amazing', 'love', 'like'];
    const negativeWords = ['worried', 'concerned', 'anxious', 'confused', 'frustrated', 'hate', 'dislike'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    messages.forEach(message => {
      const lowerMessage = message.toLowerCase();
      positiveWords.forEach(word => {
        if (lowerMessage.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (lowerMessage.includes(word)) negativeCount++;
      });
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  public getFAQStats(): { total: number; categories: { category: string; count: number }[] } {
    return {
      total: this.faqService.getTotalFAQCount(),
      categories: this.faqService.getCategoryStats()
    };
  }

  public getSuggestedQuestions(): string[] {
    const popularFAQs = this.faqService.getFAQsByPopularTopics();
    return popularFAQs.map(faq => faq.question);
  }
}

export default AIChatService;
