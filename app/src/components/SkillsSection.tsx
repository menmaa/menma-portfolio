import { Box, Container, List, ListItem, Stack, Typography } from "@mui/material";
import { StaticImageData } from 'next/image';
import ScrollInGrow from "./ScrollInGrow";

type Skill = {
  name: string;
  icon?: StaticImageData;
};

type SkillCategory = {
  title: string;
  entries: Skill[];
};

const categories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    entries: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'C/C++' },
      { name: 'C#' },
      { name: 'Java' },
      { name: 'SQL' }
    ]
  },
  {
    title: 'Backend & Frameworks',
    entries: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Next.js' },
      { name: 'Prisma ORM' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'Microservices' },
      { name: 'Nginx' },
      { name: 'Android SDK' }
    ]
  },
  {
    title: 'REST APIs',
    entries: [
      { name: 'Endpoint Design & Deployment' },
      { name: 'Authentication/Authorization (API Keys, OAuth2, JWT, MFA, Custom)' },
      { name: 'Rate Limiting' },
      { name: 'Idempotency, Response Caching' },
      { name: 'CORS' },
      { name: 'Pagination' },
      { name: 'Event-Driven Design (Webhooks / WebSockets)'}
    ]
  },
  {
    title: 'Frontend',
    entries: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Electron' },
      { name: 'Tailwind CSS' },
      { name: 'Material UI'}
    ]
  },
  {
    title: 'Databases & Caching',
    entries: [
      { name: 'MySQL/MariaDB' },
      { name: 'MongoDB' },
      { name: 'SQL Server' },
      { name: 'Aurora RDS (AWS)' },
      { name: 'Redis' }
    ]
  },
  {
    title: 'Cloud',
    entries: [
      { name: 'AWS (EC2, ECS, VPC, S3, ELB(ALB/NLB), API Gateway, Aurora RDS, ElastiCache, Lambda, IAM)' },
      { name: 'Azure (Virtual Machines, App Services, Static Web Apps, Storage Accounts)' },
      { name: 'Cloudflare (DNS, CDN, R2, Stream, Pages)' }
    ]
  },
  {
    title: "Message Queues & Data Streaming",
    entries: [
      { name: "RabbitMQ" },
      { name: "Apache Kafka" }
    ]
  },
  {
    title: "Systems Engineering",
    entries: [
      { name: 'Win32 API' },
      { name: 'Linux/Windows Server Admin' },
      { name: 'Sockets Programming' },
      { name: 'System/Network Security' },
      { name: 'Reverse Engineering' }
    ]
  },
  {
    title: "Planning, Testing & Other Tools",
    entries: [
      { name: "Git (GitHub)" },
      { name: "CI/CD (Github Actions)" },
      { name: "Agile (Jira, Azure DevOps, Trello)" },
      { name: "Unit/Integration Testing (Jest, Vitest, Postman)" },
      { name: "Terraform" }
    ]
  }
];

export default function SkillsSection() {
  return (
    <Box
      id="tech"
      component="section"
      sx={{
        py: 8,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <ScrollInGrow>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" mb={6}>
            Tech Experience
          </Typography>

          <Stack
            spacing={4}
            direction={{ xs: 'column', md: 'row' }}
            flexWrap="wrap"
            useFlexGap
          >
            {categories.map((category, i) => (
              <Box key={i} width={{ md: 'calc(50% - 16px)' }}>
                <Typography variant="h6">{category.title}</Typography>
                <List dense sx={{ paddingLeft: '18px', listStyle: 'disc', color: 'white' }}>
                  {category.entries.map((skill, i) => (
                    <ListItem key={i} disablePadding sx={{ display: 'list-item' }}>
                      <Typography variant="body2">{skill.name}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Stack>
        </Container>
      </ScrollInGrow>
    </Box>
  );
}