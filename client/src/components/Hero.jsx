import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import anime from 'animejs/lib/anime.es.js';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function Hero({ profile }) {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    // Split heading text into word spans for stagger animation
    const el = headingRef.current;
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words
      .map((w) => `<span style="display:inline-block;opacity:0;transform:translateY(28px)">${w}&nbsp;</span>`)
      .join('');

    anime({
      targets: el.querySelectorAll('span'),
      opacity: [0, 1],
      translateY: [28, 0],
      easing: 'easeOutExpo',
      duration: 800,
      delay: anime.stagger(60, { start: 200 })
    });
  }, [profile]);

  const focus = profile.currentFocus;

  return (
    <Container maxWidth="lg" sx={{ pb: 10, pt: { xs: 7, md: 12 } }}>
      <Grid alignItems="center" container spacing={5}>
        <Grid item md={7} xs={12}>
          <Stack component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} spacing={3}>
            <Chip
              color="secondary"
              label={`${profile.experience} • ${profile.location}`}
              sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
            />
            <Typography
              ref={headingRef}
              variant="h1"
              sx={{ fontSize: { xs: 38, md: 66 }, lineHeight: 1.08, letterSpacing: '-1.5px' }}
            >
              Building React products with AI-powered thinking.
            </Typography>
            <Typography color="text.secondary" variant="h5" sx={{ lineHeight: 1.6 }}>
              {profile.summary}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                href="#contact"
                size="large"
                startIcon={<EmailIcon />}
                variant="contained"
                sx={{ px: 3, '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(124,92,255,0.4)' }, transition: 'all 0.2s' }}
              >
                Connect with me
              </Button>
              {profile.resumeUrl && (
                <Button
                  href={profile.resumeUrl}
                  size="large"
                  startIcon={<DownloadIcon />}
                  target="_blank"
                  variant="outlined"
                  sx={{ px: 3, '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                >
                  Download resume
                </Button>
              )}
            </Stack>
          </Stack>
        </Grid>

        <Grid item md={5} xs={12}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            sx={{
              p: 4,
              background: 'linear-gradient(145deg, rgba(124,92,255,0.22), rgba(25,211,218,0.12)), rgba(13,24,43,0.9)',
              border: '1px solid rgba(124,92,255,0.2)',
              '&:hover': { border: '1px solid rgba(124,92,255,0.45)', boxShadow: '0 0 32px rgba(124,92,255,0.15)' },
              transition: 'border 0.3s, box-shadow 0.3s'
            }}
          >
            <Typography color="secondary" fontWeight={800} variant="overline" letterSpacing={2}>
              Current Focus
            </Typography>
            <Typography sx={{ mb: 2, mt: 0.5, lineHeight: 1.3 }} variant="h5" fontWeight={700}>
              {focus?.headline || profile.title}
            </Typography>

            {focus?.highlights?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {focus.highlights.map((h) => (
                  <Chip
                    key={h}
                    label={h}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {profile.skills?.slice(0, 6).map((skill) => (
                <Chip key={skill} label={skill} variant="outlined" size="small" />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
