import { Box, Card, CardContent, Container, Grid, Paper, Skeleton, Stack } from '@mui/material';

export function HeroSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ pb: 10, pt: { xs: 7, md: 12 } }}>
      <Grid alignItems="center" container spacing={5}>
        <Grid item md={7} xs={12}>
          <Stack spacing={3}>
            <Skeleton variant="rounded" width={220} height={32} sx={{ borderRadius: 6 }} />
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" width="80%" height={28} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rounded" width={160} height={44} sx={{ borderRadius: 3 }} />
              <Skeleton variant="rounded" width={160} height={44} sx={{ borderRadius: 3 }} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={5} xs={12}>
          <Paper sx={{ p: 4 }}>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width="85%" height={36} sx={{ mt: 1, mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" width={80 + i * 10} height={28} sx={{ borderRadius: 6 }} />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export function SkillsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width="50%" height={40} />
      </Stack>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={90 + (i % 4) * 20} height={34} sx={{ borderRadius: 6 }} />
          ))}
        </Box>
      </Paper>
    </Container>
  );
}

export function ProjectsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width="55%" height={40} />
      </Stack>
      <Grid container spacing={3}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid item key={i} md={4} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Skeleton variant="text" width="70%" height={30} />
                <Skeleton variant="rounded" height={60} sx={{ mt: 1, mb: 2 }} />
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} variant="rounded" width={60} height={24} sx={{ borderRadius: 4 }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export function ExperienceSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width="50%" height={40} />
      </Stack>
      <Stack spacing={2}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Paper key={i} sx={{ p: 3 }}>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width="55%" height={32} />
            <Skeleton variant="text" width="40%" height={22} />
            <Skeleton variant="rounded" height={48} sx={{ mt: 1 }} />
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
