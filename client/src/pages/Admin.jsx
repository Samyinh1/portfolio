import BadgeIcon from '@mui/icons-material/Badge';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import InboxIcon from '@mui/icons-material/Inbox';
import TimelineIcon from '@mui/icons-material/Timeline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Alert, Box, Button, Container, Paper, Stack,
  Tab, Tabs, TextField, Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import ExperienceTab from '../components/admin/ExperienceTab';
import MessageInbox from '../components/admin/MessageInbox';
import ProfileTab from '../components/admin/ProfileTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ResumeParseTab from '../components/admin/ResumeParseTab';
import SkillsTab from '../components/admin/SkillsTab';

function LoginPage({ onLogin }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', creds);
      localStorage.setItem('portfolioToken', res.data.token);
      onLogin();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Login failed.' });
    }
  };

  return (
    <Box minHeight="100vh" sx={{ background: '#08111f', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800} color="primary" sx={{ mb: 3 }}>Admin Login</Typography>
          {status.message && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
          <Stack component="form" onSubmit={login} spacing={2}>
            <TextField label="Email" name="email" type="email" required
              value={creds.email} onChange={(e) => setCreds((c) => ({ ...c, email: e.target.value }))} />
            <TextField label="Password" name="password" type="password" required
              value={creds.password} onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))} />
            <Button type="submit" variant="contained" size="large">Login</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const tabs = [
    { label: 'Profile', icon: <BadgeIcon fontSize="small" /> },
    { label: 'Skills', icon: <CodeIcon fontSize="small" /> },
    { label: 'Projects', icon: <FolderIcon fontSize="small" /> },
    { label: 'Experience', icon: <TimelineIcon fontSize="small" /> },
    { label: 'Resume OCR', icon: <UploadFileIcon fontSize="small" /> },
    { label: 'Inbox', icon: <InboxIcon fontSize="small" /> }
  ];

  return (
    <Box minHeight="100vh" sx={{ background: '#08111f' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,17,31,0.9)' }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
            <Typography variant="h6" fontWeight={800} color="primary">Portfolio Admin</Typography>
            <Button variant="outlined" size="small" onClick={onLogout}>Logout</Button>
          </Stack>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ '& .MuiTab-root': { minHeight: 44, fontSize: '0.8rem' } }}
          >
            {tabs.map(({ label, icon }) => (
              <Tab key={label} label={label} icon={icon} iconPosition="start" />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Tab content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Typography color="text.secondary">Loading profile…</Typography>
        ) : (
          <>
            {tab === 0 && <ProfileTab profile={profile} onRefresh={fetchProfile} />}
            {tab === 1 && <SkillsTab profile={profile} onRefresh={fetchProfile} />}
            {tab === 2 && <ProjectsTab profile={profile} onRefresh={fetchProfile} />}
            {tab === 3 && <ExperienceTab profile={profile} onRefresh={fetchProfile} />}
            {tab === 4 && <ResumeParseTab profile={profile} onRefresh={fetchProfile} />}
            {tab === 5 && <MessageInbox />}
          </>
        )}
      </Container>
    </Box>
  );
}

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('portfolioToken'));

  const logout = () => {
    localStorage.removeItem('portfolioToken');
    setIsLoggedIn(false);
  };

  return isLoggedIn
    ? <AdminPanel onLogout={logout} />
    : <LoginPage onLogin={() => setIsLoggedIn(true)} />;
}

export default Admin;
