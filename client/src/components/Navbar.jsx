import GitHubIcon from '@mui/icons-material/GitHub';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { SiGitlab } from 'react-icons/si';

const NAV_ITEMS = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' }
];

function Navbar({ profile }) {
  return (
    <AppBar color="transparent" elevation={0} position="sticky" sx={{ backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            color="primary"
            fontWeight={800}
            variant="h6"
            component="a"
            href="#"
            sx={{ textDecoration: 'none', letterSpacing: '-0.5px' }}
          >
            {profile.name}
          </Typography>

          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {NAV_ITEMS.map(({ label, href }) => (
                <Button
                  key={label}
                  href={href}
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 1.5,
                    '&:hover': { color: 'primary.main', background: 'rgba(124,92,255,0.1)' }
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {profile.socials?.github && (
              <Tooltip title="GitHub">
                <IconButton
                  aria-label="GitHub"
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {profile.socials?.gitlab && (
              <Tooltip title="GitLab">
                <IconButton
                  aria-label="GitLab"
                  href={profile.socials.gitlab}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ '&:hover': { color: 'secondary.main' } }}
                >
                  <SiGitlab size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
