import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Alert, Box, Button, Checkbox, Chip, Divider, FormControlLabel,
  Grid, LinearProgress, Paper, Stack, Typography
} from '@mui/material';
import { useState } from 'react';
import api from '../../api/client';

export default function ResumeParseTab({ profile, onRefresh }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [applyStatus, setApplyStatus] = useState({ type: '', message: '' });

  const parseResume = async () => {
    if (!file) return;
    setParsing(true);
    setResult(null);
    setApplyStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/profile/parse-resume', formData);
      setResult(res.data);

      // Pre-select items not already in profile
      const existing = new Set([...(profile?.skills || []), ...(profile?.tools || [])].map((s) => s.toLowerCase()));
      setSelectedSkills(res.data.extractedSkills.filter((s) => !existing.has(s.toLowerCase())));
      setSelectedTools(res.data.extractedTools.filter((s) => !existing.has(s.toLowerCase())));
    } catch (err) {
      setResult({ error: err.response?.data?.message || 'Parsing failed.' });
    } finally {
      setParsing(false);
    }
  };

  const toggleSkill = (name, list, setList) => {
    setList((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const applySelected = async () => {
    setApplyStatus({ type: '', message: '' });
    const mergedSkills = [...new Set([...(profile?.skills || []), ...selectedSkills])];
    const mergedTools = [...new Set([...(profile?.tools || []), ...selectedTools])];

    try {
      await api.put('/profile', { skills: mergedSkills, tools: mergedTools });
      setApplyStatus({ type: 'success', message: `Added ${selectedSkills.length} skills and ${selectedTools.length} tools to your profile.` });
      onRefresh();
    } catch (err) {
      setApplyStatus({ type: 'error', message: err.response?.data?.message || 'Apply failed.' });
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload your PDF resume to automatically extract skills and tools. Review the results, then apply the ones you want to your profile.
      </Typography>

      {/* Upload area */}
      <Paper
        variant="outlined"
        sx={{
          p: 4, textAlign: 'center', mb: 3,
          border: '2px dashed rgba(124,92,255,0.4)',
          background: 'rgba(124,92,255,0.04)',
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main', background: 'rgba(124,92,255,0.08)' },
          transition: 'all 0.2s'
        }}
        component="label"
      >
        <input hidden type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography fontWeight={600}>{file ? file.name : 'Click to select PDF resume'}</Typography>
        <Typography variant="caption" color="text.secondary">PDF only, up to 5 MB</Typography>
      </Paper>

      <Button
        variant="contained"
        startIcon={<AutoAwesomeIcon />}
        onClick={parseResume}
        disabled={!file || parsing}
        sx={{ mb: 2 }}
      >
        {parsing ? 'Parsing…' : 'Extract Skills from PDF'}
      </Button>

      {parsing && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      {result?.error && <Alert severity="error" sx={{ mb: 2 }}>{result.error}</Alert>}
      {applyStatus.message && <Alert severity={applyStatus.type} sx={{ mb: 2 }}>{applyStatus.message}</Alert>}

      {result && !result.error && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>
                  Extracted Skills ({result.extractedSkills.length})
                </Typography>
                <Stack spacing={0}>
                  {result.extractedSkills.map((s) => (
                    <FormControlLabel
                      key={s}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedSkills.includes(s)}
                          onChange={() => toggleSkill(s, selectedSkills, setSelectedSkills)}
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{s}</span>
                          {(profile?.skills || []).includes(s) && (
                            <Chip label="already added" size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                          )}
                        </Stack>
                      }
                    />
                  ))}
                  {result.extractedSkills.length === 0 && (
                    <Typography variant="caption" color="text.disabled">None found</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} color="secondary" sx={{ mb: 1.5 }}>
                  Extracted Tools ({result.extractedTools.length})
                </Typography>
                <Stack spacing={0}>
                  {result.extractedTools.map((s) => (
                    <FormControlLabel
                      key={s}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedTools.includes(s)}
                          onChange={() => toggleSkill(s, selectedTools, setSelectedTools)}
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{s}</span>
                          {(profile?.tools || []).includes(s) && (
                            <Chip label="already added" size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                          )}
                        </Stack>
                      }
                    />
                  ))}
                  {result.extractedTools.length === 0 && (
                    <Typography variant="caption" color="text.disabled">None found</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="success"
            onClick={applySelected}
            disabled={selectedSkills.length === 0 && selectedTools.length === 0}
          >
            Apply {selectedSkills.length + selectedTools.length} Selected to Profile
          </Button>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Raw Text Preview</Typography>
          <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto', background: 'rgba(0,0,0,0.2)' }}>
            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {result.rawTextPreview}
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}
