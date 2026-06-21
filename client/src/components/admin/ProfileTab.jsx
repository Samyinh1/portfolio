import { Alert, Box, Button, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function ProfileTab({ profile, onRefresh }) {
  const [form, setForm] = useState({
    name: '', title: '', location: '', experience: '', phone: '', linkedin: '',
    summary: '', email: '',
    github: '', gitlab: '',
    certifications: '',
    spokenLanguages: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      title: profile.title || '',
      location: profile.location || '',
      experience: profile.experience || '',
      phone: profile.phone || '',
      linkedin: profile.linkedin || '',
      summary: profile.summary || '',
      email: profile.email || '',
      github: profile.socials?.github || '',
      gitlab: profile.socials?.gitlab || '',
      certifications: (profile.certifications || []).join('\n'),
      spokenLanguages: (profile.spokenLanguages || [])
        .map((l) => `${l.name}: ${l.proficiency}`)
        .join('\n')
    });
  }, [profile]);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await api.put('/profile', {
        name: form.name,
        title: form.title,
        location: form.location,
        experience: form.experience,
        phone: form.phone,
        linkedin: form.linkedin,
        summary: form.summary,
        email: form.email,
        socials: { github: form.github, gitlab: form.gitlab, linkedin: form.linkedin },
        certifications: form.certifications.split('\n').map((s) => s.trim()).filter(Boolean),
        spokenLanguages: form.spokenLanguages
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const [name, ...rest] = s.split(':');
            return { name: name.trim(), proficiency: rest.join(':').trim() };
          })
      });
      setStatus({ type: 'success', message: 'Profile saved.' });
      onRefresh();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  return (
    <Box component="form" onSubmit={save}>
      {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={set} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Professional Title" name="title" value={form.title} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Location" name="location" value={form.location} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Experience (e.g. 4+ years)" name="experience" value={form.experience} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Email" name="email" value={form.email} onChange={set} required type="email" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={set} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="GitHub URL" name="github" value={form.github} onChange={set} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="GitLab URL" name="gitlab" value={form.gitlab} onChange={set} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline minRows={4}
            label="Summary / Bio"
            name="summary"
            value={form.summary}
            onChange={set}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth multiline minRows={3}
            label="Certifications (one per line)"
            name="certifications"
            value={form.certifications}
            onChange={set}
            helperText="One certification per line"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth multiline minRows={3}
            label="Spoken Languages (one per line)"
            name="spokenLanguages"
            value={form.spokenLanguages}
            onChange={set}
            helperText="Format: English: Full Professional (C1)"
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Save Profile</Button>
    </Box>
  );
}
