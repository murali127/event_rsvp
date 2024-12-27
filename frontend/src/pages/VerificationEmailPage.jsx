import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { verifyEmail, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Check if the OTP is valid (non-empty and of correct length)
    if (value.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit verification code.");
      return;
    }

    setErrorMessage(""); // Clear any previous error messages
    await verifyEmail(value);

    if (!error && !isLoading) {
      toast({
        title: "Email Verified",
        description: "You have successfully verified your email",
        status: "success",
      });
    } else {
      setErrorMessage("Failed to verify email. Please try again.");
    }
  };

  return (
    <div className="space-y-2 flex flex-col w-full mx-auto justify-center">
      <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
        <InputOTPGroup className="mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your verification code.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
      {errorMessage && (
        <div className="text-center text-sm text-red-500">{errorMessage}</div>
      )}
      <Button 
        onClick={handleSubmit} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Verifying..." : "Verify Email Now"}
      </Button>
    </div>
  );
}
