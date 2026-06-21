import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../api/client';
import Contact from '../components/Contact';
import Experience from '../components/Experience';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import { ExperienceSkeleton, HeroSkeleton, ProjectsSkeleton, SkillsSkeleton } from '../components/SkeletonLoader';
import Skills from '../components/Skills';
import fallbackProfile from '../data/fallbackProfile';

function FloatingOrb({ sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        ...sx
      }}
    />
  );
}

function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get('/profile')
      .then((response) => setProfile(response.data))
      .catch(() => setProfile(fallbackProfile));
  }, []);

  const isLoading = profile === null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#08111f',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated gradient orbs */}
      <FloatingOrb
        sx={{
          width: { xs: 320, md: 560 },
          height: { xs: 320, md: 560 },
          top: -80,
          left: -80,
          background: 'rgba(124,92,255,0.28)',
          animation: 'orbFloat1 14s ease-in-out infinite'
        }}
      />
      <FloatingOrb
        sx={{
          width: { xs: 260, md: 480 },
          height: { xs: 260, md: 480 },
          top: -60,
          right: -60,
          background: 'rgba(25,211,218,0.2)',
          animation: 'orbFloat2 18s ease-in-out infinite'
        }}
      />
      <FloatingOrb
        sx={{
          width: { xs: 180, md: 300 },
          height: { xs: 180, md: 300 },
          bottom: '20%',
          left: '30%',
          background: 'rgba(124,92,255,0.14)',
          animation: 'orbFloat3 22s ease-in-out infinite'
        }}
      />

      {/* Subtle dot-grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar profile={profile || fallbackProfile} />

        {isLoading ? (
          <>
            <HeroSkeleton />
            <SkillsSkeleton />
            <ProjectsSkeleton />
            <ExperienceSkeleton />
          </>
        ) : (
          <>
            <Hero profile={profile} />
            <Skills skills={profile.skills} tools={profile.tools} />
            <Projects projects={profile.projects} />
            <Experience timeline={profile.timeline} />
            <Contact profile={profile} />
          </>
        )}

        <Container sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            © {new Date().getFullYear()} {(profile || fallbackProfile).name}. Built with React, MUI, Node.js, and MongoDB.
          </Typography>
        </Container>
      </Box>

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.08); }
          66% { transform: translate(-20px, 50px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-50px, 40px) scale(1.1); }
          70% { transform: translate(30px, -20px) scale(0.92); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.12); }
        }
      `}</style>
    </Box>
  );
}

export default Home;
