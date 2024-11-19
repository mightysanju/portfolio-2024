interface ScoringResult {
  score: number;
  matched: string[];
  missing: string[];
  componentScores: {
    keywords: number;
    skills: number;
    experience: number;
    education: number;
    achievements: number;
    formatting: number;
    softSkills: number;
  };
  suggestions: string[];
}

// Enhanced skill synonyms with more variations
const skillSynonyms = new Map([
  ['javascript', ['js', 'es6', 'ecmascript', 'node.js', 'nodejs', 'react.js', 'reactjs', 'vue.js', 'angular']],
  ['python', ['py', 'python3', 'django', 'flask', 'pytorch', 'tensorflow']],
  ['machine learning', ['ml', 'deep learning', 'ai', 'artificial intelligence', 'neural networks', 'nlp']],
  ['data science', ['data analysis', 'data analytics', 'statistical analysis', 'data mining', 'big data']],
  ['project management', ['project manager', 'program manager', 'project lead', 'scrum master', 'agile']],
  ['cloud', ['aws', 'azure', 'gcp', 'cloud computing', 'devops', 'docker', 'kubernetes']],
]);

// Enhanced soft skills list
const softSkills = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving',
  'analytical', 'creative', 'innovative', 'detail oriented', 'detail-oriented',
  'time management', 'collaboration', 'adaptability', 'flexibility', 'initiative',
  'strategic thinking', 'critical thinking', 'decision making', 'interpersonal',
  'organizational', 'planning', 'mentoring', 'negotiation', 'presentation'
];

// Enhanced education keywords
const educationKeywords = [
  'bachelor', 'master', 'phd', 'degree', 'certification', 'certified',
  'diploma', 'graduate', 'undergraduate', 'mba', 'bs', 'ba', 'ms', 'ma',
  'doctorate', 'academic', 'university', 'college', 'institute'
];

// Enhanced achievement indicators
const achievementIndicators = [
  'increased', 'decreased', 'improved', 'reduced', 'led', 'launched',
  'managed', 'developed', 'created', 'implemented', 'achieved', 'delivered',
  'generated', 'saved', 'enhanced', 'optimized', 'streamlined', 'accelerated',
  '%', 'percent', 'million', 'billion', 'thousand', 'growth', 'reduction',
  'efficiency', 'revenue', 'cost', 'budget', 'team', 'project', 'success'
];

const extractKeywords = (text: string): string[] => {
  const cleanText = text.toLowerCase().replace(/[^\w\s%]/g, ' ');
  const words = cleanText.split(/\s+/);
  
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'the', 'or', 'our', 'we', 'us', 'your', 'their', 'this',
    'these', 'those', 'am', 'been', 'being', 'have', 'had', 'do', 'does',
    'did', 'but', 'if', 'then', 'else', 'when', 'up', 'down', 'out', 'about'
  ]);

  return [...new Set(words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  ))];
};

const findSkillMatches = (resumeText: string, jobText: string): {
  matched: string[];
  missing: string[];
  score: number;
} => {
  const resumeWords = new Set(extractKeywords(resumeText));
  const jobWords = new Set(extractKeywords(jobText));
  
  const matched: string[] = [];
  const missing: string[] = [];
  let totalWeight = 0;
  let matchedWeight = 0;

  jobWords.forEach(keyword => {
    // Assign weight based on keyword importance
    let weight = 1;
    if (skillSynonyms.has(keyword)) weight = 2; // Technical skills are more important
    if (keyword.includes('required') || keyword.includes('essential')) weight = 3;
    
    totalWeight += weight;

    const hasMatch = Array.from(resumeWords).some(resumeWord => {
      // Direct match
      if (resumeWord.includes(keyword) || keyword.includes(resumeWord)) return true;
      
      // Check synonyms
      const synonyms = skillSynonyms.get(keyword) || [];
      return synonyms.some(synonym => resumeWord.includes(synonym));
    });

    if (hasMatch) {
      matched.push(keyword);
      matchedWeight += weight;
    } else {
      missing.push(keyword);
    }
  });

  // Calculate weighted score
  const score = totalWeight > 0 ? (matchedWeight / totalWeight) * 10 : 10;
  return { matched, missing, score };
};

const calculateSoftSkillsScore = (text: string): number => {
  const words = extractKeywords(text);
  const matches = softSkills.filter(skill => 
    words.some(word => word.includes(skill.replace(' ', '')))
  );
  return Math.min((matches.length / (softSkills.length * 0.3)) * 10, 10); // Expect ~30% of soft skills
};

const calculateAchievementsScore = (text: string): number => {
  const words = extractKeywords(text);
  const matches = achievementIndicators.filter(indicator =>
    words.some(word => word.includes(indicator))
  );
  const score = (matches.length / 8) * 10; // Expect at least 8 achievement indicators
  return Math.min(score, 10);
};

const calculateEducationScore = (text: string): number => {
  const words = extractKeywords(text);
  const matches = educationKeywords.filter(keyword =>
    words.some(word => word.includes(keyword))
  );
  return Math.min((matches.length / 4) * 10, 10); // Expect at least 4 education keywords
};

const calculateFormattingScore = (text: string): number => {
  let score = 10;
  
  // Check for formatting issues
  if (text.includes('  ')) score -= 1;
  if (text.includes('\t')) score -= 1;
  if (text.match(/[^\w\s,.:;-]/g)) score -= 1;
  if (!text.match(/^[A-Z]/m)) score -= 1; // Check for proper capitalization
  if (text.match(/[A-Z]{5,}/)) score -= 1; // Too many caps
  if (text.length < 200) score -= 2; // Too short
  if (text.length > 5000) score -= 1; // Too long
  
  return Math.max(score, 0);
};

const calculateExperienceScore = (text: string): number => {
  const years = text.match(/\d+\+?\s*(?:year|yr)/gi);
  const experienceMatches = text.match(/experience|work|position|role|job|career/gi);
  
  let score = 5; // Base score
  
  if (years) {
    const maxYears = Math.max(...years.map(y => parseInt(y)));
    score += Math.min((maxYears / 5) * 5, 5); // Up to 5 points for years
  }
  
  if (experienceMatches) {
    score += Math.min((experienceMatches.length / 10) * 5, 5); // Up to 5 points for experience mentions
  }
  
  return Math.min(score, 10);
};

export const calculateATSScore = (resumeText: string, jobDescription: string): ScoringResult => {
  // Calculate individual component scores
  const { matched, missing, score: keywordScore } = findSkillMatches(resumeText, jobDescription);
  const skillsScore = keywordScore * 1.2; // Boost skills score importance
  const softSkillsScore = calculateSoftSkillsScore(resumeText);
  const achievementsScore = calculateAchievementsScore(resumeText);
  const educationScore = calculateEducationScore(resumeText);
  const formattingScore = calculateFormattingScore(resumeText);
  const experienceScore = calculateExperienceScore(resumeText);

  // Adjusted weights to emphasize keywords and skills
  const weights = {
    keywords: 0.35, // Increased weight
    skills: 0.25,   // Increased weight
    experience: 0.15,
    education: 0.1,
    achievements: 0.1,
    formatting: 0.025,
    softSkills: 0.025 // Reduced weight
  };

  const componentScores = {
    keywords: keywordScore,
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    achievements: achievementsScore,
    formatting: formattingScore,
    softSkills: softSkillsScore
  };

  // Calculate final score with bonus for high keyword match
  let finalScore = Math.round(
    (componentScores.keywords * weights.keywords +
    componentScores.skills * weights.skills +
    componentScores.experience * weights.experience +
    componentScores.education * weights.education +
    componentScores.achievements * weights.achievements +
    componentScores.formatting * weights.formatting +
    componentScores.softSkills * weights.softSkills) * 10
  );

  // Bonus points for high keyword match rate
  if (missing.length === 0 && matched.length > 0) {
    finalScore = Math.min(finalScore + 15, 100); // Bonus for perfect keyword match
  } else if (missing.length < matched.length / 3) {
    finalScore = Math.min(finalScore + 10, 100); // Bonus for very good keyword match
  }

  // Generate suggestions based on scores
  const suggestions: string[] = [];
  
  if (missing.length > 0) {
    suggestions.push(`Add these key missing terms: ${missing.slice(0, 3).join(', ')}`);
  }
  if (componentScores.achievements < 7) {
    suggestions.push('Include more quantifiable achievements and metrics');
  }
  if (componentScores.softSkills < 7) {
    suggestions.push('Add relevant soft skills that match the job requirements');
  }
  if (componentScores.formatting < 7) {
    suggestions.push('Improve resume formatting for better ATS compatibility');
  }

  return {
    score: finalScore,
    matched,
    missing,
    componentScores,
    suggestions
  };
};