import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import anime from 'animejs/lib/anime.es.js';
import { useEffect, useRef } from 'react';
import SectionTitle from './SectionTitle';

function TimelineItem({ item, isLast }) {
  return (
    <Stack direction="row" spacing={0} sx={{ position: 'relative' }}>
      {/* Timeline line + dot */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3, flexShrink: 0 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c5cff, #19d3da)',
            mt: 1.5,
            flexShrink: 0,
            boxShadow: '0 0 10px rgba(124,92,255,0.6)'
          }}
        />
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 32,
              background: 'linear-gradient(180deg, rgba(124,92,255,0.5), rgba(25,211,218,0.2))',
              mt: 0.5
            }}
          />
        )}
      </Box>

      {/* Card */}
      <Paper
        sx={{
          p: 3,
          mb: isLast ? 0 : 2,
          flex: 1,
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          '&:hover': {
            borderColor: 'rgba(124,92,255,0.4)',
            boxShadow: '0 4px 24px rgba(124,92,255,0.12)'
          }
        }}
      >
        <Typography color="secondary" fontWeight={700} variant="caption" letterSpacing={1} sx={{ textTransform: 'uppercase' }}>
          {item.period}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
          {item.role}
        </Typography>
        <Typography color="primary" fontWeight={600} variant="body2" sx={{ mb: 1 }}>
          {item.company}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {item.details}
        </Typography>
      </Paper>
    </Stack>
  );
}

function Experience({ timeline }) {
  const containerRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || animated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          anime({
            targets: containerRef.current.querySelectorAll('.timeline-item'),
            opacity: [0, 1],
            translateX: [-24, 0],
            easing: 'easeOutExpo',
            duration: 600,
            delay: anime.stagger(120)
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [timeline]);

  return (
    <Container id="experience" maxWidth="md" sx={{ py: 8 }}>
      <SectionTitle eyebrow="Experience" title="Career timeline" />

      <Box ref={containerRef}>
        {timeline?.map((item, index) => (
          <Box key={`${item.company}-${item.role}`} className="timeline-item" sx={{ opacity: 0 }}>
            <TimelineItem item={item} isLast={index === timeline.length - 1} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default Experience;
