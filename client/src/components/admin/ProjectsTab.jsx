import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion, AccordionDetails, AccordionSummary,
  Alert, Box, Button, Chip, Grid, IconButton, Stack, TextField, Tooltip, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/client';

const emptyProject = { title: '', description: '', stack: '', githubUrl: '', liveUrl: '' };

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title,
      description: form.description,
      stack: typeof form.stack === 'string'
        ? form.stack.split(',').map((s) => s.trim()).filter(Boolean)
        : form.stack,
      githubUrl: form.githubUrl,
      liveUrl: form.liveUrl
    });
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Project Title" name="title" value={form.title} onChange={set} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={3} label="Description" name="description" value={form.description} onChange={set} required />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth label="Tech Stack (comma-separated)" name="stack"
            value={typeof form.stack === 'string' ? form.stack : form.stack.join(', ')}
            onChange={set}
            helperText="e.g. React.js, Node.js, MongoDB"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={set} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Live URL" name="liveUrl" value={form.liveUrl} onChange={set} />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" size="small">Save Project</Button>
        <Button variant="outlined" size="small" onClick={onCancel}>Cancel</Button>
      </Stack>
    </Box>
  );
}

export default function ProjectsTab({ profile, onRefresh }) {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // index or 'new'
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (profile) setProjects(profile.projects || []);
  }, [profile]);

  const saveToServer = async (updated) => {
    setStatus({ type: '', message: '' });
    try {
      await api.put('/profile', { projects: updated });
      setStatus({ type: 'success', message: 'Projects saved.' });
      setEditing(null);
      onRefresh();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  const handleSave = (project, index) => {
    const updated = index === 'new'
      ? [...projects, project]
      : projects.map((p, i) => (i === index ? project : p));
    setProjects(updated);
    saveToServer(updated);
  };

  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    saveToServer(updated);
  };

  return (
    <Box>
      {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        onClick={() => setEditing('new')}
      >
        Add Project
      </Button>

      {editing === 'new' && (
        <Box sx={{ mb: 2, p: 2, border: '1px solid rgba(124,92,255,0.3)', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>New Project</Typography>
          <ProjectForm initial={emptyProject} onSave={(p) => handleSave(p, 'new')} onCancel={() => setEditing(null)} />
        </Box>
      )}

      {projects.map((project, i) => (
        <Accordion key={i} sx={{ mb: 1, border: '1px solid rgba(255,255,255,0.08)', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
              <Box>
                <Typography fontWeight={700}>{project.title}</Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                  {(project.stack || []).slice(0, 4).map((s) => (
                    <Chip key={s} label={s} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => setEditing(editing === i ? null : i)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => handleDelete(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {editing === i ? (
              <ProjectForm
                initial={{ ...project, stack: project.stack?.join(', ') || '' }}
                onSave={(p) => handleSave(p, i)}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <Typography color="text.secondary" variant="body2">{project.description}</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {projects.length === 0 && editing !== 'new' && (
        <Typography color="text.secondary" variant="body2">No projects yet. Click "Add Project" to start.</Typography>
      )}
    </Box>
  );
}
