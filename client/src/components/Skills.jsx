import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import anime from 'animejs/lib/anime.es.js';
import { useEffect, useRef } from 'react';
import { getSkillIcon } from '../utils/skillIcons';
import SectionTitle from './SectionTitle';

function SkillChip({ name }) {
  const Icon = getSkillIcon(name);
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        border: '1px solid rgba(124,92,255,0.35)',
        borderRadius: '999px',
        background: 'rgba(124,92,255,0.08)',
        cursor: 'default',
        transition: 'all 0.2s',
        '&:hover': {
          border: '1px solid rgba(124,92,255,0.7)',
          background: 'rgba(124,92,255,0.18)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 14px rgba(124,92,255,0.25)'
        }
      }}
    >
      {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
      <Typography variant="body2" fontWeight={600} component="span">
        {name}
      </Typography>
    </Box>
  );
}

function ToolChip({ name }) {
  const Icon = getSkillIcon(name);
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        border: '1px solid rgba(25,211,218,0.3)',
        borderRadius: '999px',
        background: 'rgba(25,211,218,0.07)',
        cursor: 'default',
        transition: 'all 0.2s',
        '&:hover': {
          border: '1px solid rgba(25,211,218,0.65)',
          background: 'rgba(25,211,218,0.15)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 14px rgba(25,211,218,0.2)'
        }
      }}
    >
      {Icon && <Icon size={16} style={{ flexShrink: 0 }} />}
      <Typography variant="body2" fontWeight={600} component="span">
        {name}
      </Typography>
    </Box>
  );
}

function Skills({ skills, tools }) {
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || animated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          anime({
            targets: containerRef.current.querySelectorAll('.skill-chip'),
            opacity: [0, 1],
            translateY: [18, 0],
            scale: [0.88, 1],
            easing: 'easeOutBack',
            duration: 500,
            delay: anime.stagger(40)
          });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [skills, tools]);

  return (
    <Container id="skills" maxWidth="lg" sx={{ py: 8 }}>
      <SectionTitle
        eyebrow="Capabilities"
        title="Full-stack skills with AI fluency"
        subtitle="A practical toolkit for building, shipping, coordinating, and improving modern web products."
      />

      <Paper sx={{ p: 4 }} ref={containerRef}>
        {skills?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="primary" fontWeight={700} sx={{ mb: 1.5, display: 'block', letterSpacing: 2 }}>
              Skills
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {skills.map((item) => (
                <Box key={item} className="skill-chip" sx={{ opacity: 0 }}>
                  <SkillChip name={item} />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {tools?.length > 0 && (
          <Box>
            <Typography variant="overline" color="secondary" fontWeight={700} sx={{ mb: 1.5, display: 'block', letterSpacing: 2 }}>
              Tools
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {tools.map((item) => (
                <Box key={item} className="skill-chip" sx={{ opacity: 0 }}>
                  <ToolChip name={item} />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Skills;
