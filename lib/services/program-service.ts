// Extended program data structure (imported data would be used here in production)

// Define the department structure
export interface Department {
  id: string
  name: string
  description: string
  icon: string
}

export interface Program {
  id: string
  name: string
  overview: string
  core_subjects: string[]
  skills_gained: string[]
  tools_and_technologies: string[]
  career_opportunities: {
    india: string[]
    international: string[]
  }
  salary_scope: {
    india: {
      entry_level: string
      mid_level: string
      senior_level: string
    }
    international: {
      entry_level: string
      mid_level: string
      senior_level: string
    }
  }
  future_scope: string
  department: string
  level: 'undergraduate' | 'postgraduate'
  duration: string
}

// Define the 10 departments
export const departments: Department[] = [
  {
    id: 'computer-science',
    name: 'Department of Computer Science',
    description: 'Cutting-edge technology programs in computer science, AI, and software development',
    icon: '💻'
  },
  {
    id: 'commerce',
    name: 'Department of Commerce',
    description: 'Business and commerce programs with modern applications and technology integration',
    icon: '📊'
  },
  {
    id: 'mathematics',
    name: 'Department of Mathematics',
    description: 'Pure and applied mathematics with computational and analytical focus',
    icon: '🔢'
  },
  {
    id: 'physics',
    name: 'Department of Physics',
    description: 'Advanced physics programs with research and practical applications',
    icon: '⚛️'
  },
  {
    id: 'psychology',
    name: 'Department of Psychology',
    description: 'Human behavior and mental processes with modern research methodologies',
    icon: '🧠'
  },
  {
    id: 'bio-science',
    name: 'Department of Bio-Science',
    description: 'Biotechnology and life sciences with cutting-edge research opportunities',
    icon: '🧬'
  },
  {
    id: 'costume-design',
    name: 'Department of Costume Design and Fashion',
    description: 'Creative design programs in fashion, textiles, and visual arts',
    icon: '👗'
  },
  {
    id: 'visual-communications',
    name: 'Department of Visual Communications',
    description: 'Digital media, design, and communication technology programs',
    icon: '🎨'
  },
  {
    id: 'management',
    name: 'Department of Management',
    description: 'Business administration and management with technology integration',
    icon: '🏢'
  },
  {
    id: 'english',
    name: 'Department of English',
    description: 'Language, literature, and communication studies',
    icon: '📚'
  }
]

// Enhanced program data combining extended data with computer science programs
const enhancedProgramData: Program[] = [
  // Computer Science & IT Programs (16 programs)
  {
    id: "cs-1",
    name: "B.Sc Computer Science",
    overview: "A 3-year undergraduate program providing a strong foundation in computer science, programming, algorithms, operating systems, and software development.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Programming (C, C++, Java, Python)",
      "Data Structures & Algorithms",
      "Database Management Systems (DBMS)",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "Web Technologies",
      "Cloud Computing Basics"
    ],
    skills_gained: [
      "Problem-solving and algorithmic thinking",
      "Programming and debugging",
      "Database design and management",
      "System analysis",
      "Networking concepts"
    ],
    tools_and_technologies: [
      "MySQL/PostgreSQL",
      "Linux/Unix",
      "Eclipse/IntelliJ",
      "Git/GitHub",
      "AWS/Azure Basics"
    ],
    career_opportunities: {
      india: [
        "Software Developer",
        "System Analyst",
        "Database Administrator",
        "IT Support Engineer",
        "Web Developer"
      ],
      international: [
        "Full Stack Developer",
        "Cloud Administrator",
        "System Architect",
        "Technical Consultant"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹3–4 LPA",
        mid_level: "₹6–8 LPA",
        senior_level: "₹12–20 LPA"
      },
      international: {
        entry_level: "$45k–60k",
        mid_level: "$80k–100k",
        senior_level: "$120k+"
      }
    },
    future_scope: "Growing demand due to cloud adoption, automation, and software-driven businesses. Higher studies in AI, cybersecurity, or data science can unlock better opportunities."
  },
  {
    id: "cs-2",
    name: "B.Sc Information Technology",
    overview: "Focuses on IT infrastructure, database systems, networking, and business-oriented IT solutions.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Information Systems",
      "Networking",
      "Database Systems",
      "Software Testing",
      "Cloud Computing",
      "Web Development",
      "IT Project Management"
    ],
    skills_gained: [
      "System Administration",
      "Networking",
      "Database Management",
      "Business IT Integration",
      "Cybersecurity Basics"
    ],
    tools_and_technologies: [
      "Cisco Tools",
      "Oracle DB",
      "VMware",
      "AWS",
      "Microsoft Azure"
    ],
    career_opportunities: {
      india: [
        "IT Consultant",
        "System Administrator",
        "Network Engineer",
        "Technical Support Engineer"
      ],
      international: [
        "Cloud Engineer",
        "Cybersecurity Analyst",
        "Enterprise IT Specialist"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹3–3.5 LPA",
        mid_level: "₹6–9 LPA",
        senior_level: "₹15+ LPA"
      },
      international: {
        entry_level: "$40k–55k",
        mid_level: "$75k–95k",
        senior_level: "$120k+"
      }
    },
    future_scope: "Critical for industries adopting digital transformation. IT skills are evergreen across finance, healthcare, and e-commerce."
  },
  {
    id: "cs-3",
    name: "B.Sc Computer Technology",
    overview: "Blends computer science and hardware, focusing on embedded systems, IoT, and hardware-software integration.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Microprocessors",
      "Computer Architecture",
      "Embedded Systems",
      "IoT Fundamentals",
      "C/C++ Programming",
      "Digital Electronics"
    ],
    skills_gained: [
      "Embedded System Development",
      "IoT Solutions",
      "Hardware Design",
      "Low-level Programming"
    ],
    tools_and_technologies: [
      "Arduino",
      "Raspberry Pi",
      "MATLAB",
      "Proteus",
      "Keil µVision"
    ],
    career_opportunities: {
      india: [
        "IoT Developer",
        "Embedded Engineer",
        "Hardware Engineer"
      ],
      international: [
        "System Programmer",
        "Robotics Developer",
        "Chip Design Engineer"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹3–4 LPA",
        mid_level: "₹7–10 LPA",
        senior_level: "₹15+ LPA"
      },
      international: {
        entry_level: "$45k–65k",
        mid_level: "$90k–110k",
        senior_level: "$130k+"
      }
    },
    future_scope: "With IoT, smart devices, and robotics on the rise, hardware-software integration specialists are in high demand."
  },
  {
    id: "cs-4",
    name: "BCA (Bachelor of Computer Applications)",
    overview: "A professional undergraduate course focusing on application development, software design, and business computing.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Programming (Java, Python, PHP)",
      "Web Development",
      "Database Management",
      "Mobile App Development",
      "Cloud Computing"
    ],
    skills_gained: [
      "Application Development",
      "Web & Mobile Development",
      "Database Administration",
      "Software Testing"
    ],
    tools_and_technologies: [
      "Android Studio",
      "PHP/MySQL",
      "React/Angular",
      "GitHub"
    ],
    career_opportunities: {
      india: [
        "Software Developer",
        "Web Developer",
        "App Developer",
        "Database Admin"
      ],
      international: [
        "Full Stack Developer",
        "Cloud Developer",
        "Application Architect"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹3–4 LPA",
        mid_level: "₹6–8 LPA",
        senior_level: "₹12+ LPA"
      },
      international: {
        entry_level: "$45k–60k",
        mid_level: "$85k–100k",
        senior_level: "$120k+"
      }
    },
    future_scope: "One of the most popular IT programs in India with growing demand in startups and IT companies. A stepping stone to MCA/M.Sc."
  },
  {
    id: "cs-5",
    name: "B.Sc Digital and Cyber Forensic Science",
    overview: "Specialized course for cybercrime investigation, digital evidence handling, and cybersecurity.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Cyber Forensics",
      "Ethical Hacking",
      "Cryptography",
      "Cyber Laws",
      "Malware Analysis"
    ],
    skills_gained: [
      "Digital Evidence Analysis",
      "Penetration Testing",
      "Network Security",
      "Forensic Investigation"
    ],
    tools_and_technologies: [
      "EnCase",
      "FTK",
      "Kali Linux",
      "Wireshark",
      "Metasploit"
    ],
    career_opportunities: {
      india: [
        "Cyber Forensic Analyst",
        "Security Officer",
        "Incident Responder",
        "Cybercrime Investigator"
      ],
      international: [
        "Forensic Expert",
        "Penetration Tester",
        "Information Security Consultant"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹4–5 LPA",
        mid_level: "₹8–12 LPA",
        senior_level: "₹20+ LPA"
      },
      international: {
        entry_level: "$55k–70k",
        mid_level: "$100k–130k",
        senior_level: "$160k+"
      }
    },
    future_scope: "Cybersecurity is a booming field with increasing cybercrime cases worldwide. Governments and MNCs are hiring aggressively."
  },
  {
    id: "cs-6",
    name: "B.Sc Artificial Intelligence and Machine Learning",
    overview: "Undergraduate program focusing on AI, neural networks, and ML models for automation and intelligent systems.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Data Mining",
      "Natural Language Processing"
    ],
    skills_gained: [
      "Model Building",
      "Neural Networks",
      "Data Preprocessing",
      "AI Applications"
    ],
    tools_and_technologies: [
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Python",
      "R"
    ],
    career_opportunities: {
      india: [
        "AI Engineer",
        "ML Developer",
        "Data Scientist"
      ],
      international: [
        "AI Specialist",
        "Robotics Engineer"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–6 LPA",
        mid_level: "₹10–15 LPA",
        senior_level: "₹20+ LPA"
      },
      international: {
        entry_level: "$65k–85k",
        mid_level: "$120k–140k",
        senior_level: "$170k+"
      }
    },
    future_scope: "Demand for AI and ML is skyrocketing with industries automating workflows, using chatbots, and adopting AI models."
  },
  {
    id: "cs-7",
    name: "B.Sc Computer Science with Cyber Security",
    overview: "Focuses on cybersecurity concepts, network defense, and secure software development.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Cybersecurity Fundamentals",
      "Cryptography",
      "Network Security",
      "Ethical Hacking",
      "Cloud Security"
    ],
    skills_gained: [
      "Threat Analysis",
      "Cyber Defense",
      "Incident Response",
      "Secure Programming"
    ],
    tools_and_technologies: [
      "Kali Linux",
      "Wireshark",
      "Burp Suite",
      "Nessus"
    ],
    career_opportunities: {
      india: [
        "Cybersecurity Analyst",
        "Penetration Tester",
        "Security Consultant"
      ],
      international: [
        "Cloud Security Engineer",
        "Incident Manager"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹4–5 LPA",
        mid_level: "₹8–12 LPA",
        senior_level: "₹18+ LPA"
      },
      international: {
        entry_level: "$55k–75k",
        mid_level: "$100k–120k",
        senior_level: "$160k+"
      }
    },
    future_scope: "Cybersecurity is among the top 5 fastest-growing careers globally due to rising cyber threats."
  },
  {
    id: "cs-8",
    name: "B.Sc Computer Science (Artificial Intelligence & Data Science)",
    overview: "A program combining AI techniques with data science for problem-solving and decision-making.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "AI Basics",
      "Data Science",
      "Machine Learning",
      "Data Visualization",
      "Predictive Analytics"
    ],
    skills_gained: [
      "AI Model Development",
      "Data Analysis",
      "Statistical Computing"
    ],
    tools_and_technologies: [
      "Python",
      "Tableau",
      "TensorFlow",
      "PowerBI"
    ],
    career_opportunities: {
      india: [
        "Data Scientist",
        "AI Analyst"
      ],
      international: [
        "AI Consultant",
        "ML Engineer"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–6 LPA",
        mid_level: "₹10–14 LPA",
        senior_level: "₹20+ LPA"
      },
      international: {
        entry_level: "$65k–80k",
        mid_level: "$110k–130k",
        senior_level: "$160k+"
      }
    },
    future_scope: "AI & Data Science specialists are in high demand with cross-industry applications."
  },
  {
    id: "cs-9",
    name: "B.Sc Computer Science (Artificial Intelligence)",
    overview: "Specialized course on Artificial Intelligence covering algorithms, neural networks, and deep learning.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "AI Algorithms",
      "Machine Learning",
      "Neural Networks",
      "Cognitive Systems"
    ],
    skills_gained: [
      "Problem-solving with AI",
      "Neural Network Design",
      "Automation Solutions"
    ],
    tools_and_technologies: [
      "PyTorch",
      "Keras",
      "OpenCV",
      "TensorFlow"
    ],
    career_opportunities: {
      india: [
        "AI Engineer",
        "Automation Specialist"
      ],
      international: [
        "Cognitive Scientist",
        "AI Researcher"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–7 LPA",
        mid_level: "₹12–15 LPA",
        senior_level: "₹22+ LPA"
      },
      international: {
        entry_level: "$70k–90k",
        mid_level: "$120k–140k",
        senior_level: "$170k+"
      }
    },
    future_scope: "AI-focused roles will expand with robotics, self-driving cars, and conversational AI."
  },
  {
    id: "cs-10",
    name: "B.Sc Computer Science (Data Science)",
    overview: "Focuses on extracting insights from structured and unstructured data using modern tools.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Data Science",
      "Big Data",
      "Machine Learning",
      "Statistical Analysis",
      "Data Visualization"
    ],
    skills_gained: [
      "Data Cleaning",
      "Predictive Modeling",
      "Statistical Analysis"
    ],
    tools_and_technologies: [
      "R",
      "Python",
      "Hadoop",
      "Tableau"
    ],
    career_opportunities: {
      india: [
        "Data Analyst",
        "Business Analyst"
      ],
      international: [
        "Data Scientist",
        "Data Engineer"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–6 LPA",
        mid_level: "₹10–15 LPA",
        senior_level: "₹22+ LPA"
      },
      international: {
        entry_level: "$65k–85k",
        mid_level: "$120k–140k",
        senior_level: "$170k+"
      }
    },
    future_scope: "Data Science is transforming industries; demand is surging for analysts and ML engineers."
  },
  {
    id: "cs-11",
    name: "B.Sc Data Science and Analytics",
    overview: "Concentrates on advanced analytics, predictive modeling, and decision support systems.",
    department: "computer-science",
    level: "undergraduate",
    duration: "3 years",
    core_subjects: [
      "Data Analytics",
      "Business Statistics",
      "Machine Learning",
      "Predictive Modeling"
    ],
    skills_gained: [
      "Business Insights",
      "Analytical Thinking",
      "Decision Modeling"
    ],
    tools_and_technologies: [
      "Excel",
      "Python",
      "R",
      "PowerBI"
    ],
    career_opportunities: {
      india: [
        "Business Analyst",
        "Data Engineer"
      ],
      international: [
        "Analytics Consultant",
        "Data Strategist"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹4–6 LPA",
        mid_level: "₹10–14 LPA",
        senior_level: "₹20+ LPA"
      },
      international: {
        entry_level: "$60k–80k",
        mid_level: "$110k–130k",
        senior_level: "$160k+"
      }
    },
    future_scope: "Analytics roles are growing as companies rely on data-driven decisions in almost every field."
  },
  {
    id: "cs-12",
    name: "M.Sc Computer Science",
    overview: "Advanced 2-year postgraduate course emphasizing theoretical and practical aspects of advanced computing, AI, and research.",
    department: "computer-science",
    level: "postgraduate",
    duration: "2 years",
    core_subjects: [
      "Advanced Algorithms",
      "Machine Learning",
      "Artificial Intelligence",
      "Big Data Analytics",
      "Compiler Design",
      "Research Methodologies"
    ],
    skills_gained: [
      "Research & Development",
      "High-level Programming",
      "Machine Learning Applications",
      "Advanced Database Systems"
    ],
    tools_and_technologies: [
      "Python",
      "R",
      "TensorFlow",
      "Hadoop",
      "MATLAB"
    ],
    career_opportunities: {
      india: [
        "Research Scientist",
        "AI Engineer",
        "System Architect",
        "Professor"
      ],
      international: [
        "Data Scientist",
        "AI Specialist",
        "Cloud Architect"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–7 LPA",
        mid_level: "₹10–15 LPA",
        senior_level: "₹20–30 LPA"
      },
      international: {
        entry_level: "$65k–80k",
        mid_level: "$110k–130k",
        senior_level: "$160k+"
      }
    },
    future_scope: "Preferred for research roles, academia, and high-paying tech jobs in AI, ML, and data science."
  },
  {
    id: "cs-13",
    name: "M.Sc Information Technology",
    overview: "A postgraduate program focused on IT applications, cloud computing, cybersecurity, and enterprise solutions.",
    department: "computer-science",
    level: "postgraduate",
    duration: "2 years",
    core_subjects: [
      "Cloud Computing",
      "Enterprise Applications",
      "Cybersecurity",
      "Data Warehousing",
      "IT Strategy"
    ],
    skills_gained: [
      "IT Management",
      "Cloud Administration",
      "Cybersecurity Expertise",
      "Project Leadership"
    ],
    tools_and_technologies: [
      "AWS",
      "Azure",
      "Oracle",
      "SAP"
    ],
    career_opportunities: {
      india: [
        "Cloud Administrator",
        "IT Manager",
        "Information Security Specialist"
      ],
      international: [
        "Enterprise Architect",
        "Cloud Security Specialist"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹5–6 LPA",
        mid_level: "₹10–14 LPA",
        senior_level: "₹18–25 LPA"
      },
      international: {
        entry_level: "$60k–75k",
        mid_level: "$100k–120k",
        senior_level: "$150k+"
      }
    },
    future_scope: "Enterprise IT specialists are in demand globally as industries rely heavily on IT infrastructure."
  },
  {
    id: "cs-14",
    name: "M.Sc Data Science and Business Analysis",
    overview: "Specialization in analytics, big data, and business decision-making using machine learning and AI.",
    department: "computer-science",
    level: "postgraduate",
    duration: "2 years",
    core_subjects: [
      "Data Science",
      "Machine Learning",
      "Business Analytics",
      "Big Data Tools",
      "Statistics",
      "Data Visualization"
    ],
    skills_gained: [
      "Data Analysis",
      "Predictive Modeling",
      "Business Insights",
      "Visualization"
    ],
    tools_and_technologies: [
      "Python",
      "R",
      "Tableau",
      "PowerBI",
      "Spark"
    ],
    career_opportunities: {
      india: [
        "Data Scientist",
        "Business Analyst",
        "AI Consultant"
      ],
      international: [
        "Machine Learning Engineer",
        "Business Intelligence Analyst"
      ]
    },
    salary_scope: {
      india: {
        entry_level: "₹6–8 LPA",
        mid_level: "₹12–18 LPA",
        senior_level: "₹25+ LPA"
      },
      international: {
        entry_level: "$70k–90k",
        mid_level: "$120k–140k",
        senior_level: "$170k+"
      }
    },
    future_scope: "One of the hottest fields today, with applications across finance, e-commerce, and healthcare."
  },
           // Commerce Programs (12 programs)
         {
           id: "commerce-1",
           name: "B.Com",
           overview: "B.Com is designed to provide students with knowledge and skills relevant to the field of Commerce. The curriculum balances theoretical foundations with practical applications.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Financial Accounting",
             "Business Economics",
             "Business Law",
             "Marketing Management",
             "Cost Accounting",
             "Income Tax",
             "Business Statistics",
             "Corporate Accounting"
           ],
           skills_gained: [
             "Analytical Thinking",
             "Communication Skills",
             "Financial Analysis",
             "Problem Solving",
             "Business Acumen"
           ],
           tools_and_technologies: [
             "Tally ERP",
             "MS Excel",
             "QuickBooks",
             "SAP Basics",
             "Business Analytics Tools"
           ],
           career_opportunities: {
             india: [
               "Accountant",
               "Financial Analyst",
               "Tax Consultant",
               "Business Consultant",
               "Entrepreneur"
             ],
             international: [
               "Financial Controller",
               "Business Analyst",
               "Audit Manager",
               "Corporate Finance Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹2.5–4.5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$35,000–$55,000 per year",
               mid_level: "$70,000–$100,000 per year",
               senior_level: "$120,000+ per year"
             }
           },
           future_scope: "The future scope of B.Com includes opportunities in research, higher education, professional certifications, and diverse career paths in both domestic and global industries."
         },
         {
           id: "commerce-2",
           name: "B.Com (Accounting and Finance)",
           overview: "Specialized program focusing on advanced accounting principles, financial management, and investment analysis.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Advanced Financial Accounting",
             "Corporate Finance",
             "Investment Analysis",
             "Financial Markets",
             "Risk Management",
             "International Finance",
             "Financial Modeling",
             "Auditing and Assurance"
           ],
           skills_gained: [
             "Financial Modeling",
             "Investment Analysis",
             "Risk Assessment",
             "Financial Reporting",
             "Strategic Financial Planning"
           ],
           tools_and_technologies: [
             "Bloomberg Terminal",
             "MS Excel Advanced",
             "QuickBooks Enterprise",
             "SAP Financials",
             "Financial Modeling Software"
           ],
           career_opportunities: {
             india: [
               "Financial Analyst",
               "Investment Banker",
               "Risk Manager",
               "Financial Controller",
               "Portfolio Manager"
             ],
             international: [
               "Investment Analyst",
               "Financial Advisor",
               "Treasury Manager",
               "Corporate Finance Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹8–15 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "High demand in financial services, investment banking, and corporate finance. Excellent foundation for CFA, FRM, and MBA in Finance."
         },
         {
           id: "commerce-3",
           name: "B.Com (Banking and Insurance)",
           overview: "Comprehensive program covering banking operations, insurance principles, risk management, and financial services.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Banking Operations",
             "Insurance Principles",
             "Risk Management",
             "Financial Services",
             "Credit Analysis",
             "Insurance Law",
             "Banking Regulations",
             "Financial Markets"
           ],
           skills_gained: [
             "Credit Analysis",
             "Risk Assessment",
             "Customer Relationship Management",
             "Financial Product Knowledge",
             "Regulatory Compliance"
           ],
           tools_and_technologies: [
             "Core Banking Systems",
             "Insurance Management Software",
             "Risk Assessment Tools",
             "Customer Relationship Management",
             "Financial Analysis Software"
           ],
           career_opportunities: {
             india: [
               "Bank Officer",
               "Insurance Agent",
               "Credit Analyst",
               "Risk Manager",
               "Financial Advisor"
             ],
             international: [
               "Banking Officer",
               "Insurance Underwriter",
               "Risk Analyst",
               "Financial Services Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–4.5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "Growing demand in banking, insurance, and financial services sector. Opportunities in fintech and digital banking."
         },
         {
           id: "commerce-4",
           name: "B.Com (E-Commerce)",
           overview: "Modern program integrating traditional commerce with digital technologies, online business models, and e-commerce strategies.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "E-Commerce Fundamentals",
             "Digital Marketing",
             "Web Development",
             "Online Business Models",
             "Digital Payment Systems",
             "E-Commerce Law",
             "Supply Chain Management",
             "Business Analytics"
           ],
           skills_gained: [
             "Digital Marketing",
             "E-Commerce Platform Management",
             "Online Business Strategy",
             "Digital Analytics",
             "E-Commerce Operations"
           ],
           tools_and_technologies: [
             "Shopify",
             "WooCommerce",
             "Google Analytics",
             "Social Media Platforms",
             "Payment Gateway Systems"
           ],
           career_opportunities: {
             india: [
               "E-Commerce Manager",
               "Digital Marketing Specialist",
               "Online Business Analyst",
               "E-Commerce Consultant",
               "Digital Business Developer"
             ],
             international: [
               "E-Commerce Specialist",
               "Digital Business Analyst",
               "Online Marketing Manager",
               "E-Commerce Strategist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Rapidly growing field with increasing digital transformation. High demand in startups, e-commerce companies, and digital agencies."
         },
         {
           id: "commerce-5",
           name: "B.Com (International Business)",
           overview: "Global business program covering international trade, cross-cultural management, and global market strategies.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "International Trade",
             "Global Marketing",
             "Cross-Cultural Management",
             "International Finance",
             "Export-Import Procedures",
             "Global Supply Chain",
             "International Business Law",
             "Foreign Exchange Management"
           ],
           skills_gained: [
             "Cross-Cultural Communication",
             "International Trade Operations",
             "Global Market Analysis",
             "Export-Import Documentation",
             "International Business Strategy"
           ],
           tools_and_technologies: [
             "International Trade Software",
             "Global Market Research Tools",
             "Cross-Cultural Communication Platforms",
             "Export-Import Documentation Systems",
             "Global Business Analytics"
           ],
           career_opportunities: {
             india: [
               "International Business Manager",
               "Export-Import Manager",
               "Global Marketing Specialist",
               "International Trade Analyst",
               "Cross-Cultural Consultant"
             ],
             international: [
               "International Business Analyst",
               "Global Trade Specialist",
               "International Marketing Manager",
               "Global Business Consultant"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹8–15 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$45,000–$70,000 per year",
               mid_level: "$80,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "Excellent opportunities in multinational companies, international trade, and global business consulting."
         },
         {
           id: "commerce-6",
           name: "B.Com (Marketing)",
           overview: "Specialized program focusing on marketing strategies, consumer behavior, brand management, and digital marketing.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Marketing Management",
             "Consumer Behavior",
             "Brand Management",
             "Digital Marketing",
             "Market Research",
             "Advertising and Promotion",
             "Sales Management",
             "Marketing Analytics"
           ],
           skills_gained: [
             "Market Research",
             "Brand Strategy",
             "Digital Marketing",
             "Consumer Insights",
             "Marketing Campaign Management"
           ],
           tools_and_technologies: [
             "Google Analytics",
             "Social Media Platforms",
             "Marketing Automation Tools",
             "CRM Systems",
             "Market Research Software"
           ],
           career_opportunities: {
             india: [
               "Marketing Manager",
               "Brand Manager",
               "Digital Marketing Specialist",
               "Market Research Analyst",
               "Sales Manager"
             ],
             international: [
               "Marketing Specialist",
               "Brand Strategist",
               "Digital Marketing Manager",
               "Market Analyst",
               "Marketing Consultant"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "High demand in digital marketing, brand management, and market research. Growing opportunities in startups and digital agencies."
         },
         {
           id: "commerce-7",
           name: "B.Com (Taxation)",
           overview: "Specialized program covering tax laws, tax planning, compliance, and tax advisory services.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Income Tax Law",
             "Corporate Tax",
             "GST and Indirect Taxes",
             "Tax Planning",
             "Tax Compliance",
             "International Taxation",
             "Tax Audit",
             "Tax Litigation"
           ],
           skills_gained: [
             "Tax Planning",
             "Tax Compliance",
             "Tax Audit",
             "Tax Advisory",
             "Tax Litigation Support"
           ],
           tools_and_technologies: [
             "Tax Software",
             "Accounting Software",
             "Compliance Management Tools",
             "Tax Research Databases",
             "Document Management Systems"
           ],
           career_opportunities: {
             india: [
               "Tax Consultant",
               "Tax Analyst",
               "Tax Auditor",
               "Tax Advisor",
               "Tax Litigation Specialist"
             ],
             international: [
               "Tax Specialist",
               "Tax Consultant",
               "Tax Advisor",
               "International Tax Expert"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹8–15 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$45,000–$70,000 per year",
               mid_level: "$80,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "High demand in tax consulting, corporate tax departments, and tax advisory services. Excellent foundation for CA and tax certifications."
         },
         {
           id: "commerce-8",
           name: "B.Com (Human Resource Management)",
           overview: "Program focusing on human resource management, organizational behavior, and people management strategies.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Human Resource Management",
             "Organizational Behavior",
             "Recruitment and Selection",
             "Training and Development",
             "Performance Management",
             "Compensation and Benefits",
             "Employee Relations",
             "HR Analytics"
           ],
           skills_gained: [
             "Recruitment and Selection",
             "Training and Development",
             "Performance Management",
             "Employee Relations",
             "HR Analytics"
           ],
           tools_and_technologies: [
             "HR Management Systems",
             "Recruitment Software",
             "Performance Management Tools",
             "HR Analytics Platforms",
             "Employee Engagement Tools"
           ],
           career_opportunities: {
             india: [
               "HR Manager",
               "Recruitment Specialist",
               "Training Coordinator",
               "HR Analyst",
               "Employee Relations Manager"
             ],
             international: [
               "HR Specialist",
               "Recruitment Manager",
               "Training Manager",
               "HR Consultant",
               "People Operations Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Growing demand in HR technology, talent management, and organizational development. Opportunities in startups and corporate HR departments."
         },
         {
           id: "commerce-9",
           name: "B.Com (Supply Chain Management)",
           overview: "Program covering supply chain operations, logistics, inventory management, and supply chain optimization.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Supply Chain Management",
             "Logistics Management",
             "Inventory Management",
             "Procurement",
             "Warehouse Management",
             "Transportation Management",
             "Supply Chain Analytics",
             "Global Supply Chain"
           ],
           skills_gained: [
             "Supply Chain Planning",
             "Logistics Operations",
             "Inventory Optimization",
             "Procurement Management",
             "Supply Chain Analytics"
           ],
           tools_and_technologies: [
             "Supply Chain Software",
             "Logistics Management Systems",
             "Inventory Management Tools",
             "Procurement Platforms",
             "Supply Chain Analytics"
           ],
           career_opportunities: {
             india: [
               "Supply Chain Manager",
               "Logistics Manager",
               "Procurement Specialist",
               "Inventory Manager",
               "Supply Chain Analyst"
             ],
             international: [
               "Supply Chain Specialist",
               "Logistics Coordinator",
               "Procurement Manager",
               "Supply Chain Consultant",
               "Operations Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "High demand in e-commerce, manufacturing, and retail sectors. Growing opportunities in supply chain technology and optimization."
         },
         {
           id: "commerce-10",
           name: "B.Com (Business Analytics)",
           overview: "Program integrating business knowledge with data analytics, statistical analysis, and business intelligence.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Business Analytics",
             "Statistical Analysis",
             "Data Visualization",
             "Predictive Modeling",
             "Business Intelligence",
             "Data Mining",
             "Business Statistics",
             "Analytics Tools"
           ],
           skills_gained: [
             "Data Analysis",
             "Statistical Modeling",
             "Data Visualization",
             "Business Intelligence",
             "Predictive Analytics"
           ],
           tools_and_technologies: [
             "Python",
             "R",
             "Tableau",
             "PowerBI",
             "Excel Advanced",
             "SQL"
           ],
           career_opportunities: {
             india: [
               "Business Analyst",
               "Data Analyst",
               "Business Intelligence Analyst",
               "Analytics Consultant",
               "Data Scientist"
             ],
             international: [
               "Business Analyst",
               "Data Analyst",
               "Business Intelligence Specialist",
               "Analytics Consultant",
               "Data Scientist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹4–6 LPA",
               mid_level: "₹8–18 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$50,000–$70,000 per year",
               mid_level: "$85,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "One of the fastest-growing fields with high demand in consulting, finance, and technology sectors."
         },
         {
           id: "commerce-11",
           name: "B.Com (Financial Services)",
           overview: "Program focusing on financial services, investment management, and financial product knowledge.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Financial Services",
             "Investment Management",
             "Financial Markets",
             "Risk Management",
             "Financial Planning",
             "Insurance Services",
             "Mutual Funds",
             "Financial Regulations"
           ],
           skills_gained: [
             "Financial Planning",
             "Investment Analysis",
             "Risk Assessment",
             "Financial Product Knowledge",
             "Regulatory Compliance"
           ],
           tools_and_technologies: [
             "Financial Planning Software",
             "Investment Analysis Tools",
             "Risk Management Systems",
             "Financial Market Platforms",
             "Compliance Management Tools"
           ],
           career_opportunities: {
             india: [
               "Financial Advisor",
               "Investment Analyst",
               "Risk Manager",
               "Financial Planner",
               "Insurance Advisor"
             ],
             international: [
               "Financial Advisor",
               "Investment Specialist",
               "Risk Analyst",
               "Financial Planner",
               "Wealth Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹8–15 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$45,000–$70,000 per year",
               mid_level: "$80,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "High demand in financial services, wealth management, and investment advisory. Growing opportunities in fintech and digital financial services."
         },
         {
           id: "commerce-12",
           name: "B.Com (Entrepreneurship)",
           overview: "Program designed to develop entrepreneurial skills, business planning, and startup management.",
           department: "commerce",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Entrepreneurship",
             "Business Planning",
             "Startup Management",
             "Innovation Management",
             "Business Model Canvas",
             "Funding and Finance",
             "Marketing for Startups",
             "Legal Aspects of Business"
           ],
           skills_gained: [
             "Business Planning",
             "Startup Strategy",
             "Innovation Management",
             "Funding Strategies",
             "Business Model Development"
           ],
           tools_and_technologies: [
             "Business Model Canvas",
             "Financial Modeling Tools",
             "Project Management Software",
             "Marketing Automation",
             "Business Planning Software"
           ],
           career_opportunities: {
             india: [
               "Entrepreneur",
               "Startup Founder",
               "Business Consultant",
               "Innovation Manager",
               "Business Development Manager"
             ],
             international: [
               "Entrepreneur",
               "Startup Consultant",
               "Innovation Specialist",
               "Business Development Manager",
               "Venture Capital Analyst"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Excellent foundation for starting own business, working in startups, or pursuing entrepreneurship education. High demand in innovation and startup ecosystem."
         },
           // Fashion & Visual Arts Programs (3 programs)
         {
           id: "fashion-1",
           name: "B.Sc Costume Design and Fashion",
           overview: "B.Sc Costume Design and Fashion focuses on creative design, fashion technology, and costume creation for various industries.",
           department: "costume-design",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Fashion Design",
             "Costume History",
             "Textile Science",
             "Pattern Making",
             "Garment Construction",
             "Fashion Illustration",
             "Color Theory",
             "Fashion Marketing"
           ],
           skills_gained: [
             "Creative Design",
             "Pattern Making",
             "Textile Knowledge",
             "Fashion Illustration",
             "Trend Analysis"
           ],
           tools_and_technologies: [
             "Design Software",
             "Sewing Machines",
             "Pattern Making Tools",
             "Textile Testing Equipment",
             "Fashion Design Apps"
           ],
           career_opportunities: {
             india: [
               "Fashion Designer",
               "Costume Designer",
               "Textile Designer",
               "Fashion Consultant",
               "Pattern Maker"
             ],
             international: [
               "Fashion Designer",
               "Costume Designer",
               "Textile Artist",
               "Fashion Consultant"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹2.5–4 LPA",
               mid_level: "₹5–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$35,000–$55,000 per year",
               mid_level: "$60,000–$90,000 per year",
               senior_level: "$120,000+ per year"
             }
           },
           future_scope: "Excellent prospects in fashion industry, film industry, and creative design with opportunities in sustainable fashion and digital design."
         },
         {
           id: "fashion-2",
           name: "B.Sc Visual Communication (Electronic Media)",
           overview: "B.Sc Visual Communication focuses on digital media, graphic design, and electronic communication technologies.",
           department: "visual-communications",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Digital Design",
             "Graphic Design",
             "Web Design",
             "Video Production",
             "Animation",
             "Digital Marketing",
             "User Experience Design",
             "Media Production"
           ],
           skills_gained: [
             "Digital Design",
             "Graphic Design",
             "Video Production",
             "Web Design",
             "Animation"
           ],
           tools_and_technologies: [
             "Adobe Creative Suite",
             "Video Editing Software",
             "3D Animation Tools",
             "Web Design Platforms",
             "Digital Marketing Tools"
           ],
           career_opportunities: {
             india: [
               "Graphic Designer",
               "Digital Artist",
               "Video Editor",
               "Web Designer",
               "Animation Artist"
             ],
             international: [
               "Digital Designer",
               "Visual Artist",
               "Media Producer",
               "UX Designer",
               "Creative Director"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in digital media, advertising, and creative industries. Growing opportunities in UX/UI design and digital marketing."
         },
         {
           id: "fashion-3",
           name: "B.Sc Interior Design and Decoration",
           overview: "Program focusing on interior design principles, space planning, and decorative arts for residential and commercial spaces.",
           department: "visual-communications",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Interior Design Principles",
             "Space Planning",
             "Color Theory",
             "Furniture Design",
             "Lighting Design",
             "Material Science",
             "Building Codes",
             "Sustainable Design"
           ],
           skills_gained: [
             "Space Planning",
             "3D Modeling",
             "Material Selection",
             "Lighting Design",
             "Project Management"
           ],
           tools_and_technologies: [
             "AutoCAD",
             "SketchUp",
             "3D Studio Max",
             "Revit",
             "Interior Design Software"
           ],
           career_opportunities: {
             india: [
               "Interior Designer",
               "Space Planner",
               "Furniture Designer",
               "Lighting Designer",
               "Project Manager"
             ],
             international: [
               "Interior Designer",
               "Space Designer",
               "Furniture Specialist",
               "Lighting Consultant",
               "Design Project Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Growing demand in residential, commercial, and hospitality design. Opportunities in sustainable design and smart home technology."
         },
         // Management Programs (6 programs)
         {
           id: "management-1",
           name: "BBA (Bachelor of Business Administration)",
           overview: "Comprehensive undergraduate program covering business fundamentals, management principles, and organizational behavior.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Business Management",
             "Marketing Management",
             "Financial Management",
             "Human Resource Management",
             "Operations Management",
             "Business Ethics",
             "Business Communication",
             "Strategic Management"
           ],
           skills_gained: [
             "Leadership Skills",
             "Business Analysis",
             "Strategic Thinking",
             "Communication Skills",
             "Problem Solving"
           ],
           tools_and_technologies: [
             "MS Office Suite",
             "Business Analytics Tools",
             "Project Management Software",
             "CRM Systems",
             "Financial Modeling Tools"
           ],
           career_opportunities: {
             india: [
               "Business Analyst",
               "Management Trainee",
               "Marketing Executive",
               "HR Executive",
               "Operations Executive"
             ],
             international: [
               "Business Analyst",
               "Management Consultant",
               "Marketing Specialist",
               "HR Specialist",
               "Operations Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "Excellent foundation for MBA and corporate careers. High demand in startups, consulting, and corporate sector."
         },
         {
           id: "management-2",
           name: "BBA (Finance)",
           overview: "Specialized program focusing on financial management, investment analysis, and financial services.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Financial Management",
             "Investment Analysis",
             "Financial Markets",
             "Risk Management",
             "Corporate Finance",
             "Financial Modeling",
             "Portfolio Management",
             "Financial Regulations"
           ],
           skills_gained: [
             "Financial Analysis",
             "Investment Management",
             "Risk Assessment",
             "Financial Modeling",
             "Portfolio Management"
           ],
           tools_and_technologies: [
             "Excel Advanced",
             "Financial Modeling Software",
             "Bloomberg Terminal",
             "Risk Management Tools",
             "Portfolio Management Systems"
           ],
           career_opportunities: {
             india: [
               "Financial Analyst",
               "Investment Analyst",
               "Risk Manager",
               "Portfolio Manager",
               "Financial Advisor"
             ],
             international: [
               "Financial Analyst",
               "Investment Specialist",
               "Risk Analyst",
               "Portfolio Manager",
               "Financial Consultant"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "High demand in financial services, investment banking, and corporate finance. Excellent foundation for CFA and MBA in Finance."
         },
         {
           id: "management-3",
           name: "BBA (Marketing)",
           overview: "Program focusing on marketing strategies, consumer behavior, brand management, and digital marketing.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Marketing Management",
             "Consumer Behavior",
             "Brand Management",
             "Digital Marketing",
             "Market Research",
             "Advertising and Promotion",
             "Sales Management",
             "Marketing Analytics"
           ],
           skills_gained: [
             "Market Research",
             "Brand Strategy",
             "Digital Marketing",
             "Consumer Insights",
             "Marketing Campaign Management"
           ],
           tools_and_technologies: [
             "Google Analytics",
             "Social Media Platforms",
             "Marketing Automation Tools",
             "CRM Systems",
             "Market Research Software"
           ],
           career_opportunities: {
             india: [
               "Marketing Executive",
               "Brand Manager",
               "Digital Marketing Specialist",
               "Market Research Analyst",
               "Sales Executive"
             ],
             international: [
               "Marketing Specialist",
               "Brand Strategist",
               "Digital Marketing Manager",
               "Market Analyst",
               "Marketing Consultant"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "High demand in digital marketing, brand management, and market research. Growing opportunities in startups and digital agencies."
         },
         {
           id: "management-4",
           name: "BBA (Human Resource Management)",
           overview: "Program focusing on human resource management, organizational behavior, and people management strategies.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Human Resource Management",
             "Organizational Behavior",
             "Recruitment and Selection",
             "Training and Development",
             "Performance Management",
             "Compensation and Benefits",
             "Employee Relations",
             "HR Analytics"
           ],
           skills_gained: [
             "Recruitment and Selection",
             "Training and Development",
             "Performance Management",
             "Employee Relations",
             "HR Analytics"
           ],
           tools_and_technologies: [
             "HR Management Systems",
             "Recruitment Software",
             "Performance Management Tools",
             "HR Analytics Platforms",
             "Employee Engagement Tools"
           ],
           career_opportunities: {
             india: [
               "HR Executive",
               "Recruitment Specialist",
               "Training Coordinator",
               "HR Analyst",
               "Employee Relations Executive"
             ],
             international: [
               "HR Specialist",
               "Recruitment Manager",
               "Training Manager",
               "HR Consultant",
               "People Operations Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Growing demand in HR technology, talent management, and organizational development. Opportunities in startups and corporate HR departments."
         },
         {
           id: "management-5",
           name: "BBA (International Business)",
           overview: "Program covering international business, global markets, and cross-cultural management.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "International Business",
             "Global Marketing",
             "Cross-Cultural Management",
             "International Finance",
             "Global Supply Chain",
             "International Trade",
             "Global Business Strategy",
             "International Law"
           ],
           skills_gained: [
             "Cross-Cultural Communication",
             "Global Business Strategy",
             "International Trade",
             "Global Market Analysis",
             "Cross-Cultural Management"
           ],
           tools_and_technologies: [
             "International Business Software",
             "Global Market Research Tools",
             "Cross-Cultural Communication Platforms",
             "International Trade Systems",
             "Global Business Analytics"
           ],
           career_opportunities: {
             india: [
               "International Business Analyst",
               "Export-Import Executive",
               "Global Marketing Executive",
               "International Trade Specialist",
               "Cross-Cultural Consultant"
             ],
             international: [
               "International Business Specialist",
               "Global Trade Analyst",
               "International Marketing Manager",
               "Global Business Consultant",
               "Cross-Cultural Manager"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$70,000 per year",
               mid_level: "$80,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "Excellent opportunities in multinational companies, international trade, and global business consulting."
         },
         {
           id: "management-6",
           name: "BBA (Entrepreneurship)",
           overview: "Program designed to develop entrepreneurial skills, business planning, and startup management.",
           department: "management",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Entrepreneurship",
             "Business Planning",
             "Startup Management",
             "Innovation Management",
             "Business Model Canvas",
             "Funding and Finance",
             "Marketing for Startups",
             "Legal Aspects of Business"
           ],
           skills_gained: [
             "Business Planning",
             "Startup Strategy",
             "Innovation Management",
             "Funding Strategies",
             "Business Model Development"
           ],
           tools_and_technologies: [
             "Business Model Canvas",
             "Financial Modeling Tools",
             "Project Management Software",
             "Marketing Automation",
             "Business Planning Software"
           ],
           career_opportunities: {
             india: [
               "Entrepreneur",
               "Startup Founder",
               "Business Consultant",
               "Innovation Manager",
               "Business Development Executive"
             ],
             international: [
               "Entrepreneur",
               "Startup Consultant",
               "Innovation Specialist",
               "Business Development Manager",
               "Venture Capital Analyst"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3.5–5 LPA",
               mid_level: "₹7–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$45,000–$65,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Excellent foundation for starting own business, working in startups, or pursuing entrepreneurship education. High demand in innovation and startup ecosystem."
         },
           // English & Humanities Programs (2 programs)
         {
           id: "english-1",
           name: "BA English Literature",
           overview: "Program focusing on English literature, literary analysis, and critical thinking skills.",
           department: "english",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "English Literature",
             "Literary Theory",
             "Creative Writing",
             "Shakespeare Studies",
             "Modern Literature",
             "Poetry Analysis",
             "Prose Fiction",
             "Literary Criticism"
           ],
           skills_gained: [
             "Critical Analysis",
             "Creative Writing",
             "Literary Research",
             "Communication Skills",
             "Analytical Thinking"
           ],
           tools_and_technologies: [
             "Literature Databases",
             "Writing Software",
             "Research Tools",
             "Digital Libraries",
             "Citation Management"
           ],
           career_opportunities: {
             india: [
               "Content Writer",
               "Editor",
               "Teacher",
               "Journalist",
               "Copywriter"
             ],
             international: [
               "Content Creator",
               "Editor",
               "Teacher",
               "Journalist",
               "Literary Agent"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹2.5–4 LPA",
               mid_level: "₹5–10 LPA",
               senior_level: "₹12–20+ LPA"
             },
             international: {
               entry_level: "$35,000–$50,000 per year",
               mid_level: "$60,000–$90,000 per year",
               senior_level: "$110,000+ per year"
             }
           },
           future_scope: "High demand in content creation, digital marketing, and education. Opportunities in publishing and media industries."
         },
         {
           id: "english-2",
           name: "MA English Literature",
           overview: "Advanced postgraduate program in English literature, research, and literary criticism.",
           department: "english",
           level: "postgraduate",
           duration: "2 years",
           core_subjects: [
             "Advanced Literary Theory",
             "Research Methodology",
             "Contemporary Literature",
             "Postcolonial Studies",
             "Feminist Literature",
             "Comparative Literature",
             "Literary Criticism",
             "Thesis Writing"
           ],
           skills_gained: [
             "Advanced Research",
             "Critical Analysis",
             "Academic Writing",
             "Literary Scholarship",
             "Teaching Skills"
           ],
           tools_and_technologies: [
             "Academic Databases",
             "Research Software",
             "Digital Archives",
             "Citation Tools",
             "Academic Writing Platforms"
           ],
           career_opportunities: {
             india: [
               "Professor",
               "Research Scholar",
               "Academic Writer",
               "Editor",
               "Literary Critic"
             ],
             international: [
               "Professor",
               "Researcher",
               "Academic Writer",
               "Editor",
               "Literary Scholar"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹4–6 LPA",
               mid_level: "₹8–15 LPA",
               senior_level: "₹18–30+ LPA"
             },
             international: {
               entry_level: "$50,000–$70,000 per year",
               mid_level: "$80,000–$120,000 per year",
               senior_level: "$140,000+ per year"
             }
           },
           future_scope: "Excellent prospects in academia, research, and publishing. High demand in higher education and literary research."
         },
           // Mathematics Programs (2 programs)
         {
           id: "math-1",
           name: "B.Sc Mathematics",
           overview: "Program focusing on mathematical theory, analysis, and problem-solving skills.",
           department: "mathematics",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Calculus",
             "Linear Algebra",
             "Abstract Algebra",
             "Real Analysis",
             "Number Theory",
             "Differential Equations",
             "Mathematical Statistics",
             "Discrete Mathematics"
           ],
           skills_gained: [
             "Mathematical Reasoning",
             "Problem Solving",
             "Analytical Thinking",
             "Logical Analysis",
             "Mathematical Modeling"
           ],
           tools_and_technologies: [
             "MATLAB",
             "Python",
             "R",
             "Mathematica",
             "Statistical Software"
           ],
           career_opportunities: {
             india: [
               "Mathematician",
               "Data Analyst",
               "Actuary",
               "Teacher",
               "Research Analyst"
             ],
             international: [
               "Mathematician",
               "Data Scientist",
               "Actuary",
               "Teacher",
               "Research Analyst"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in data science, finance, and research. Excellent foundation for advanced studies in mathematics and related fields."
         },
         {
           id: "math-2",
           name: "M.Sc Mathematics",
           overview: "Advanced postgraduate program in mathematics, research, and mathematical applications.",
           department: "mathematics",
           level: "postgraduate",
           duration: "2 years",
           core_subjects: [
             "Advanced Analysis",
             "Abstract Algebra",
             "Topology",
             "Functional Analysis",
             "Mathematical Modeling",
             "Research Methods",
             "Specialized Topics",
             "Thesis Research"
           ],
           skills_gained: [
             "Advanced Mathematical Research",
             "Mathematical Modeling",
             "Research Methodology",
             "Academic Writing",
             "Teaching Skills"
           ],
           tools_and_technologies: [
             "Advanced Mathematical Software",
             "Research Tools",
             "Academic Databases",
             "Computational Platforms",
             "Research Collaboration Tools"
           ],
           career_opportunities: {
             india: [
               "Professor",
               "Research Scientist",
               "Mathematical Consultant",
               "Data Scientist",
               "Actuary"
             ],
             international: [
               "Professor",
               "Research Scientist",
               "Mathematical Consultant",
               "Data Scientist",
               "Research Analyst"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹5–7 LPA",
               mid_level: "₹10–18 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$55,000–$75,000 per year",
               mid_level: "$90,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "Excellent prospects in academia, research, and applied mathematics. High demand in data science, finance, and technology sectors."
         },
           // Physics Programs (1 program)
         {
           id: "physics-1",
           name: "M.Sc Physics",
           overview: "Advanced postgraduate program in physics, research, and experimental physics.",
           department: "physics",
           level: "postgraduate",
           duration: "2 years",
           core_subjects: [
             "Advanced Mechanics",
             "Quantum Mechanics",
             "Electromagnetism",
             "Statistical Physics",
             "Nuclear Physics",
             "Experimental Physics",
             "Research Methods",
             "Thesis Research"
           ],
           skills_gained: [
             "Advanced Physics Research",
             "Experimental Design",
             "Data Analysis",
             "Research Methodology",
             "Teaching Skills"
           ],
           tools_and_technologies: [
             "Physics Laboratory Equipment",
             "Data Analysis Software",
             "Simulation Tools",
             "Research Instruments",
             "Computational Platforms"
           ],
           career_opportunities: {
             india: [
               "Professor",
               "Research Scientist",
               "Physics Consultant",
               "Laboratory Manager",
               "Technical Specialist"
             ],
             international: [
               "Professor",
               "Research Scientist",
               "Physics Consultant",
               "Laboratory Manager",
               "Research Analyst"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹5–7 LPA",
               mid_level: "₹10–18 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$55,000–$75,000 per year",
               mid_level: "$90,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "Excellent prospects in academia, research, and applied physics. High demand in research institutions, technology companies, and educational institutions."
         },
           // Psychology Programs (3 programs)
         {
           id: "psychology-1",
           name: "B.Sc Psychology",
           overview: "Program focusing on human behavior, mental processes, and psychological research.",
           department: "psychology",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "General Psychology",
             "Developmental Psychology",
             "Social Psychology",
             "Cognitive Psychology",
             "Abnormal Psychology",
             "Research Methods",
             "Statistics",
             "Psychological Testing"
           ],
           skills_gained: [
             "Psychological Assessment",
             "Research Skills",
             "Critical Thinking",
             "Communication Skills",
             "Data Analysis"
           ],
           tools_and_technologies: [
             "Statistical Software",
             "Psychological Testing Tools",
             "Research Platforms",
             "Data Collection Tools",
             "Assessment Instruments"
           ],
           career_opportunities: {
             india: [
               "Psychology Assistant",
               "Research Assistant",
               "Counseling Aide",
               "HR Assistant",
               "Social Worker"
             ],
             international: [
               "Psychology Assistant",
               "Research Assistant",
               "Counseling Aide",
               "HR Assistant",
               "Social Worker"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$35,000–$55,000 per year",
               mid_level: "$60,000–$90,000 per year",
               senior_level: "$110,000+ per year"
             }
           },
           future_scope: "High demand in mental health, education, and corporate sectors. Excellent foundation for advanced studies in psychology and related fields."
         },
         {
           id: "psychology-2",
           name: "M.Sc Psychology",
           overview: "Advanced postgraduate program in psychology, research, and specialized psychological practice.",
           department: "psychology",
           level: "postgraduate",
           duration: "2 years",
           core_subjects: [
             "Advanced Psychology",
             "Clinical Psychology",
             "Counseling Psychology",
             "Industrial Psychology",
             "Research Methodology",
             "Psychological Assessment",
             "Thesis Research",
             "Specialized Topics"
           ],
           skills_gained: [
             "Advanced Psychological Assessment",
             "Clinical Skills",
             "Research Methodology",
             "Counseling Techniques",
             "Teaching Skills"
           ],
           tools_and_technologies: [
             "Advanced Assessment Tools",
             "Clinical Software",
             "Research Platforms",
             "Statistical Analysis Tools",
             "Clinical Databases"
           ],
           career_opportunities: {
             india: [
               "Clinical Psychologist",
               "Counseling Psychologist",
               "Industrial Psychologist",
               "Professor",
               "Research Psychologist"
             ],
             international: [
               "Clinical Psychologist",
               "Counseling Psychologist",
               "Industrial Psychologist",
               "Professor",
               "Research Psychologist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹5–7 LPA",
               mid_level: "₹10–18 LPA",
               senior_level: "₹20–35+ LPA"
             },
             international: {
               entry_level: "$55,000–$75,000 per year",
               mid_level: "$90,000–$130,000 per year",
               senior_level: "$150,000+ per year"
             }
           },
           future_scope: "Excellent prospects in clinical practice, research, and academia. High demand in mental health, corporate, and educational sectors."
         },
         {
           id: "psychology-3",
           name: "M.Sc Clinical Psychology",
           overview: "Specialized postgraduate program in clinical psychology, assessment, and therapeutic interventions.",
           department: "psychology",
           level: "postgraduate",
           duration: "2 years",
           core_subjects: [
             "Clinical Assessment",
             "Psychopathology",
             "Therapeutic Interventions",
             "Clinical Research",
             "Ethics in Psychology",
             "Supervised Practice",
             "Case Studies",
             "Thesis Research"
           ],
           skills_gained: [
             "Clinical Assessment",
             "Therapeutic Interventions",
             "Case Formulation",
             "Clinical Research",
             "Ethical Practice"
           ],
           tools_and_technologies: [
             "Clinical Assessment Tools",
             "Therapy Software",
             "Research Platforms",
             "Clinical Databases",
             "Assessment Instruments"
           ],
           career_opportunities: {
             india: [
               "Clinical Psychologist",
               "Therapist",
               "Clinical Researcher",
               "Professor",
               "Mental Health Specialist"
             ],
             international: [
               "Clinical Psychologist",
               "Therapist",
               "Clinical Researcher",
               "Professor",
               "Mental Health Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹6–8 LPA",
               mid_level: "₹12–20 LPA",
               senior_level: "₹25–40+ LPA"
             },
             international: {
               entry_level: "$60,000–$80,000 per year",
               mid_level: "$100,000–$140,000 per year",
               senior_level: "$160,000+ per year"
             }
           },
           future_scope: "High demand in mental health, hospitals, and private practice. Excellent prospects in clinical research and mental health advocacy."
         },
           // Bio-Science Programs (4 programs)
         {
           id: "bio-1",
           name: "B.Sc Biotechnology",
           overview: "Program focusing on biological technology, genetic engineering, and bioprocessing.",
           department: "bio-science",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Molecular Biology",
             "Genetic Engineering",
             "Bioprocessing",
             "Cell Biology",
             "Microbiology",
             "Biochemistry",
             "Bioinformatics",
             "Laboratory Techniques"
           ],
           skills_gained: [
             "Laboratory Techniques",
             "Genetic Engineering",
             "Bioprocessing",
             "Data Analysis",
             "Research Skills"
           ],
           tools_and_technologies: [
             "Laboratory Equipment",
             "DNA Analysis Tools",
             "Bioinformatics Software",
             "Microscopes",
             "PCR Machines"
           ],
           career_opportunities: {
             india: [
               "Biotechnologist",
               "Research Assistant",
               "Laboratory Technician",
               "Quality Control Analyst",
               "Production Assistant"
             ],
             international: [
               "Biotechnologist",
               "Research Assistant",
               "Laboratory Technician",
               "Quality Control Analyst",
               "Production Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in pharmaceutical, agricultural, and research sectors. Growing opportunities in genetic engineering and bioinformatics."
         },
         {
           id: "bio-2",
           name: "B.Sc Microbiology",
           overview: "Program focusing on microorganisms, their biology, and applications in various industries.",
           department: "bio-science",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "General Microbiology",
             "Medical Microbiology",
             "Industrial Microbiology",
             "Microbial Genetics",
             "Immunology",
             "Virology",
             "Laboratory Techniques",
             "Microbial Ecology"
           ],
           skills_gained: [
             "Microbial Culture",
             "Laboratory Techniques",
             "Microscopy",
             "Data Analysis",
             "Research Skills"
           ],
           tools_and_technologies: [
             "Microscopes",
             "Incubators",
             "Autoclaves",
             "Microbial Culture Media",
             "Laboratory Equipment"
           ],
           career_opportunities: {
             india: [
               "Microbiologist",
               "Laboratory Technician",
               "Quality Control Analyst",
               "Research Assistant",
               "Production Assistant"
             ],
             international: [
               "Microbiologist",
               "Laboratory Technician",
               "Quality Control Analyst",
               "Research Assistant",
               "Production Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in pharmaceutical, food, and environmental industries. Growing opportunities in medical microbiology and research."
         },
         {
           id: "bio-3",
           name: "B.Sc Biochemistry",
           overview: "Program focusing on chemical processes in living organisms and molecular biology.",
           department: "bio-science",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Biochemistry",
             "Molecular Biology",
             "Enzymology",
             "Metabolism",
             "Cell Biology",
             "Laboratory Techniques",
             "Analytical Chemistry",
             "Biophysical Chemistry"
           ],
           skills_gained: [
             "Biochemical Analysis",
             "Laboratory Techniques",
             "Data Analysis",
             "Research Skills",
             "Analytical Thinking"
           ],
           tools_and_technologies: [
             "Spectrophotometers",
             "Centrifuges",
             "Chromatography Equipment",
             "Laboratory Instruments",
             "Analytical Software"
           ],
           career_opportunities: {
             india: [
               "Biochemist",
               "Laboratory Technician",
               "Research Assistant",
               "Quality Control Analyst",
               "Production Assistant"
             ],
             international: [
               "Biochemist",
               "Laboratory Technician",
               "Research Assistant",
               "Quality Control Analyst",
               "Production Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in pharmaceutical, research, and healthcare sectors. Growing opportunities in molecular biology and drug development."
         },
         {
           id: "bio-4",
           name: "B.Sc Genetics",
           overview: "Program focusing on genetic principles, inheritance patterns, and genetic research.",
           department: "bio-science",
           level: "undergraduate",
           duration: "3 years",
           core_subjects: [
             "Genetics",
             "Molecular Genetics",
             "Population Genetics",
             "Human Genetics",
             "Genetic Engineering",
             "Laboratory Techniques",
             "Bioinformatics",
             "Genetic Counseling"
           ],
           skills_gained: [
             "Genetic Analysis",
             "Laboratory Techniques",
             "Data Analysis",
             "Research Skills",
             "Genetic Counseling"
           ],
           tools_and_technologies: [
             "DNA Analysis Tools",
             "PCR Machines",
             "Genetic Sequencing Equipment",
             "Bioinformatics Software",
             "Laboratory Instruments"
           ],
           career_opportunities: {
             india: [
               "Geneticist",
               "Research Assistant",
               "Laboratory Technician",
               "Genetic Counselor",
               "Quality Control Analyst"
             ],
             international: [
               "Geneticist",
               "Research Assistant",
               "Laboratory Technician",
               "Genetic Counselor",
               "Research Specialist"
             ]
           },
           salary_scope: {
             india: {
               entry_level: "₹3–5 LPA",
               mid_level: "₹6–12 LPA",
               senior_level: "₹15–25+ LPA"
             },
             international: {
               entry_level: "$40,000–$60,000 per year",
               mid_level: "$70,000–$110,000 per year",
               senior_level: "$130,000+ per year"
             }
           },
           future_scope: "High demand in medical genetics, research, and biotechnology. Growing opportunities in personalized medicine and genetic research."
         }
       ]

export class ProgramService {
  private programs: Program[] = enhancedProgramData

  // Get all programs
  getAllPrograms(): Program[] {
    return this.programs
  }

  // Get programs by department
  getProgramsByDepartment(departmentId: string): Program[] {
    return this.programs.filter(program => program.department === departmentId)
  }

  // Get all departments
  getAllDepartments(): Department[] {
    return departments
  }

  // Get department by ID
  getDepartmentById(departmentId: string): Department | undefined {
    return departments.find(dept => dept.id === departmentId)
  }

  // Get program by name
  getProgramByName(name: string): Program | undefined {
    return this.programs.find(program => 
      program.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  // Search programs by keyword
  searchPrograms(query: string): Program[] {
    const lowerQuery = query.toLowerCase()
    const results = this.programs.filter(program => 
      program.name.toLowerCase().includes(lowerQuery) ||
      program.overview.toLowerCase().includes(lowerQuery) ||
      program.core_subjects.some(subject => 
        subject.toLowerCase().includes(lowerQuery)
      ) ||
      program.skills_gained.some(skill => 
        skill.toLowerCase().includes(lowerQuery)
      ) ||
      program.department.toLowerCase().includes(lowerQuery)
    )
    
    return results
  }

  // Get programs by category
  getProgramsByCategory(category: string): Program[] {
    const lowerCategory = category.toLowerCase()
    
    if (lowerCategory.includes('computer science') || lowerCategory.includes('cs')) {
      return this.programs.filter(program => 
        program.department === 'computer-science'
      )
    }
    
    if (lowerCategory.includes('ai') || lowerCategory.includes('artificial intelligence')) {
      return this.programs.filter(program => 
        program.name.toLowerCase().includes('artificial intelligence') ||
        program.name.toLowerCase().includes('ai')
      )
    }
    
    if (lowerCategory.includes('data science') || lowerCategory.includes('analytics')) {
      return this.programs.filter(program => 
        program.name.toLowerCase().includes('data science') ||
        program.name.toLowerCase().includes('analytics')
      )
    }
    
    if (lowerCategory.includes('cyber') || lowerCategory.includes('security')) {
      return this.programs.filter(program => 
        program.name.toLowerCase().includes('cyber') ||
        program.name.toLowerCase().includes('security')
      )
    }
    
    if (lowerCategory.includes('postgraduate') || lowerCategory.includes('m.sc') || lowerCategory.includes('masters')) {
      return this.programs.filter(program => 
        program.level === 'postgraduate'
      )
    }
    
    if (lowerCategory.includes('undergraduate') || lowerCategory.includes('b.sc') || lowerCategory.includes('bachelor')) {
      return this.programs.filter(program => 
        program.level === 'undergraduate'
      )
    }
    
    return []
  }

  // Compare programs
  comparePrograms(programNames: string[]): Program[] {
    return programNames
      .map(name => this.getProgramByName(name))
      .filter((program): program is Program => program !== undefined)
  }

  // Get career opportunities for a program
  getCareerOpportunities(programName: string) {
    const program = this.getProgramByName(programName)
    return program?.career_opportunities
  }

  // Get salary information for a program
  getSalaryInfo(programName: string) {
    const program = this.getProgramByName(programName)
    return program?.salary_scope
  }

  // Get program recommendations based on interests
  getRecommendations(interests: string[]): Program[] {
    const scoredPrograms = this.programs.map(program => {
      let score = 0
      const programText = `${program.name} ${program.overview} ${program.core_subjects.join(' ')} ${program.skills_gained.join(' ')} ${program.department}`.toLowerCase()
      
      interests.forEach(interest => {
        if (programText.includes(interest.toLowerCase())) {
          score += 1
        }
      })
      
      return { program, score }
    })
    
    return scoredPrograms
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.program)
  }

  // Get programs by level
  getProgramsByLevel(level: 'undergraduate' | 'postgraduate'): Program[] {
    return this.programs.filter(program => program.level === level)
  }

  // Get total program count
  getTotalProgramCount(): number {
    return this.programs.length
  }

  // Get program count by department
  getProgramCountByDepartment(departmentId: string): number {
    return this.programs.filter(program => program.department === departmentId).length
  }
}

export const programService = new ProgramService()
