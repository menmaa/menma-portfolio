"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { useActionState, useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod/v4';
import { contact, ContactState } from '@/app/actions';
import ScrollInGrow from './ScrollInGrow';
import Challenge, { ChallengeRef, ChallengeType } from './Challenge';

const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be between 2-32 characters")
    .max(32, "Name must be between 2-32 characters")
    .regex(/^[\p{L}\s]+$/u, "Name can only include alphabetical characters"),
  email: z.email(),
  subject: z.string().max(128, "Subject must be less than 128 characters long").optional(),
  message: z.string().min(1, "Message is required").max(2048, "Message must be less than 2048 characters long.")
});

const defaultForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

type FormSchemaType = z.infer<typeof formSchema>;
type FormSchemaKey = keyof FormSchemaType;
type FormErrors = {
  [key in FormSchemaKey]?: string | null;
};

export default function ContactSection() {
  const [state, formAction, isPending] = useActionState<ContactState | null, FormData>(contact, null);
  const [formData, setFormData] = useState<FormSchemaType>(defaultForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [challengeResponse, setChallengeResponse] = useState<string>('');
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const challengeRef = useRef<ChallengeRef>(null);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setFormData(defaultForm);
    setEnableSubmit(false);
  }, []);

  useEffect(() => {
    setOpenSnackbar(state !== null);
    if (!state) return;

    setChallengeResponse('');
    challengeRef.current?.reset();

    if (state.success) {
      resetForm();
      return;
    }

    if (state.code === "CHALLENGE_VERIFICATION_FAILED") {
      challengeRef.current?.fallback();
    }
  }, [state, resetForm]);

  useEffect(() => {
    const result = formSchema.safeParse(formData);
    setEnableSubmit(result.success && !!challengeResponse);
  }, [formData, challengeResponse]);

  const validate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const result = formSchema.shape[e.target.name as FormSchemaKey].safeParse(e.target.value);
    if (!result.success) {
      setFormErrors({ ...formErrors, [e.target.name]: z.flattenError(result.error).formErrors[0] });
      return;
    }
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (formErrors[e.target.name as FormSchemaKey] === undefined) return;
    return validate(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    return validate(e);
  };

  const onChallengeSuccess = (type: ChallengeType, response: string) => {
    setChallengeResponse(response);
  }

  const onChallengeExpired = () => {
    setChallengeResponse('');
  };

  return (
    <Box id="contact" component="section" sx={{ py: 8, bgcolor: 'background.default', color: 'text.primary' }}>
      <ScrollInGrow onScrollOut={resetForm}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Contact Me
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" component="p" mb={2}>
            Have a project, opportunity, or question? Feel free to reach out!
          </Typography>

          <Grid container direction="column" component="form" action={formAction} spacing={3}>
            <Grid>
              <TextField
                fullWidth
                name="name"
                label="Your Name"
                variant="outlined"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="email"
                label="Your Email"
                type="text"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="subject"
                label="Subject"
                variant="outlined"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="message"
                label="Message"
                multiline
                minRows={6}
                variant="outlined"
                required
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!formErrors.message}
                helperText={formErrors.message}
              />
            </Grid>
            <Challenge
              onSuccess={onChallengeSuccess}
              onExpire={onChallengeExpired}
              ref={challengeRef} />
            <Grid>
              <Button disabled={!enableSubmit} fullWidth type="submit" variant="contained" size="large" loading={isPending}>
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Container>
      </ScrollInGrow>

      {state && <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={state.success ? "success" : "error"} variant="filled" onClose={() => setOpenSnackbar(false)}>
          {state.message}
        </Alert>
      </Snackbar>}
    </Box>
  );
}
