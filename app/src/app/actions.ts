"use server";

import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import z from 'zod/v4';

type SchemaErrorType = "INVALID_REQUEST_BODY" | "CHALLENGE_VERIFICATION_FAILED" | "INTERNAL_SERVER_ERROR";

export type ContactState = {
    success?: boolean;
    code?: SchemaErrorType;
    message?: string;
    errors?: z.core.$ZodErrorTree<z.infer<typeof formSchema>>;
};

const formSchema = z.object({
    name: z.string()
        .min(2, "Name must be between 2-32 characters")
        .max(32, "Name must be between 2-32 characters")
        .regex(/^[\p{L}\s]+$/u, "Name can only include alphabetical characters"),
    email: z.email(),
    subject: z.string().max(128, "Subject must be less than 128 characters long").optional(),
    message: z.string().min(1, "Message is required").max(2048, "Message must be less than 2048 characters long."),
    'cf-turnstile-response': z.string().nullable(),
    'h-captcha-response': z.string().nullable()
});

const sesClient = new SESv2Client({ region: process.env.AWS_REGION });

export async function contact(currentState: ContactState | null, formData: FormData): Promise<ContactState> {
    try {
        const result = await formSchema.safeParseAsync({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            'cf-turnstile-response': formData.get('cf-turnstile-response'),
            'h-captcha-response': formData.get('h-captcha-response')
        });
        if (!result.success) {
            const errors = z.treeifyError(result.error);
            return { success: false, code: "INVALID_REQUEST_BODY", message: 'Invalid Request Body', errors };
        }

        if (result.data['cf-turnstile-response']) {
            const verify = await verifyTurnstileResponse(result.data['cf-turnstile-response']);
            if (!verify) {
                return { success: false, code: "CHALLENGE_VERIFICATION_FAILED", message: "Challenge Verification Failed. Please try again." };
            }
        } else if (result.data['h-captcha-response']) {
            const verify = await verifyHCaptchaResponse(result.data['h-captcha-response']);
            if (!verify) {
                return { success: false, code: "CHALLENGE_VERIFICATION_FAILED", message: "Challenge Verification Failed. Please try again." };
            }
        } else {
            return { success: false, code: "CHALLENGE_VERIFICATION_FAILED", message: "Invalid Challenge Verification Method. Please try again." };
        }

        const body: SendEmailCommandInput = {
            FromEmailAddress: "Menma.dev Contact Form <***REMOVED***>",
            Destination: {
                ToAddresses: ["***REMOVED***"]
            },
            ReplyToAddresses: [result.data.email],
            Content: {
                Simple: {
                    Subject: {
                        Data: result.data.subject,
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Text: {
                            Data: result.data.message,
                            Charset: 'UTF-8'
                        }
                    }
                }
            }
        };

        await sesClient.send(new SendEmailCommand(body));
        return { success: true, message: 'Message Sent!' };
    } catch (err) {
        console.error(err);
        return { success: false, code: "INTERNAL_SERVER_ERROR", message: 'Internal Server Error' };
    }
}

export async function verifyTurnstileResponse(response: string, ipAddress?: string): Promise<boolean> {
    if (!process.env.TURNSTILE_SECRET) {
        throw new Error("Missing TURNSTILE_SECRET");
    }

    const searchParams = new URLSearchParams();
    searchParams.append('secret', process.env.TURNSTILE_SECRET);
    searchParams.append('response', response);
    if (ipAddress) searchParams.append('remoteip', ipAddress);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString()
    });
    const data = await res.json();

    return data.success;
}

export async function verifyHCaptchaResponse(response: string, ipAddress?: string): Promise<boolean> {
    if (!process.env.HCAPTCHA_SECRET) {
        throw new Error("Missing HCAPTCHA_SECRET");
    }

    const searchParams = new URLSearchParams();
    searchParams.append('secret', process.env.HCAPTCHA_SECRET);
    searchParams.append('response', response);
    if (ipAddress) searchParams.append('remoteip', ipAddress);

    const res = await fetch("https://api.hcaptcha.com/siteverify", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString()
    });
    const data = await res.json();

    return data.success;
}