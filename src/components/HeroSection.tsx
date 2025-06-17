import { Box, Button, Stack, Container, Grow, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CustomLink from './CustomLink';

export default function HeroSection() {
  return (
    <Box
      id="hero"
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Grow in={true}>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="flex-start">
            <Typography variant="h2" fontWeight={700}>
              Hi, I&apos;m Fotis
            </Typography>

            <Typography variant="h5" color="text.secondary">
              Full-Stack Software Engineer | Distributed Systems
            </Typography>

            <Typography variant="body1" maxWidth="sm">
              I built and led the technology powering a 70,000-user gaming platform that generated $300K+ revenue.
              I design scalable systems, solve complex problems, and create seamless user experiences.
              You know... the usual.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button LinkComponent={CustomLink} variant="contained" color="primary" href="/#about">
                Learn More
              </Button>
              <Button variant="outlined" href="/resume.pdf" target="_blank" endIcon={<OpenInNewIcon />}>
                Download Resume
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Grow>
    </Box>
  );
}
