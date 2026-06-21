import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Card, CardContent, Chip, Container, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import anime from 'animejs/lib/anime.es.js';
import { useEffect, useRef } from 'react';
import SectionTitle from './SectionTitle';

function ProjectCard({ project }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        border: '1px solid rgba(255,255,255,0.08)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 16px 40px rgba(124,92,255,0.2)',
          borderColor: 'rgba(124,92,255,0.4)'
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography gutterBottom variant="h5" fontWeight={700} sx={{ flex: 1 }}>
            {project.title}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, mt: 0.5 }}>
            {project.githubUrl && (
              <Tooltip title="View on GitHub">
                <IconButton
                  size="small"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {project.liveUrl && (
              <Tooltip title="Live demo">
                <IconButton
                  size="small"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ '&:hover': { color: 'secondary.main' } }}
                >
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        <Typography color="text.secondary" sx={{ mb: 'auto', pb: 3, lineHeight: 1.65 }}>
          {project.description}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {project.stack?.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              sx={{
                borderRadius: '6px',
                background: 'rgba(124,92,255,0.12)',
                border: '1px solid rgba(124,92,255,0.25)',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function Projects({ projects }) {
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || animated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          anime({
            targets: containerRef.current.querySelectorAll('.project-card'),
            opacity: [0, 1],
            translateY: [32, 0],
            easing: 'easeOutExpo',
            duration: 650,
            delay: anime.stagger(100)
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [projects]);

  return (
    <Container id="projects" maxWidth="lg" sx={{ py: 8 }}>
      <SectionTitle
        eyebrow="Selected Work"
        title="Projects that show product range"
        subtitle="A mix of React, Node.js, MongoDB, Next.js, and Generative AI concepts."
      />

      <Grid container spacing={3} ref={containerRef}>
        {projects?.map((project) => (
          <Grid item key={project.title} md={4} xs={12} className="project-card" sx={{ opacity: 0 }}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {(!projects || projects.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No projects added yet.</Typography>
        </Box>
      )}
    </Container>
  );
}

export default Projects;
