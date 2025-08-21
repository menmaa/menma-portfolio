import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ScrollInGrow from './ScrollInGrow';
import CustomLink from './CustomLink';

type Project = {
  title: string;
  description: string;
  stack: string[];
  url?: string;
  demoUrl?: string | null;
  sourceUrl?: string;
};

const projects: Project[] = [
  {
    title: 'Project Aurora',
    description:
      'A discord-like real-time communications social media platform that aims to deliver a secure, resilient and exquisite performance at huge scale. Currently under development.',
    stack: ['Java', 'Spring WebFlux', 'REST API', 'Redis', 'MongoDB', 'WebSockets', 'Docker', 'AWS', 'Microservices', 'Apache Kafka'],
    demoUrl: null,
    sourceUrl: 'https://github.com/menmaa/aurora'
  },
  {
    title: 'Game Launcher & Auth System',
    description:
      'A seamless, multi-lingual launcher with auto-updates, secure authentication, integrated MFA, automatic game patching/repair and streamlined UX for 70,000+ users.',
    stack: ['Electron', 'React', 'Node.js', 'Express.js', 'C++', 'C#', 'Win32 API', 'REST API', 'MySQL', 'Redis', 'Cloudflare'],
  },
  {
    title: 'User Account & Payments System',
    description:
      'A secure user account system with registration, login, MFA, and password resets. Integrated Stripe for payments and custom Twitch drops API.',
    stack: ['React', 'Node.js', 'Express.js', 'REST API', 'MySQL', 'Redis', 'Twitch API', 'Stripe API', 'Webhooks', 'Cloudflare'],
  },
  {
    title: 'Game Statistics Web UI',
    description:
      'An interactive dashboard showing damage statistics, skills used, DPS rankings, and encounter history. Boosted retention and competition.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'MySQL', 'Prisma ORM', 'REST API', 'Docker', 'AWS Lambda', 'Cloudflare R2', 'Cloudflare Images'],
    demoUrl: 'https://moongourd.menma.dev'
  },
  {
    title: 'Menmu Discord Bot',
    description: 'A simple discord music bot with support for YouTube playback and live streams.',
    stack: ['Java', 'Discord4j', 'Lavalink', 'YouTube API', 'Docker', 'AWS ECS'],
    sourceUrl: 'https://github.com/menmaa/MenmuDiscordBot'
  },
  {
    title: 'Internal Developer Tools',
    description:
      'A suite of internal tools for content creation, update deployment, and analytics aggregation, enabling faster iteration and fewer bugs.',
    stack: ['Node.js', 'React', 'C++', 'CLI Tools', 'Discord API', 'AWS', 'Azure'],
  },
];

export default function ProjectsSection() {
  return (
    <Box id="projects" component="section" sx={{ py: 8, bgcolor: 'background.default', color: 'text.primary' }}>
      <ScrollInGrow>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" mb={6}>
            Featured Projects
          </Typography>

          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 3,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>

                    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1 }}>
                      {project.stack.map((tech) => (
                        <Chip key={tech} label={tech} variant="outlined" size="small" />
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions>
                    {project.sourceUrl && <Button
                      variant="outlined"
                      LinkComponent={CustomLink}
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener"
                      endIcon={<OpenInNewIcon/>}
                      fullWidth
                    >Source Code</Button>}
                    
                    {project.url && <Button
                      variant="outlined"
                      LinkComponent={CustomLink}
                      href={project.url}
                      fullWidth
                    >Case Study</Button>}

                    {project.demoUrl && <Button
                      variant="contained"
                      LinkComponent={CustomLink}
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener"
                      endIcon={<OpenInNewIcon/>}
                      fullWidth
                    >Live Demo</Button>}

                    {project.demoUrl === null && <Button
                      variant="contained"
                      disabled
                      fullWidth
                    >Live Demo Coming Soon</Button>}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </ScrollInGrow>
    </Box>
  );
}