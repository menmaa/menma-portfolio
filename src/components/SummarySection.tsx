import { Box, Typography, Container, Stack, Divider, List, ListItem, ListItemProps } from '@mui/material';
import ScrollInGrow from './ScrollInGrow';

function MarkedListItem(props: ListItemProps) {
  return <ListItem {...props} disableGutters sx={{ display: 'list-item' }} />
}

export default function SummarySection() {
  return (
    <Box
      id="about"
      component="section"
      sx={{
        py: 8,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <ScrollInGrow>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} mb={3} align="center">
            About Me
          </Typography>

          <Typography variant="body1" mb={3}>
            I am a dedicated software engineer with 4+ years of professional experience as the Lead Software Engineer and founder of a small game publishing company.
          </Typography>

          <Typography variant="body1" mb={3}>
            I led the development and maintenance of a private game server platform with over 70,000 registered users and $300,000+ in revenue generated over three years. My work involved building critical systems that ensured high availability and user experience, including a game launcher, user account and payment processing system, game statistics dashboard, internal developer tools, and many more.
          </Typography>

          <Typography variant="body1" mb={3}>
            I thrive on designing scalable, user-focused solutions. I&apos;m passionate about solving complex problems and contributing to high-impact projects in senior engineering roles. Whenever issues arose — whether technical, operational, or outside my comfort zone — I took initiative to resolve them. This mindset helped me rapidly expand my skillset across every single thing I had to deal with.
          </Typography>

          <Typography variant="body1" mb={3}>
            Despite operating with a fraction of the resources of multi-billion dollar companies in the same gaming space, I consistently delivered an experience that players praised as smoother, more reliable, and more enjoyable and I personally designed and maintained the systems that contributed this experience — all while working with a lean team and very limited budget.
          </Typography>

          <Typography
            variant="body2"
            fontStyle="italic"
            color="text.secondary"
            mt={2}
          >
            “Our users consistently told us our experience was better than the official servers. That was our benchmark — and we beat it.”
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Stack direction="column" spacing={4} justifyContent="center" flexWrap="wrap">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Key Skills & Strengths
              </Typography>
              <List dense sx={{ mt: 1, listStyle: 'disc', paddingLeft: '18px' }}>
                <MarkedListItem>Full-stack Engineering: Experienced across frontend, backend, databases, and DevOps.</MarkedListItem>
                <MarkedListItem>Systems Architecture: Designed and maintained scalable services supporting 70,000+ users with real-time interactions and secure payment integrations.</MarkedListItem>
                <MarkedListItem>Adaptability & Initiative: Took ownership of unfamiliar challenges — from integrating third-party APIs, to reverse engineering, to 3D Game Development concepts — and turned them into learning and growth opportunities.</MarkedListItem>
                <MarkedListItem>Leadership: Led end-to-end development, mentored contributors, and ensured technical alignment across services.</MarkedListItem>
                <MarkedListItem>Business Ownership: As company director, balanced product direction, system performance, and user growth — helping generate over $300K in revenue.</MarkedListItem>
                <MarkedListItem>Resilience & Problem-Solving: Proactive in resolving blockers, optimizing systems, and delivering features quickly without compromising on quality.</MarkedListItem>
                <MarkedListItem>User Experience Excellence: Built systems that delivered a smoother and more stable experience than large commercial platforms, according to player feedback — including launcher reliability, login flow, and stat dashboards.</MarkedListItem>
              </List>
            </Box>
          </Stack>
        </Container>
      </ScrollInGrow>
    </Box>
  );
}