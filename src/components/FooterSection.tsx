"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useCallback } from 'react';

export default function Footer() {
  const onReturnClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  }, []);

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Fotis Makris. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              href="mailto:***REMOVED***"
              color="inherit"
              aria-label="Email"
              sx={{ color: 'text.secondary' }}
            >
              <EmailIcon />
            </IconButton>
            <IconButton
              href="https://github.com/menmaa"
              target="_blank"
              rel="noopener"
              color="inherit"
              aria-label="GitHub"
              sx={{ color: 'text.secondary' }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://linkedin.com/in/menma"
              target="_blank"
              rel="noopener"
              color="inherit"
              aria-label="LinkedIn"
              sx={{ color: 'text.secondary' }}
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>

          <Button
            onClick={onReturnClick}
            endIcon={<KeyboardArrowUpIcon/>}
            sx={{ color: 'text.secondary' }}
          >Return to Top</Button>
        </Stack>
      </Container>
    </Box>
  );
}
