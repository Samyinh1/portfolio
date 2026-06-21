import { Box, Typography } from '@mui/material';

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography color="secondary" fontWeight={800} letterSpacing={1.5} textTransform="uppercase" variant="overline">
        {eyebrow}
      </Typography>
      <Typography variant="h3">{title}</Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mx: 'auto', mt: 1, maxWidth: 680 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default SectionTitle;
