import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stack: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String }
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String },
    location: { type: String }
  },
  { _id: false }
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    proficiency: { type: String }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    summary: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    socials: {
      github: String,
      gitlab: String,
      linkedin: String
    },
    currentFocus: {
      headline: { type: String },
      highlights: [{ type: String }]
    },
    skills: [{ type: String }],
    tools: [{ type: String }],
    upcomingTechs: [{ type: String }],
    projects: [projectSchema],
    timeline: [timelineSchema],
    education: [educationSchema],
    certifications: [{ type: String }],
    spokenLanguages: [languageSchema],
    resumeUrl: String
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
