import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const { resetPassword, message, error } = useAuthStore();

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(error.message || "Invalid or expired token. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message && <p className="text-sm text-green-500">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Reset Password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="px-0">
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
