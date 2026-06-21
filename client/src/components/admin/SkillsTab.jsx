import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Chip, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/client';

function TagList({ label, color, items, onAdd, onDelete }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const v = input.trim();
    if (v && !items.includes(v)) { onAdd(v); setInput(''); }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={700} color={color || 'primary'} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        {items.map((item) => (
          <Chip
            key={item}
            label={item}
            size="small"
            onDelete={() => onDelete(item)}
            deleteIcon={<CloseIcon fontSize="small" />}
            variant="outlined"
            sx={{ borderColor: color === 'secondary' ? 'secondary.main' : color === 'warning' ? 'warning.main' : 'primary.main' }}
          />
        ))}
        {items.length === 0 && (
          <Typography variant="caption" color="text.disabled">None added yet</Typography>
        )}
      </Stack>
      <TextField
        size="small"
        placeholder={`Add ${label.toLowerCase()}…`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleAdd}>
                <AddIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ width: 280 }}
      />
    </Box>
  );
}

export default function SkillsTab({ profile, onRefresh }) {
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [focusHeadline, setFocusHeadline] = useState('');
  const [focusHighlights, setFocusHighlights] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!profile) return;
    setSkills(profile.skills || []);
    setTools(profile.tools || []);
    setUpcoming(profile.upcomingTechs || []);
    setFocusHeadline(profile.currentFocus?.headline || '');
    setFocusHighlights((profile.currentFocus?.highlights || []).join(', '));
  }, [profile]);

  const save = async () => {
    setStatus({ type: '', message: '' });
    try {
      await api.put('/profile', {
        skills,
        tools,
        upcomingTechs: upcoming,
        currentFocus: {
          headline: focusHeadline,
          highlights: focusHighlights.split(',').map((s) => s.trim()).filter(Boolean)
        }
      });
      setStatus({ type: 'success', message: 'Skills & Focus saved.' });
      onRefresh();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  return (
    <Box>
      {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

      <Box sx={{ mb: 3, p: 2.5, border: '1px solid rgba(124,92,255,0.2)', borderRadius: 3, background: 'rgba(124,92,255,0.05)' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Current Focus Card</Typography>
        <TextField
          fullWidth label="Headline" value={focusHeadline}
          onChange={(e) => setFocusHeadline(e.target.value)}
          placeholder="Building AI-powered enterprise products"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="Highlights (comma-separated)" value={focusHighlights}
          onChange={(e) => setFocusHighlights(e.target.value)}
          placeholder="OpenAI integrations, MERN stack, Production React"
          helperText="These appear as chips on the hero card"
        />
      </Box>

      <TagList label="Skills" color="primary" items={skills} onAdd={(v) => setSkills((s) => [...s, v])} onDelete={(v) => setSkills((s) => s.filter((x) => x !== v))} />
      <TagList label="Tools" color="secondary" items={tools} onAdd={(v) => setTools((s) => [...s, v])} onDelete={(v) => setTools((s) => s.filter((x) => x !== v))} />
      <TagList label="Upcoming / Learning" color="warning" items={upcoming} onAdd={(v) => setUpcoming((s) => [...s, v])} onDelete={(v) => setUpcoming((s) => s.filter((x) => x !== v))} />

      <Button variant="contained" onClick={save} sx={{ mt: 1 }}>Save All</Button>
    </Box>
  );
}
