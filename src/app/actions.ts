"use server";

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import z from 'zod/v4';

type SchemaErrorType = "INVALID_REQUEST_BODY" | "CHALLENGE_VERIFICATION_FAILED" | "INTERNAL_SERVER_ERROR";
type SecretType = "TURNSTILE_SECRET" | "HCAPTCHA_SECRET";

export type ContactState = {
    success?: boolean;
    code?: SchemaErrorType;
    message?: string;
    errors?: z.core.$ZodErrorTree<z.infer<typeof formSchema>>;
};

const sesClient = new SESv2Client({ region: 'us-east-1' });

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

const invalidRequestBodyError: ContactState = {
    success: false,
    code: "INVALID_REQUEST_BODY",
    message: 'Invalid Request Body'
};

const challengeVerificationError: ContactState = {
    success: false,
    code: "CHALLENGE_VERIFICATION_FAILED",
    message: "Challenge Verification Failed. Please try again."
};

const invalidChallengeError: ContactState = {
    success: false,
    code: "CHALLENGE_VERIFICATION_FAILED",
    message: "Invalid Challenge Verification Method. Please try again."
};

const internalServerError: ContactState = {
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error"
};

const successState: ContactState = {
    success: true,
    message: 'Message Sent!'
};

let turnstileSecret = process.env.TURNSTILE_SECRET;
let hcaptchaSecret = process.env.HCAPTCHA_SECRET;

export async function contact(currentState: ContactState | null, formData: FormData): Promise<ContactState> {
    const fromEmailAddress = process.env.FROM_EMAIL_ADDRESS;
    const toEmailAddress = process.env.TO_EMAIL_ADDRESS;

    if(!fromEmailAddress || !toEmailAddress) {
        console.error("FROM_EMAIL_ADDRESS or TO_EMAIL_ADDRESS not provided");
        return internalServerError;
    }

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
            return { ...invalidRequestBodyError, errors: z.treeifyError(result.error) };
        }

        if (result.data['cf-turnstile-response']) {
            const verify = await verifyTurnstileResponse(result.data['cf-turnstile-response']);
            if (!verify) {
                return challengeVerificationError;
            }
        } else if (result.data['h-captcha-response']) {
            const verify = await verifyHCaptchaResponse(result.data['h-captcha-response']);
            if (!verify) {
                return challengeVerificationError;
            }
        } else {
            return invalidChallengeError;
        }

        const body: SendEmailCommandInput = {
            FromEmailAddress: fromEmailAddress,
            Destination: {
                ToAddresses: [toEmailAddress]
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
        return successState;
    } catch (err) {
        console.error(err);
        return internalServerError;
    }
}

export async function verifyTurnstileResponse(response: string, ipAddress?: string): Promise<boolean> {
    if (!turnstileSecret) {
        turnstileSecret = await retrieveSecrets('TURNSTILE_SECRET');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('secret', turnstileSecret);
    searchParams.append('response', response);
    if (ipAddress) searchParams.append('remoteip', ipAddress);

    const res = await retryFetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
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
    if (!hcaptchaSecret) {
        hcaptchaSecret = await retrieveSecrets('HCAPTCHA_SECRET');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('secret', hcaptchaSecret);
    searchParams.append('response', response);
    if (ipAddress) searchParams.append('remoteip', ipAddress);

    const res = await retryFetch("https://api.hcaptcha.com/siteverify", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString()
    });
    const data = await res.json();

    return data.success;
}

async function retrieveSecrets(secret: SecretType): Promise<string> {
    const region = process.env.AWS_REGION;
    const secretId = process.env.AWS_SECRETS_ID;

    if(!region || !secretId) {
        throw new Error('AWS_REGION or AWS_SECRETS_ID not provided');
    }

    const client = new SecretsManagerClient({ region });
    const data = await client.send(new GetSecretValueCommand({ SecretId: secretId }));

    if('SecretString' in data) {
        const secrets = JSON.parse(data.SecretString as string);
        if(!secrets[secret]) {
            throw new Error(`AWS Secrets missing ${secret} entry.`);
        }
        return secrets[secret];
    }

    throw new Error('Failed to retrieve AWS Secret String');
}

async function retryFetch(
    url: string | URL | Request,
    options: RequestInit = {},
    retries: number = 3,
    retryDelay: number = 1000
): Promise<Response> {
    const errors: Error[] = [];

    while (errors.length <= retries) {
        try {
            return await fetch(url, options);
        } catch (error) {
            // Add the error to the list of errors
            errors.push(error as Error);

            // If the number of errors is less than the number of retries,
            // wait for the specified delay before retrying using exponential backoff
            if (errors.length <= retries) {
                await sleep(retryDelay * Math.pow(2, errors.length - 1));
            }
        }
    }

    // If we reach here, it means all retries have failed.
    throw new Error("Max retries reached.");
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}