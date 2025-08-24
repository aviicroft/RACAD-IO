import { NextRequest } from "next/server";
import { collegeStore } from "@/lib/college-store";
import { programService, departments } from "@/lib/services/program-service";

// 🔑 AI SERVICE CONFIGURATION
// Choose your AI service and add your API key

// Option 1: Perplexity AI (Recommended - Free tier available)
const USE_PERPLEXITY = true;
const PERPLEXITY_API_KEY = "pplx-YOUR_API_KEY";

// Option 2: OpenAI (Paid service)
const USE_OPENAI = false;
const OPENAI_API_KEY = "sk-your-openai-key-here";

// Option 3: Anthropic Claude (Paid service)
const USE_ANTHROPIC = false;
const ANTHROPIC_API_KEY = "sk-ant-your-anthropic-key-here";

// Helper function to get the active API configuration
function getActiveAIConfig() {
  if (USE_PERPLEXITY && PERPLEXITY_API_KEY && !PERPLEXITY_API_KEY.includes("your_actual_api_key_here")) {
    return { service: "perplexity", key: PERPLEXITY_API_KEY };
  }
  if (USE_OPENAI && OPENAI_API_KEY && !OPENAI_API_KEY.includes("your-openai-key-here")) {
    return { service: "openai", key: OPENAI_API_KEY };
  }
  if (USE_ANTHROPIC && ANTHROPIC_API_KEY && !ANTHROPIC_API_KEY.includes("your-anthropic-key-here")) {
    return { service: "anthropic", key: ANTHROPIC_API_KEY };
  }
  return null;
}

type ChatRequestBody = {
  question?: string;
  stream?: boolean;
};

let cachedCollegeContent: string | null = null;
let cachedChunks: string[] | null = null;
let cachedVersion: number = -1;

// Check if the question is about specific programs
function isProgramSpecificQuestion(question: string): boolean {
  const programIndicators = [
    'bsc', 'bcom', 'bba', 'bca', 'mba', 'm.sc', 'm.a', 'phd',
    'computer science', 'ai', 'machine learning', 'data science',
    'cyber security', 'digital forensic', 'biotechnology', 'psychology',
    'visual communication', 'commerce', 'management', 'english',
    'mathematics', 'physics', 'costume design', 'fashion'
  ];
  
  return programIndicators.some(indicator => 
    question.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Check if the question is about general programs/departments
function isGeneralProgramQuestion(question: string): boolean {
  const generalProgramQuestions = [
    'ug programs', 'undergraduate programs', 'what programs', 'which programs',
    'programs offered', 'courses offered', 'degrees offered', 'bachelor programs',
    'bachelor degrees', 'all programs', 'list of programs', 'available programs',
    'what ug programs', 'what undergraduate programs', 'what courses', 'what degrees',
    'tell me about programs', 'show me programs', 'programs available', 'courses available',
    'degrees available', 'departments', 'what departments', 'which departments',
    'academic departments', 'faculty departments', 'schools', 'what schools',
    'which schools', 'academic schools', 'study areas', 'what can i study',
    'what subjects', 'what fields', 'academic fields', 'study programs',
    'academic programs', 'college programs', 'university programs'
  ];

  return generalProgramQuestions.some(q => question.toLowerCase().includes(q));
}

// Generate program-specific response using our program service
function generateProgramSpecificResponse(question: string): string {
  const searchResults = programService.searchPrograms(question);
  
  if (searchResults.length === 0) {
    return "I understand you're asking about programs, but I couldn't find specific matches. Please visit our [Programs Page](/programs) to explore all available programs.";
  }
  
  let response = `**🎯 Program Information Found!**\n\n`;
  
  searchResults.forEach((program, index) => {
    response += `${index + 1}. **${program.name}**\n`;
    response += `   📚 **Department:** ${program.department.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
    response += `   🎓 **Level:** ${program.level.charAt(0).toUpperCase() + program.level.slice(1)}\n`;
    response += `   ⏱️ **Duration:** ${program.duration}\n\n`;
    response += `   **Overview:** ${program.overview}\n\n`;
    
    if (program.core_subjects && program.core_subjects.length > 0) {
      response += `   **📖 Core Subjects:** ${program.core_subjects.slice(0, 5).join(', ')}${program.core_subjects.length > 5 ? '...' : ''}\n\n`;
    }
    
    if (program.skills_gained && program.skills_gained.length > 0) {
      response += `   **🛠️ Skills You'll Gain:** ${program.skills_gained.slice(0, 4).join(', ')}${program.skills_gained.length > 4 ? '...' : ''}\n\n`;
    }
    
    if (program.career_opportunities && program.career_opportunities.india && program.career_opportunities.india.length > 0) {
      response += `   **💼 Career Opportunities:** ${program.career_opportunities.india.slice(0, 3).join(', ')}${program.career_opportunities.india.length > 3 ? '...' : ''}\n\n`;
    }
    
    if (program.salary_scope && program.salary_scope.india) {
      response += `   **💰 Salary Scope (India):** ${program.salary_scope.india}\n\n`;
    }
    
    if (index < searchResults.length - 1) {
      response += `---\n\n`;
    }
  });
  
  if (searchResults.length > 1) {
    response += `**💡 Multiple Programs Found:** I found ${searchResults.length} programs matching your query. Each offers unique opportunities and specializations.\n\n`;
  }
  
  response += `**🔗 Learn More:** Visit our [Programs Page](/programs) for complete details, curriculum, and admission information.\n\n`;
  response += `**🎯 Next Steps:**\n`;
  response += `• Visit our [Programs Page](/programs) for detailed information\n`;
  response += `• Compare programs side-by-side\n`;
  response += `• Get personalized recommendations based on your interests\n`;
  response += `• Contact our admissions team for specific queries`;
  
  return response;
}

// Generate general program overview using our program service
function generateGeneralProgramOverview(): string {
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
  
  let response = `**🎓 Academic Departments at Rathinam College**\n\n`;
  response += `We have **${departments.length} specialized departments** offering cutting-edge programs:\n\n`;
  
  departmentInfo.forEach((dept: any) => {
    response += `${dept.icon} **${dept.name}**\n`;
    response += `   ${dept.description}\n`;
    response += `   📚 **${dept.programCount} Programs** (${dept.undergraduatePrograms} UG, ${dept.postgraduatePrograms} PG)\n`;
    if (dept.samplePrograms.length > 0) {
      response += `   🎯 **Sample Programs:** ${dept.samplePrograms.join(', ')}\n`;
    }
    response += `\n`;
  });
  
  response += `🔍 **Explore All Programs**\n`;
  response += `For detailed information about all programs, course structures, career opportunities, and salary details, visit our comprehensive **[Programs Page](/programs)**.\n\n`;
  
  response += `💡 **Quick Navigation:**\n`;
  response += `• **Browse by Department** - See all programs organized by department\n`;
  response += `• **Search & Filter** - Find programs by name, subjects, or skills\n`;
  response += `• **Get Recommendations** - Based on your interests and career goals\n`;
  
  response += `**🔗 Additional Resources:**\n`;
  response += `• [Admissions](https://rathinamcollege.ac.in/adminssion-procedure/)\n`;
  response += `• [Campus Info](https://rathinamcollege.ac.in/infrastructure)\n\n`;
  
  response += `**💡 Tip:** Click the Programs Page link above for the most comprehensive and up-to-date information about all our academic offerings!`;
  
  return response;
}

async function loadCollegeContent(baseUrl: string): Promise<string> {
  const currentVersion = collegeStore.getCacheVersion();
  if (cachedCollegeContent && cachedVersion === currentVersion) return cachedCollegeContent;
  
  const collegeUrl = collegeStore.getCollegeUrl();
  if (!collegeUrl) {
    return "No college website has been configured yet. Please provide a college website URL first.";
  }
  
  try {
    // Scrape the college website
    const response = await fetch(`${baseUrl}/api/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: collegeUrl })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to scrape website: ${response.statusText}`);
    }
    
    const data = await response.json();
    cachedCollegeContent = data.content;
    cachedVersion = currentVersion;
    return data.content;
  } catch (error) {
    console.error("Error loading college content:", error);
    return "Failed to load college website content. Please try again or check the URL.";
  }
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\r\n|\r|\n/g, "\n");
}

function chunkText(input: string, chunkSize = 1200, overlap = 200): string[] {
  const text = normalizeWhitespace(input);
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
    if (start < 0) start = 0;
  }
  return chunks;
}

const STOPWORDS = new Set(
  "a,an,and,are,as,at,be,by,for,from,has,have,he,her,hers,herself,him,himself,his,i,in,is,it,its,of,on,or,our,ours,ourselves,that,the,their,theirs,them,they,this,to,was,were,will,with,you,your,yours,yourself,yourselves".split(",")
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function scoreChunk(chunk: string, query: string): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;
  const querySet = new Set(queryTokens);
  const chunkTokens = tokenize(chunk);
  let score = 0;
  for (const token of chunkTokens) {
    if (querySet.has(token)) score += 1;
  }
  return score / Math.max(1, chunkTokens.length);
}

async function getTopChunks(question: string, baseUrl: string, topK = 8): Promise<string[]> {
  const currentVersion = collegeStore.getCacheVersion();
  if (!cachedChunks || cachedVersion !== currentVersion) {
    const content = await loadCollegeContent(baseUrl);
    cachedChunks = chunkText(content);
  }
  const scored = cachedChunks!.map((c) => ({ c, s: scoreChunk(c, question) }));
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, topK).map((x) => x.c);
}

function buildMessages(question: string, contextChunks: string[]) {
  const system =
    "You are the official AI assistant for Rathinam College of Arts and Science (RCAS), Coimbatore. You ONLY answer based on the official information provided in the 'Context' below which comes from the college's official website (rathinamcollege.ac.in). When answering, mention that this information is about Rathinam College of Arts and Science. Highlight key achievements like NAAC A++ Grade (3.6 score), NIRF rankings (top 150-200 institutions), and other recognitions. If the answer is not found in the Context, respond exactly with: 'I'm sorry, I don't have that specific information about Rathinam College. Please contact our college office at [email protected] or call 844 844 8909 for further assistance.' Use a professional yet friendly tone. Summarize when possible and structure with bullet points for clarity. For contact details, dates, or fees, use the exact information from the official website without modifying it.";

  const contextHeader =
    "Context (verbatim excerpts from Rathinam College's official website). Use ONLY this to answer:\n---\n" +
    contextChunks.join("\n\n---\n") +
    "\n---\n";

  return [
    { role: "system", content: system },
    { role: "user", content: contextHeader + "\nQuestion: " + question },
  ];
}

function sseToPlaintextTransform(): TransformStream<Uint8Array, Uint8Array> {
  const textDecoder = new TextDecoder();
  const textEncoder = new TextEncoder();
  let buffer = "";
  
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += textDecoder.decode(chunk, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            controller.terminate();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(textEncoder.encode(content));
            }
          } catch (_e) {
            // Ignore parsing errors on flush
          }
        }
      }
    }
  });
}

export async function POST(req: NextRequest) {
  const activeAIConfig = getActiveAIConfig();
  if (!activeAIConfig) {
    console.error("No active AI service configured or API key missing.");
    return new Response("No active AI service configured or API key missing.", { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch (_err) {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question) {
    return new Response("Question is required", { status: 400 });
  }

  console.log("Processing question:", question);

  // Check if this is a program-related question first
  if (isProgramSpecificQuestion(question)) {
    console.log("Program-specific question detected, using program service");
    const programResponse = generateProgramSpecificResponse(question);
    return new Response(programResponse, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  if (isGeneralProgramQuestion(question)) {
    console.log("General program question detected, using program service");
    const programOverview = generateGeneralProgramOverview();
    return new Response(programOverview, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  // For non-program questions, use the external AI service
  try {
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const context = await getTopChunks(question, baseUrl);
    console.log("Found", context.length, "context chunks");
    
    const messages = buildMessages(question, context);
    console.log("Built messages with context length:", context.join("").length);

    const preferStream = body.stream !== false;

    if (preferStream) {
      console.log(`Making streaming request to ${activeAIConfig.service} API...`);
      
      if (activeAIConfig.service === "perplexity") {
        // Create an AbortController with timeout for Perplexity API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const pplxResponse = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${activeAIConfig.key}`,
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({
              model: "sonar",
              messages,
              temperature: 0,
              stream: true,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!pplxResponse.ok) {
            const errText = await pplxResponse.text().catch(() => "");
            console.error("Perplexity API error:", pplxResponse.status, errText);
            return new Response(`Perplexity API error: ${pplxResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          if (!pplxResponse.body) {
            console.error("No response body from Perplexity API");
            return new Response("No response body from Perplexity API", { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          console.log("Streaming response from Perplexity API...");
          const transform = sseToPlaintextTransform();
          const readable = pplxResponse.body.pipeThrough(transform);

          return new Response(readable, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("Perplexity API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("Perplexity API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`Perplexity API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      } else if (activeAIConfig.service === "openai") {
        // Create an AbortController with timeout for OpenAI API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${activeAIConfig.key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages,
              temperature: 0,
              stream: true,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!openaiResponse.ok) {
            const errText = await openaiResponse.text().catch(() => "");
            console.error("OpenAI API error:", openaiResponse.status, errText);
            return new Response(`OpenAI API error: ${openaiResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          if (!openaiResponse.body) {
            console.error("No response body from OpenAI API");
            return new Response("No response body from OpenAI API", { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          console.log("Streaming response from OpenAI API...");
          const transform = sseToPlaintextTransform();
          const readable = openaiResponse.body.pipeThrough(transform);

          return new Response(readable, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("OpenAI API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("OpenAI API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      } else if (activeAIConfig.service === "anthropic") {
        // Create an AbortController with timeout for Anthropic API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": activeAIConfig.key,
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-3-haiku-20240307",
              messages: messages.map(msg => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content
              })),
              max_tokens: 1000,
              stream: true,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!anthropicResponse.ok) {
            const errText = await anthropicResponse.text().catch(() => "");
            console.error("Anthropic API error:", anthropicResponse.status, errText);
            return new Response(`Anthropic API error: ${anthropicResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          if (!anthropicResponse.body) {
            console.error("No response body from Anthropic API");
            return new Response("No response body from Anthropic API", { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }

          console.log("Streaming response from Anthropic API...");
          const transform = sseToPlaintextTransform();
          const readable = anthropicResponse.body.pipeThrough(transform);

          return new Response(readable, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("Anthropic API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("Anthropic API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`Anthropic API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      }
      
      // Fallback if no service is configured
      return new Response("No AI service configured. Please set up an API key first.", { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    } else {
      console.log(`Making non-streaming request to ${activeAIConfig.service} API...`);
      
      if (activeAIConfig.service === "perplexity") {
        // Create an AbortController with timeout for non-streaming Perplexity API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const pplxResponse = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${activeAIConfig.key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "sonar",
              messages,
              temperature: 0,
              stream: false,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!pplxResponse.ok) {
            const errText = await pplxResponse.text().catch(() => "");
            console.error("Perplexity API error:", pplxResponse.status, errText);
            return new Response(`Perplexity API error: ${pplxResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          const json = await pplxResponse.json();
          const content = json?.choices?.[0]?.message?.content ?? "";
          console.log("Received response from Perplexity API, length:", content.length);
          return Response.json({ answer: content });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("Non-streaming Perplexity API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("Perplexity API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`Perplexity API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      } else if (activeAIConfig.service === "openai") {
        // Create an AbortController with timeout for non-streaming OpenAI API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${activeAIConfig.key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages,
              temperature: 0,
              stream: false,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!openaiResponse.ok) {
            const errText = await openaiResponse.text().catch(() => "");
            console.error("OpenAI API error:", openaiResponse.status, errText);
            return new Response(`OpenAI API error: ${openaiResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          const json = await openaiResponse.json();
          const content = json?.choices?.[0]?.message?.content ?? "";
          console.log("Received response from OpenAI API, length:", content.length);
          return Response.json({ answer: content });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("Non-streaming OpenAI API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("OpenAI API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      } else if (activeAIConfig.service === "anthropic") {
        // Create an AbortController with timeout for non-streaming Anthropic API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
        
        try {
          const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": activeAIConfig.key,
              "Content-Type": "application/json",
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-3-haiku-20240307",
              messages: messages.map(msg => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content
              })),
              max_tokens: 1000,
              stream: false,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId); // Clear timeout if request succeeds

          if (!anthropicResponse.ok) {
            const errText = await anthropicResponse.text().catch(() => "");
            console.error("Anthropic API error:", anthropicResponse.status, errText);
            return new Response(`Anthropic API error: ${anthropicResponse.status} ${errText}`, { 
              status: 502,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          const json = await anthropicResponse.json();
          const content = json?.content?.[0]?.text ?? "";
          console.log("Received response from Anthropic API, length:", content.length);
          return Response.json({ answer: content });
        } catch (error) {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error("Non-streaming Anthropic API request error:", error);
          
          if (error instanceof Error && error.name === 'AbortError') {
            return new Response("Anthropic API request timeout - please try again", { 
              status: 504,
              headers: {
                'Content-Type': 'text/plain'
              }
            });
          }
          
          return new Response(`Anthropic API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 502,
            headers: {
              'Content-Type': 'text/plain'
            }
          });
        }
      }
      
      // Fallback if no service is configured
      return new Response("No AI service configured. Please set up an API key first.", { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(`Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}


