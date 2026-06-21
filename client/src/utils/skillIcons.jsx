import {
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGitlab,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiMongodb,
  SiMui,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostman,
  SiPython,
  SiReact,
  SiTypescript,
} from 'react-icons/si';

// Normalise name for lookup
const norm = (s) => s.toLowerCase().replace(/[.\s-]/g, '');

const iconMap = {
  reactjs: SiReact,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  expressjs: SiExpress,
  express: SiExpress,
  mongodb: SiMongodb,
  generativeai: SiOpenai,
  genai: SiOpenai,
  materialui: SiMui,
  mui: SiMui,
  jira: SiJira,
  clickup: null,
  github: SiGithub,
  githubactions: SiGithubactions,
  gitlab: SiGitlab,
  postman: SiPostman,
  vscode: null,
  visualstudiocode: null,
  docker: SiDocker,
  figma: SiFigma,
  javascript: SiJavascript,
  js: SiJavascript,
  typescript: SiTypescript,
  ts: SiTypescript,
  python: SiPython,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss,
  css3: SiCss,
  git: SiGit,
  openai: SiOpenai,
};

export function getSkillIcon(name) {
  const key = norm(name);
  return iconMap[key] ?? null;
}
