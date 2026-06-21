import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert, Box, Button, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/client';

const emptyItem = { role: '', company: '', period: '', details: '' };

function ExperienceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Role / Position" name="role" value={form.role} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Company" name="company" value={form.company} onChange={set} required />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Period" name="period" value={form.period} onChange={set} required placeholder="May 2022 – Present" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={4} label="Details / Achievements" name="details" value={form.details} onChange={set} required />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" size="small">Save</Button>
        <Button variant="outlined" size="small" onClick={onCancel}>Cancel</Button>
      </Stack>
    </Box>
  );
}

export default function ExperienceTab({ profile, onRefresh }) {
  const [timeline, setTimeline] = useState([]);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (profile) setTimeline(profile.timeline || []);
  }, [profile]);

  const saveToServer = async (updated) => {
    setStatus({ type: '', message: '' });
    try {
      await api.put('/profile', { timeline: updated });
      setStatus({ type: 'success', message: 'Experience saved.' });
      setEditing(null);
      onRefresh();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  const handleSave = (item, index) => {
    const updated = index === 'new'
      ? [...timeline, item]
      : timeline.map((t, i) => (i === index ? item : t));
    setTimeline(updated);
    saveToServer(updated);
  };

  const handleDelete = (index) => {
    const updated = timeline.filter((_, i) => i !== index);
    setTimeline(updated);
    saveToServer(updated);
  };

  return (
    <Box>
      {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

      <Button startIcon={<AddIcon />} variant="outlined" size="small" sx={{ mb: 2 }} onClick={() => setEditing('new')}>
        Add Experience
      </Button>

      {editing === 'new' && (
        <Paper sx={{ p: 2, mb: 2, border: '1px solid rgba(124,92,255,0.3)' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>New Experience</Typography>
          <ExperienceForm initial={emptyItem} onSave={(item) => handleSave(item, 'new')} onCancel={() => setEditing(null)} />
        </Paper>
      )}

      <Stack spacing={2}>
        {timeline.map((item, i) => (
          <Paper key={i} sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.08)' }}>
            {editing === i ? (
              <>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Edit Experience</Typography>
                <ExperienceForm initial={item} onSave={(it) => handleSave(it, i)} onCancel={() => setEditing(null)} />
              </>
            ) : (
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography color="secondary" variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {item.period}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>{item.role}</Typography>
                  <Typography color="primary" variant="body2" fontWeight={600}>{item.company}</Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{item.details.slice(0, 140)}…</Typography>
                </Box>
                <Stack direction="row" spacing={0.5} sx={{ ml: 1, flexShrink: 0 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => setEditing(i)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(i)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>

      {timeline.length === 0 && editing !== 'new' && (
        <Typography color="text.secondary" variant="body2">No experience entries yet.</Typography>
      )}
    </Box>
  );
}
