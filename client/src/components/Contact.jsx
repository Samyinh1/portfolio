import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, Button, Container, Grid, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { SiGitlab } from 'react-icons/si';
import api from '../api/client';
import SectionTitle from './SectionTitle';

const initialForm = { name: '', email: '', message: '' };

function SocialLink({ href, icon, label }) {
  if (!href) return null;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        color: 'text.secondary',
        px: 1.5,
        py: 1,
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': { color: 'primary.main', background: 'rgba(124,92,255,0.1)' }
      }}
    >
      {icon}
      <Typography variant="body2" fontWeight={600}>{label}</Typography>
    </Link>
  );
}

function Contact({ profile }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', message: 'Message sent. I will get back to you soon!' });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to send message right now.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container id="contact" maxWidth="lg" sx={{ py: 8 }}>
      <SectionTitle eyebrow="Contact" title="Let's build something useful" />

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" fontWeight={700}>Connect with me</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3, lineHeight: 1.7 }}>
              Available for React, Node.js, Next.js, MongoDB, and GenAI product work.
            </Typography>

            <Stack spacing={0.5}>
              {profile.email && (
                <SocialLink
                  href={`mailto:${profile.email}`}
                  icon={<EmailIcon fontSize="small" />}
                  label={profile.email}
                />
              )}
              {profile.socials?.github && (
                <SocialLink
                  href={profile.socials.github}
                  icon={<GitHubIcon fontSize="small" />}
                  label={profile.socials.github.replace('https://', '')}
                />
              )}
              {profile.socials?.gitlab && (
                <SocialLink
                  href={profile.socials.gitlab}
                  icon={<Box component={SiGitlab} sx={{ fontSize: 16 }} />}
                  label={profile.socials.gitlab.replace('https://', '')}
                />
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item md={7} xs={12}>
          <Paper component="form" onSubmit={submitForm} sx={{ p: 3 }}>
            <Stack spacing={2}>
              {status.message && <Alert severity={status.type}>{status.message}</Alert>}
              <TextField label="Name" name="name" onChange={updateField} required value={form.name} />
              <TextField label="Email" name="email" onChange={updateField} required type="email" value={form.email} />
              <TextField
                label="Message"
                minRows={5}
                multiline
                name="message"
                onChange={updateField}
                required
                value={form.message}
              />
              <Button
                disabled={loading}
                endIcon={<SendIcon />}
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  transition: 'all 0.2s',
                  '&:not(:disabled):hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(124,92,255,0.35)' }
                }}
              >
                {loading ? 'Sending…' : 'Send message'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;
