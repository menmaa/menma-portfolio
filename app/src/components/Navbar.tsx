"use client";

import React from 'react';
import CustomLink from './CustomLink';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { Divider, Stack, Typography } from '@mui/material';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const StyledButton = styled(Button)(() => ({
  minWidth: 0,
  paddingInline: 12
}));

export default function AppNavBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    return true;
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="md">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <StyledButton LinkComponent={CustomLink} color="primary" size="small" sx={{ minWidth: 0 }} aria-label="Home" href="/">
                <HomeRoundedIcon fontSize="small" />
              </StyledButton>
              <StyledButton LinkComponent={CustomLink} variant="text" color="primary" size="small" href="/#about">
                About
              </StyledButton>
              <StyledButton LinkComponent={CustomLink} variant="text" color="primary" size="small" href="/#tech">
                Tech Experience
              </StyledButton>
              <StyledButton LinkComponent={CustomLink} variant="text" color="primary" size="small" href="/#projects">
                Projects
              </StyledButton>
              <StyledButton LinkComponent={CustomLink} variant="text" color="primary" size="small" href="/#contact">
                Contact
              </StyledButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none'}}}>
              <Typography variant="body1" color="textPrimary" sx={{lineHeight: 1}} fontSize="medium">menma.dev_</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <IconButton color="primary" size="small" href="mailto:***REMOVED***" aria-label="Email Button" target="_blank" rel="noopener">
              <EmailIcon fontSize="small" />
            </IconButton>
            <IconButton color="primary" size="small" href="https://github.com/menmaa" aria-label="GitHub Button" target="_blank" rel="noopener">
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton color="primary" size="small" href="https://linkedin.com/in/menma" aria-label="Linked In Button" target="_blank" rel="noopener">
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" size="small" onClick={toggleDrawer(true)}>
              <MenuIcon fontSize="small" />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem component="a" href="/#" onClick={toggleDrawer(false)}>Home</MenuItem>
                <MenuItem component="a" href="/#about" onClick={toggleDrawer(false)}>About</MenuItem>
                <MenuItem component="a" href="/#tech" onClick={toggleDrawer(false)}>Tech Experience</MenuItem>
                <MenuItem component="a" href="/#projects" onClick={toggleDrawer(false)}>Projects</MenuItem>
                <MenuItem component="a" href="/#contact" onClick={toggleDrawer(false)}>Contact</MenuItem>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row">
                  <IconButton color="primary" href="mailto:***REMOVED***" aria-label="Email Button" target="_blank" rel="noopener">
                    <EmailIcon />
                  </IconButton>
                  <IconButton color="primary"href="https://github.com/menmaa" aria-label="GitHub Button" target="_blank" rel="noopener">
                    <GitHubIcon />
                  </IconButton>
                  <IconButton color="primary" href="https://linkedin.com/in/menma" aria-label="Linked In Button" target="_blank" rel="noopener">
                    <LinkedInIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}