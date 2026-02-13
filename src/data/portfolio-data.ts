// ============================================
// PORTFOLIO CONTENT MANAGEMENT SYSTEM
// ============================================
// Edit this file to update your portfolio content.
// No need to touch any HTML/React code!
// ============================================
//
// ============================================
// HOW TO ADD A NEW PROJECT:
// ============================================
//
// 1. Place your images in: public/images/projects/
//    - Thumbnail: small image for the card grid (recommended: 800x600px)
//    - Preview:   larger image for the detail popup (recommended: 1200x800px)
//    You can use the same image for both, or use a URL instead.
//
// 2. Add a new entry to the `projects` array below:
//
//    {
//      id: "7",                                // unique id
//      title: "My New Project",
//      description: "A short summary...",
//      thumbnail: "/images/projects/my-project-thumb.jpg",
//      previewImage: "/images/projects/my-project-preview.jpg",
//      tags: ["Python", "SQL"],
//      githubUrl: "https://github.com/...",     // optional, omit or "#" to hide
//      liveUrl: "https://example.com",          // optional, omit or "#" to hide
//      featured: true,                          // true = shows in Featured row
//      methodology: "How you did it...",        // optional, shows in popup
//      results: "What you achieved...",         // optional, shows in popup
//    },
//
// 3. Save this file — the site updates automatically.
// ============================================

export interface Project {
  id: string;
  title: string;
  description: string;
  /** @deprecated Use `thumbnail` and `previewImage` instead. Kept for backward compatibility. */
  image?: string;
  /** Small image for the project card grid (recommended: 800×600). Path example: "/images/projects/my-thumb.jpg" */
  thumbnail?: string;
  /** Larger image shown in the project detail popup (recommended: 1200×800). Path example: "/images/projects/my-preview.jpg" */
  previewImage?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  methodology?: string;
  results?: string;
}

/** Get the thumbnail image for a project (falls back to `image` for backward compat). */
export function getProjectThumbnail(project: Project): string {
  return project.thumbnail || project.image || '/images/projects/placeholder.jpg';
}

/** Get the preview image for a project (falls back to thumbnail, then `image`). */
export function getProjectPreview(project: Project): string {
  return project.previewImage || project.thumbnail || project.image || '/images/projects/placeholder.jpg';
}

export interface Skill {
  name: string;
  level?: number; // optional, no longer displayed
  category: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface PortfolioData {
  // Personal Info
  personal: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    location: string;
    avatar: string;
    resumeUrl: string;
  };

  // About Section
  about: {
    bio: string[];
    profileImage: string;
    yearsOfExperience: number;
    completedProjects: number;
    portfolioValue: string;
  };

  // Projects
  projects: Project[];

  // Skills
  skills: Skill[];

  // Social Links
  social: SocialLink[];
}

// ============================================
// EDIT YOUR CONTENT BELOW
// ============================================

export const portfolioData: PortfolioData = {
  // Personal Information
  personal: {
    name: "Fadi Saif",
    title: "Data Systems & Analytics Specialist",
    tagline: "Data Systems and Analytics specialist with 10+ years of experience designing performance measurement frameworks, data pipelines, and decision-support reporting for large-scale humanitarian and development programs. Skilled in Python, SQL, ETL workflows, and business intelligence tools.",
    email: "fadi.saif@outlook.com",
    location: "Aden, Yemen",
    avatar: "https://media.licdn.com/dms/image/v2/C4E03AQHPS062sG4cdw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1650129271405?e=1772668800&v=beta&t=90jYFkuIXTBetc7-LK87aEzOwiEKV-LmxafTMFV5uPE",
    resumeUrl: "https://github.com/FadiSaif-BA/Portfolio/blob/master/Resume_FadiSaif.pdf",
  },

  // About Section
  about: {
    bio: [
      "I am a  Data Systems and Analytics specialist with 10+ years of experience designing performance measurement frameworks, data pipelines, and decision-support reporting for large-scale humanitarian and development programs in complex operating environments.",
      "My expertise spans Python, SQL, ETL workflows, and business intelligence tools, with a proven track record of improving operational efficiency, strengthening data governance, and generating insights supporting portfolios exceeding $60M in delivery and evidence-based strategic planning.",
      "I have led MEL systems for major organizations including JSI Research and Training Institute, Polish Humanitarian Action, and ADRA Yemen, and Delivered Contributions in the UN World Food Program, delivering analytical evidence that has secured over $60M in funding across multiple award cycles."
    ],
    profileImage: "https://media.licdn.com/dms/image/v2/C4E03AQHPS062sG4cdw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1650129271405?e=1772668800&v=beta&t=90jYFkuIXTBetc7-LK87aEzOwiEKV-LmxafTMFV5uPE",
    yearsOfExperience: 10,
    completedProjects: 25,
    portfolioValue: "$60M+",
  },

  // ============================================
  // PROJECTS — Add new projects here!
  // See the HOW-TO guide at the top of this file.
  // ============================================
  projects: [
    {
      id: "1",
      title: "Deep Learning Transliteration Model",
      description: "Built a sequence-to-sequence Deep Learning model using TensorFlow/Keras to automate Arabic-to-English geographic transliteration for 20K+ Yemeni geographical records.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
      tags: ["Deep Learning", "TensorFlow/Keras", "NLP", "Python", "Data Preprocessing"],
      liveUrl: "#",
      githubUrl: "https://github.com/FadiSaif-BA/Transliteration-Model.git",
      featured: true,
      methodology: "Trained the model on 70,000+ entries of geographical data using sequence-to-sequence architecture.",
      results: "Achieved 93% validated accuracy and 70% exact match score. Reduced manual transliteration workload by 60%.",
    },
    {
      id: "2",
      title: "Relational Inventory Management System (RIMS)",
      description: "Developed a full-stack desktop application using C# and MySQL with relational star schema, procedural constraints, and automated triggers for equipment tracking.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      tags: ["C#", ".NET", "MySQL", "Database Design", "System Automation"],
      liveUrl: "#",
      githubUrl: "https://github.com/FadiSaif-BA/InventoryRecordInformationSystem_IRIS.git",
      featured: true,
      methodology: "Implemented relational star schema with procedural constraints, automated triggers, and comprehensive audit trails.",
      results: "Reduced equipment recording and tracking time by 75% while improving data accuracy by over 50%. Ensured 100% data integrity.",
    },
    {
      id: "3",
      title: "Financial Analytics & Cash Flow Optimization",
      description: "Modeled a high-scale infrastructure firm environment using synthetic dataset of 10,000+ records with SQL and Python-driven ETL pipeline.",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
      tags: ["Risk Analysis", "Python", "Pandas", "Matplotlib", "SQL", "Financial Modeling", "ETL"],
      liveUrl: "#",
      githubUrl: "https://github.com/FadiSaif-BA/FinancialAnalysis_Simulation.git",
      featured: true,
      methodology: "Designed ETL pipeline and analysis to track liquidity indicators like DSO and WIP leakage using 10,000+ synthetic records.",
      results: "Created predictive framework to forecast quarterly cash inflow with 95% confidence interval, enabling proactive identification of toxic debt.",
    },
    {
      id: "4",
      title: "Irrigation Efficiency Impact Evaluation",
      description: "Conducted a 12-month matched case-control study of 30 small-scale farms comparing Drip vs. Traditional irrigation systems.",
      thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop",
      tags: ["Statistical Analysis", "Python", "SPSS", "Research Design", "Impact Evaluation"],
      liveUrl: "#",
      githubUrl: "https://github.com/FadiSaif-BA/ComparativeIrrigationStudy.git",
      featured: false,
      methodology: "Utilized t-tests and Cohen's effect size metrics to compare cost and water efficiency across irrigation methods.",
      results: "Proved 58.4% reduction in farming costs and 85.5% decrease in water consumption. Identified critical technology-crop incompatibility.",
    },
    {
      id: "5",
      title: "Health Facility Assessment Analytics",
      description: "Led Health Facility Assessment of 100 facilities with fragility/context analytics informing adaptive programming for USAID's MIHR Project.",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop",
      tags: ["Data Analysis", "Power BI", "KPI Frameworks", "Business, MEL and Management Systems"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      methodology: "Designed assessment methodology, data collection tools, and analytical framework for comprehensive facility evaluation.",
      results: "Delivered insights that informed adaptive programming decisions and improved health service delivery in fragile contexts.",
    },
    {
      id: "6",
      title: "Business Environment & Investment Challenges Study",
      description: "Lead analyst on comprehensive study examining business environment and investment challenges in Aden, Yemen.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      tags: ["Business Analysis", "Research", "Data Visualization", "Stakeholder Communication"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      methodology: "End-to-end design, analysis, and dissemination of research study for local NGOs with structured data collection.",
      results: "Delivered actionable insights supporting local economic development initiatives and policy recommendations.",
    },
  ],

  // Skills - Data Science & Analytics Skills
  skills: [
    // Data & Analytics
    { name: "Python", level: 95, category: "Data & Analytics" },
    { name: "SQL", level: 95, category: "Data & Analytics" },
    { name: "ETL Pipelines", level: 90, category: "Data & Analytics" },
    { name: "Data Modeling", level: 88, category: "Data & Analytics" },
    { name: "Forecasting", level: 85, category: "Data & Analytics" },
    { name: "Machine Learning", level: 82, category: "Data & Analytics" },
    { name: "TensorFlow/Keras", level: 80, category: "Data & Analytics" },
    { name: "NLP", level: 78, category: "Data & Analytics" },

    // Business Intelligence
    { name: "Power BI", level: 92, category: "Business Intelligence" },
    { name: "Tableau", level: 85, category: "Business Intelligence" },
    { name: "Dashboard Design", level: 90, category: "Business Intelligence" },
    { name: "Performance Reporting", level: 88, category: "Business Intelligence" },

    // MEL Systems & Research
    { name: "KPI Frameworks", level: 95, category: "Business, MEL and Management" },
    { name: "Data Quality Assurance", level: 90, category: "Business, MEL and Management" },
    { name: "Evaluation Design", level: 88, category: "Business, MEL and Management" },
    { name: "Assessments", level: 85, category: "Business, MEL and Management" },
    { name: "Problem Solving", level: 85, category: "Business, MEL and Management"},
    { name: "Critical Thinking", level: 85, category: "Business, MEL and Management"},
    { name: "Communication", level: 85, category: "Business, MEL and Management"},

    // Programming & Tools
    { name: "C# / .NET", level: 80, category: "Programming" },
    { name: "MySQL", level: 92, category: "Programming" },
    { name: "Pandas", level: 90, category: "Programming" },
    { name: "Matplotlib", level: 85, category: "Programming" },
    { name: "SPSS", level: 80, category: "Programming" },
  ],

  // Social Links
  social: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/fadisaif", icon: "linkedin" },
    { platform: "Portfolio", url: "https://fadisaif-ba.github.io/Portfolio", icon: "globe" },
    { platform: "GitHub", url: "https://github.com/FadiSaif-BA", icon: "github" },
  ],
};

// Helper function to get featured projects
export const getFeaturedProjects = () => {
  return portfolioData.projects.filter((project) => project.featured);
};

// Helper function to get projects by category
export const getSkillsByCategory = () => {
  const categories: Record<string, Skill[]> = {};
  portfolioData.skills.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });
  return categories;
};
