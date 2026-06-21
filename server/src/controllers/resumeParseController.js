import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Comprehensive skills dictionary for matching
const SKILLS_DICT = [
  // Frontend
  'React.js', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'ES6', 'HTML5', 'HTML',
  'CSS3', 'CSS', 'Tailwind CSS', 'Tailwind', 'Material UI', 'MUI', 'Bootstrap',
  'Redux Toolkit', 'Redux', 'Context API', 'Vuejs', 'Vue.js', 'Angular', 'Svelte',
  'Framer Motion', 'Ant Design', 'Chakra UI', 'Styled Components', 'Sass', 'SCSS',
  'PWA', 'Responsive Design', 'Webpack', 'Vite',
  // Backend
  'Node.js', 'Express.js', 'Express', 'REST APIs', 'GraphQL', 'JWT Authentication',
  'JWT', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'Redis',
  'Prisma', 'Mongoose', 'Django', 'Python', 'FastAPI', 'Flask',
  // AI/ML
  'OpenAI API', 'OpenAI', 'LangChain', 'LangGraph', 'Prompt Engineering',
  'AI Agent Development', 'Voice AI', 'Multi-Agent Systems', 'Generative AI',
  'Hugging Face', 'TensorFlow', 'PyTorch',
  // Tools/DevOps
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions',
  'Vercel', 'Netlify', 'AWS', 'Azure', 'GCP', 'Jira', 'Figma', 'Postman',
  'VS Code', 'Agile', 'Scrum', 'NPM', 'Yarn',
  // Concepts
  'JWT Authentication', 'Role-based Access Control', 'Microservices', 'Serverless'
];

function extractSkillsFromText(text) {
  const found = new Set();
  const lower = text.toLowerCase();

  for (const skill of SKILLS_DICT) {
    // Build regex that handles dots and special chars
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![\\w])${escaped}(?![\\w])`, 'i');
    if (regex.test(lower)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

// Partition matched skills into skills vs tools buckets
const TOOL_NAMES = new Set([
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions',
  'Vercel', 'Netlify', 'AWS', 'Azure', 'GCP', 'Jira', 'Figma', 'Postman',
  'VS Code', 'NPM', 'Yarn', 'Agile', 'Scrum'
]);

export async function parseResumePdf(request, response) {
  if (!request.file) {
    return response.status(400).json({ message: 'PDF file is required' });
  }

  const data = await pdfParse(request.file.buffer);
  const rawText = data.text;
  const allMatched = extractSkillsFromText(rawText);

  const extractedSkills = allMatched.filter((s) => !TOOL_NAMES.has(s));
  const extractedTools = allMatched.filter((s) => TOOL_NAMES.has(s));

  response.json({
    extractedSkills,
    extractedTools,
    rawTextPreview: rawText.slice(0, 1500).trim()
  });
}
