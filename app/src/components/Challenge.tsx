import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import React from "react";

export type ChallengeType = "turnstile" | "hcaptcha";

type ChallengeResponse = {
    type: ChallengeType;
    value: string | null;
};

export type ChallengeRef = {
    getResponse: () => ChallengeResponse;
    reset: () => void;
    fallback: () => void;
}

type ChallengeProps = {
    onSuccess?: (type: ChallengeType, token: string) => void;
    onExpire?: () => void;
    onError?: (err: string) => void;
};

const Challenge = React.forwardRef<ChallengeRef, ChallengeProps>(
    function ChallengeElement({ onSuccess, onError, onExpire }, ref) {
        const [challengeType, setChallengeType] = React.useState<ChallengeType>('turnstile');
        const turnstileRef = React.useRef<TurnstileInstance>(null);
        const hCaptchaRef = React.useRef<HCaptcha>(null);

        React.useEffect(() => {
            console.log(`Active Challenge Type: ${challengeType}`);
        }, [challengeType])

        React.useImperativeHandle(ref, () => ({
            getResponse: () => {
                let responseValue: string | null = null;

                if(challengeType === 'turnstile' && turnstileRef.current) {
                    responseValue = turnstileRef.current.getResponse() || null;
                } else if(challengeType === 'hcaptcha' && hCaptchaRef.current) {
                    responseValue = hCaptchaRef.current.getResponse() || null;
                }

                return { type: challengeType, value: responseValue };
            },
            reset: () => {
                if(challengeType === 'turnstile' && turnstileRef.current)
                    turnstileRef.current.reset();

                if(challengeType === 'hcaptcha' && hCaptchaRef.current)
                    hCaptchaRef.current.resetCaptcha();
            },
            fallback: () => {
                if(challengeType === 'turnstile')
                    setChallengeType('hcaptcha');

                throw new Error("No more fallback options available.");
            }
        }), [challengeType]);

        function onTurnstileSuccess(token: string) {
            if(onSuccess) onSuccess(challengeType, token);
        }

        function onTurnstileError(err: string) {
            console.error(`[Cloudflare Turnstile] Error occurred during challenge verification: ${err}. Switching to fallback...`);
            setChallengeType('hcaptcha');
        }

        function onTurnstileExpire() {
            if(onExpire) onExpire();
        }

        function onHCaptchaVerify(token: string) {
            if(onSuccess) onSuccess(challengeType, token);
        }

        function onHCaptchaError(err: string) {
            console.error(`[HCaptcha] Error occurred during challenge verification: ${err}.`);
            if(onError) onError(err);
        }

        function onHCaptchaExpire() {
            if(onExpire) onExpire();
        }

        if(!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
            console.error('Missing TURNSTILE_SITE_KEY / HCAPTCHA_SITE_KEY.');
            return null;
        }

        return (
            <>
                {challengeType === 'turnstile' && <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={onTurnstileSuccess}
                    onExpire={onTurnstileExpire}
                    onError={onTurnstileError}
                    onUnsupported={() => onTurnstileError('Unsupported browser')}
                    ref={turnstileRef} />}
                {challengeType === 'hcaptcha' && <HCaptcha 
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                    onVerify={onHCaptchaVerify}
                    onExpire={onHCaptchaExpire}
                    onError={onHCaptchaError}
                    reCaptchaCompat={false}
                    ref={hCaptchaRef} />}
            </>
        );
    }
);

export default Challenge;