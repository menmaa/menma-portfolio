import type { Metadata } from "next";
import './globals.css';
import { theme } from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";

export const metadata: Metadata = {
  title: "Fotis Makris - Full-Stack Software Engineer",
  description: `
    I built and led the technology powering a 70,000-user gaming platform that generated $300K+ revenue.
    I design scalable systems, solve complex problems, and create seamless user experiences.
  `,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
