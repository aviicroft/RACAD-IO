import { NextRequest, NextResponse } from 'next/server';

// Comprehensive scraping for Rathinam College website
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('Starting comprehensive scraping of Rathinam College website:', url);

    // All the URLs from the college website organized by category
    const allUrls = [
      // Main pages
      'https://rathinamcollege.ac.in/',
      'https://rathinamcollege.ac.in/about-coe/',
      'https://rathinamcollege.ac.in/academic-council/',
      'https://rathinamcollege.ac.in/achivements/',
      'https://rathinamcollege.ac.in/adminssion-procedure/',
      'https://rathinamcollege.ac.in/after-you-graduate/',
      'https://rathinamcollege.ac.in/aicte-vaani/',
      'https://rathinamcollege.ac.in/alumni-guidance',
      'https://rathinamcollege.ac.in/aptitude-competitive-examination-cell/',
      
      // Academic Programs - Commerce
      'https://rathinamcollege.ac.in/b-com-accounting-finance/',
      'https://rathinamcollege.ac.in/b-com-banking-and-insurance/',
      'https://rathinamcollege.ac.in/b-com-ca/',
      'https://rathinamcollege.ac.in/b-com-with-international-business/',
      
      // Academic Programs - Science
      'https://rathinamcollege.ac.in/b-sc-ai-ml/',
      'https://rathinamcollege.ac.in/b-sc-biotechnology-2/',
      'https://rathinamcollege.ac.in/b-sc-computer-science-artificial-intelligence/',
      'https://rathinamcollege.ac.in/b-sc-data-science-and-analytics/',
      'https://rathinamcollege.ac.in/b-sc-digital-cyber-forensic-science/',
      'https://rathinamcollege.ac.in/b-sc-mathematics-2/',
      'https://rathinamcollege.ac.in/b-sc-physics-2',
      'https://rathinamcollege.ac.in/b-sc-psychology-2/',
      'https://rathinamcollege.ac.in/b-sc-viscom-2/',
      
      // Academic Programs - Management & Arts
      'https://rathinamcollege.ac.in/bba-logistics-2/',
      'https://rathinamcollege.ac.in/bca/',
      'https://rathinamcollege.ac.in/m-a-public-administration/',
      'https://rathinamcollege.ac.in/m-phil-commerce/',
      'https://rathinamcollege.ac.in/m-sc-data-science-and-business-analysis/',
      'https://rathinamcollege.ac.in/m-sc-microbiology-programme/',
      'https://rathinamcollege.ac.in/ma-journalism-and-mass-communication/',
      'https://rathinamcollege.ac.in/mba-4/',
      'https://rathinamcollege.ac.in/mba-iev/',
      
      // Research Programs
      'https://rathinamcollege.ac.in/ph-d-biotechnology/',
      'https://rathinamcollege.ac.in/ph-d-computer-science/',
      'https://rathinamcollege.ac.in/ph-d-management/',
      'https://rathinamcollege.ac.in/ph-d-physics/',
      'https://rathinamcollege.ac.in/ph-d-psychology/',
      
      // Academic Structure
      'https://rathinamcollege.ac.in/board-of-study-bos/',
      'https://rathinamcollege.ac.in/programmes-offered/',
      'https://rathinamcollege.ac.in/regulations-syllabus/',
      'https://rathinamcollege.ac.in/end-semester-examination-schedule/',
      'https://rathinamcollege.ac.in/result-passing-board/',
      'https://rathinamcollege.ac.in/our-teaching-methodology/',
      
      // Departments & Schools
      'https://rathinamcollege.ac.in/department-of-biotechnology/',
      'https://rathinamcollege.ac.in/department-of-computer-science/',
      'https://rathinamcollege.ac.in/department-of-visual-communication/',
      'https://rathinamcollege.ac.in/school-of-commerce-2/',
      'https://rathinamcollege.ac.in/school-of-computer-science/',
      'https://rathinamcollege.ac.in/school-of-creative-arts/',
      'https://rathinamcollege.ac.in/school-of-management/',
      
      // Student Life & Activities
      'https://rathinamcollege.ac.in/consumer-club/',
      'https://rathinamcollege.ac.in/cultural-club/',
      'https://rathinamcollege.ac.in/fashion-and-art-club/',
      'https://rathinamcollege.ac.in/techno-club/',
      'https://rathinamcollege.ac.in/rathinam-sports-club/',
      'https://rathinamcollege.ac.in/rotract-club/',
      'https://rathinamcollege.ac.in/nss-rrc/',
      'https://rathinamcollege.ac.in/youth-red-cross-yrc/',
      
      // Innovation & Development
      'https://rathinamcollege.ac.in/entrepreneurship-development-cell/',
      'https://rathinamcollege.ac.in/faculty-development-cell/',
      'https://rathinamcollege.ac.in/startup/',
      'https://rathinamcollege.ac.in/hackathons/',
      'https://rathinamcollege.ac.in/patents/',
      'https://rathinamcollege.ac.in/value-added-courses-add-on-courses/',
      
      // Infrastructure & Facilities
      'https://rathinamcollege.ac.in/infrastructure',
      'https://rathinamcollege.ac.in/brochure/',
      'https://rathinamcollege.ac.in/forms/',
      'https://rathinamcollege.ac.in/pay-fees/',
      'https://rathinamcollege.ac.in/finance/',
      
      // Information & Support
      'https://rathinamcollege.ac.in/feedback-action/',
      'https://rathinamcollege.ac.in/feedback-analysis/',
      'https://rathinamcollege.ac.in/feedback-from-stakeholders/',
      'https://rathinamcollege.ac.in/pre-arrival-information/',
      'https://rathinamcollege.ac.in/post-arrival-information/',
      'https://rathinamcollege.ac.in/going-back-home/',
      'https://rathinamcollege.ac.in/success-stories/',
      'https://rathinamcollege.ac.in/facts-about-india/',
      'https://rathinamcollege.ac.in/regional-ecosystem/',
      'https://rathinamcollege.ac.in/besprac/',
      'https://rathinamcollege.ac.in/inter-proj/',
      'https://rathinamcollege.ac.in/iqac/',
      'https://rathinamcollege.ac.in/eoa/',
      'https://rathinamcollege.ac.in/governing-body/',
      'https://rathinamcollege.ac.in/raise-smart-learn-solutions-private-limited',
      'https://rathinamcollege.ac.in/rathinam-community-college/'
    ];

    let allContent = '';
    const scrapedPages: { url: string; content: string; length: number; status: string }[] = [];
    const failedUrls: string[] = [];

    // Process URLs in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < allUrls.length; i += batchSize) {
      const batch = allUrls.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allUrls.length/batchSize)}`);
      
      const batchPromises = batch.map(async (pageUrl) => {
        try {
          console.log(`Scraping: ${pageUrl}`);
          
          const response = await fetch(pageUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Cache-Control': 'max-age=0'
            },
            signal: AbortSignal.timeout(20000), // 20 second timeout per page
          });

          if (response.ok) {
            const html = await response.text();
            const textContent = extractComprehensiveContent(html, pageUrl);
            
            if (textContent.trim().length > 50) { // Only add pages with meaningful content
              const pageInfo = {
                url: pageUrl,
                content: textContent,
                length: textContent.length,
                status: 'success'
              };
              scrapedPages.push(pageInfo);
              allContent += `\n\n=== PAGE: ${pageUrl} ===\n${textContent}`;
              console.log(`✓ Successfully scraped ${textContent.length} characters from ${pageUrl}`);
            } else {
              console.log(`⚠ Skipping ${pageUrl} - insufficient content (${textContent.length} chars)`);
            }
          } else {
            console.log(`✗ HTTP ${response.status} for ${pageUrl}`);
            failedUrls.push(`${pageUrl} (HTTP ${response.status})`);
          }
        } catch (error) {
          console.log(`✗ Error scraping ${pageUrl}:`, error instanceof Error ? error.message : 'Unknown error');
          failedUrls.push(`${pageUrl} (${error instanceof Error ? error.message : 'Unknown error'})`);
        }
      });

      // Wait for batch to complete before moving to next batch
      await Promise.allSettled(batchPromises);
      
      // Small delay between batches to be respectful to the server
      if (i + batchSize < allUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Create a comprehensive summary
    const summary = createContentSummary(scrapedPages);
    
    // Limit content length to prevent memory issues
    const maxLength = 500000; // 500KB limit for comprehensive data
    const truncatedContent = allContent.length > maxLength 
      ? allContent.substring(0, maxLength) + '... [Content truncated due to length]'
      : allContent;

    console.log(`\n=== SCRAPING COMPLETE ===`);
    console.log(`Total URLs processed: ${allUrls.length}`);
    console.log(`Successfully scraped: ${scrapedPages.length}`);
    console.log(`Failed: ${failedUrls.length}`);
    console.log(`Total content: ${allContent.length} characters`);

    return NextResponse.json({
      content: truncatedContent,
      summary: summary,
      originalLength: allContent.length,
      truncated: allContent.length > maxLength,
      scrapedPages: scrapedPages.map(p => ({ url: p.url, length: p.length, status: p.status })),
      failedUrls: failedUrls,
      totalUrls: allUrls.length,
      successCount: scrapedPages.length,
      failureCount: failedUrls.length,
      url: url
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    let errorMessage = 'Failed to scrape website';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - website took too long to respond';
      } else if (error.message.includes('fetch failed')) {
        errorMessage = 'Network error - unable to connect to the website';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function extractComprehensiveContent(html: string, pageUrl: string): string {
  // Remove scripts, styles, and other non-content elements
  let textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

  // Extract structured content based on page type
  let structuredContent = '';
  
  // Course-specific extraction
  if (pageUrl.includes('b-com-') || pageUrl.includes('b-sc-') || pageUrl.includes('mba') || pageUrl.includes('m-sc-')) {
    structuredContent = extractCourseContent(html, pageUrl);
  }
  
  // Department-specific extraction
  else if (pageUrl.includes('department-') || pageUrl.includes('school-of-')) {
    structuredContent = extractDepartmentContent(html, pageUrl);
  }
  
  // General page extraction
  else {
    structuredContent = extractGeneralContent(html, pageUrl);
  }

  // If structured extraction didn't work well, fall back to basic extraction
  if (structuredContent.trim().length < 200) {
    textContent = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .trim();
  } else {
    textContent = structuredContent;
  }

  // Add page context
  const pageName = getPageName(pageUrl);
  if (pageName) {
    textContent = `PAGE: ${pageName}\n${textContent}`;
  }

  return textContent;
}

function extractCourseContent(html: string, pageUrl: string): string {
  let content = '';
  
  // Extract course title
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                     html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    content += `COURSE: ${titleMatch[1].trim()}\n\n`;
  }
  
  // Extract course details from common patterns
  const patterns = [
    /Overview[^<]*/gi,
    /Programme[^<]*/gi,
    /Curriculum[^<]*/gi,
    /Duration[^<]*/gi,
    /Eligibility[^<]*/gi,
    /Career[^<]*/gi,
    /Opportunities[^<]*/gi,
    /PEO[^<]*/gi,
    /PO[^<]*/gi,
    /PSO[^<]*/gi
  ];
  
  for (const pattern of patterns) {
    const matches = html.match(pattern);
    if (matches) {
      content += `${matches.join('\n')}\n\n`;
    }
  }
  
  // Extract content from specific sections
  const sections = html.match(/<div[^>]*class="[^"]*(?:content|section|course-info)[^"]*"[^>]*>[\s\S]*?<\/div>/gi) || [];
  for (const section of sections) {
    const cleanText = section.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText.length > 20) {
      content += cleanText + '\n\n';
    }
  }
  
  return content;
}

function extractDepartmentContent(html: string, pageUrl: string): string {
  let content = '';
  
  // Extract department title
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                     html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    content += `DEPARTMENT: ${titleMatch[1].trim()}\n\n`;
  }
  
  // Extract faculty information
  const facultySection = html.match(/Faculty[^<]*/gi) || [];
  if (facultySection.length > 0) {
    content += `FACULTY INFORMATION:\n${facultySection.join('\n')}\n\n`;
  }
  
  // Extract activities and achievements
  const activitiesSection = html.match(/Activities[^<]*/gi) || [];
  if (activitiesSection.length > 0) {
    content += `ACTIVITIES:\n${activitiesSection.join('\n')}\n\n`;
  }
  
  // Extract general content
  const generalContent = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of generalContent) {
    const cleanText = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText.length > 30) {
      content += cleanText + '\n';
    }
  }
  
  return content;
}

function extractGeneralContent(html: string, pageUrl: string): string {
  let content = '';
  
  // Extract main headings
  const headings = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi) || [];
  for (const heading of headings) {
    const cleanHeading = heading.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanHeading.length > 5) {
      content += `HEADING: ${cleanHeading}\n`;
    }
  }
  
  // Extract paragraphs
  const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of paragraphs) {
    const cleanText = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText.length > 30) {
      content += cleanText + '\n\n';
    }
  }
  
  // Extract list items
  const listItems = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
  for (const li of listItems) {
    const cleanText = li.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText.length > 10) {
      content += `• ${cleanText}\n`;
    }
  }
  
  return content;
}

function getPageName(url: string): string {
  // Course pages
  if (url.includes('b-com-accounting-finance')) return 'B.Com Accounting & Finance';
  if (url.includes('b-com-banking-and-insurance')) return 'B.Com Banking & Insurance';
  if (url.includes('b-com-ca')) return 'B.Com CA';
  if (url.includes('b-com-with-international-business')) return 'B.Com International Business';
  if (url.includes('b-sc-ai-ml')) return 'B.Sc AI & ML';
  if (url.includes('b-sc-biotechnology')) return 'B.Sc Biotechnology';
  if (url.includes('b-sc-computer-science-artificial-intelligence')) return 'B.Sc Computer Science AI';
  if (url.includes('b-sc-data-science-and-analytics')) return 'B.Sc Data Science & Analytics';
  if (url.includes('b-sc-digital-cyber-forensic-science')) return 'B.Sc Digital Cyber Forensic Science';
  if (url.includes('b-sc-mathematics')) return 'B.Sc Mathematics';
  if (url.includes('b-sc-physics')) return 'B.Sc Physics';
  if (url.includes('b-sc-psychology')) return 'B.Sc Psychology';
  if (url.includes('b-sc-viscom')) return 'B.Sc Visual Communication';
  if (url.includes('bba-logistics')) return 'BBA Logistics';
  if (url.includes('bca')) return 'BCA';
  if (url.includes('m-a-public-administration')) return 'M.A Public Administration';
  if (url.includes('m-phil-commerce')) return 'M.Phil Commerce';
  if (url.includes('m-sc-data-science-and-business-analysis')) return 'M.Sc Data Science & Business Analysis';
  if (url.includes('m-sc-microbiology')) return 'M.Sc Microbiology';
  if (url.includes('ma-journalism')) return 'M.A Journalism & Mass Communication';
  if (url.includes('mba-4')) return 'MBA';
  if (url.includes('mba-iev')) return 'MBA IEV';
  
  // Research programs
  if (url.includes('ph-d-biotechnology')) return 'Ph.D Biotechnology';
  if (url.includes('ph-d-computer-science')) return 'Ph.D Computer Science';
  if (url.includes('ph-d-management')) return 'Ph.D Management';
  if (url.includes('ph-d-physics')) return 'Ph.D Physics';
  if (url.includes('ph-d-psychology')) return 'Ph.D Psychology';
  
  // Departments & Schools
  if (url.includes('department-of-biotechnology')) return 'Department of Biotechnology';
  if (url.includes('department-of-computer-science')) return 'Department of Computer Science';
  if (url.includes('department-of-visual-communication')) return 'Department of Visual Communication';
  if (url.includes('school-of-commerce')) return 'School of Commerce';
  if (url.includes('school-of-computer-science')) return 'School of Computer Science';
  if (url.includes('school-of-creative-arts')) return 'School of Creative Arts';
  if (url.includes('school-of-management')) return 'School of Management';
  
  // Academic pages
  if (url.includes('programmes-offered')) return 'Programmes Offered';
  if (url.includes('regulations-syllabus')) return 'Regulations & Syllabus';
  if (url.includes('admission-procedure')) return 'Admission Procedure';
  if (url.includes('about-coe')) return 'About COE';
  if (url.includes('academic-council')) return 'Academic Council';
  
  // Student life
  if (url.includes('cultural-club')) return 'Cultural Club';
  if (url.includes('techno-club')) return 'Techno Club';
  if (url.includes('sports-club')) return 'Sports Club';
  if (url.includes('nss-rrc')) return 'NSS RRC';
  
  // General pages
  if (url.includes('about-rathinam-group')) return 'About Rathinam Group';
  if (url.includes('infrastructure')) return 'Infrastructure';
  if (url.includes('contact')) return 'Contact Information';
  
  return 'General Page';
}

interface ContentSummary {
  totalPages: number;
  totalContentLength: number;
  averagePageLength: number;
  pageTypes: {
    courses: number;
    departments: number;
    academic: number;
    studentLife: number;
    general: number;
  };
  topPagesByContent: { url: string; length: number }[];
}

function createContentSummary(scrapedPages: { url: string; content: string; length: number; status: string }[]): ContentSummary {
  const summary: ContentSummary = {
    totalPages: scrapedPages.length,
    totalContentLength: scrapedPages.reduce((sum, page) => sum + page.length, 0),
    averagePageLength: Math.round(scrapedPages.reduce((sum, page) => sum + page.length, 0) / scrapedPages.length),
    pageTypes: {
      courses: scrapedPages.filter(p => p.url.includes('b-com-') || p.url.includes('b-sc-') || p.url.includes('mba') || p.url.includes('m-sc-')).length,
      departments: scrapedPages.filter(p => p.url.includes('department-') || p.url.includes('school-of-')).length,
      academic: scrapedPages.filter(p => p.url.includes('programmes') || p.url.includes('syllabus') || p.url.includes('admission')).length,
      studentLife: scrapedPages.filter(p => p.url.includes('club') || p.url.includes('sports') || p.url.includes('nss')).length,
      general: scrapedPages.filter(p => !p.url.includes('b-com-') && !p.url.includes('b-sc-') && !p.url.includes('department-') && !p.url.includes('school-of-')).length
    },
    topPagesByContent: scrapedPages
      .sort((a, b) => b.length - a.length)
      .slice(0, 10)
      .map(p => ({ url: p.url, length: p.length }))
  };
  
  return summary;
}
