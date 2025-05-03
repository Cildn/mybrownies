"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REQUEST_ADMIN_OTP, VERIFY_ADMIN } from "@/lib/graphql/mutations/auth";
import { useAuthStore } from "@/lib/zustand/auth";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add state for "Remember Me"

  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [requestOtp, { loading: loginLoading }] = useMutation(REQUEST_ADMIN_OTP, {
    onCompleted: (data) => {
      if (data?.requestAdminOTP?.message?.toLowerCase().includes("otp sent")) {
        alert("✅ OTP Sent! Check your email.");
        setOtpSent(true);
      } else {
        setError("Invalid credentials");
      }
    },
    onError: (err) => {
      setError(err.message || "Login failed");
    },
  });

  const [verifyOtp, { loading: otpLoading }] = useMutation(VERIFY_ADMIN, {
    onCompleted: (data) => {
      if (data?.verifyAdmin?.shortLivedToken) {
        const shortLivedToken = data.verifyAdmin.shortLivedToken;
        const longLivedToken = data.verifyAdmin.longLivedToken;

        console.log("JWT Token:", shortLivedToken); // Log the token for debugging
        localStorage.setItem("admin_token", shortLivedToken); // Save short-lived token

        // Save "Remember Me" token if enabled
        if (longLivedToken) {
          localStorage.setItem("admin_remember_me_token", longLivedToken); // Save long-lived token
        }

        setToken(shortLivedToken); // Update Zustand store with the token
        router.push("/admins/dashboard"); // Redirect to the dashboard
      } else {
        setError("Invalid OTP");
      }
    },
    onError: (err) => {
      setError(err.message || "OTP verification failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpSent) {
      await verifyOtp({ variables: { email, otp, rememberMe } }); // Include rememberMe here
    } else {
      await requestOtp({ variables: { email, password } });
    }
  };

  return (
    <div className="sign-in-container">
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <Image
            src="/images/brownies-logo.png"
            alt="Brownies"
            width={200}
            height={100}
            className="mb-9"
          />
          <div>
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {otpSent
                ? "Enter the OTP sent to your email."
                : "Enter your email and password to sign in!"}
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                />
              </div>

              {!otpSent && (
                <div>
                  <Label>Password <span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeClosedIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
              )}

              {otpSent && (
                <div>
                  <Label>OTP <span className="text-error-500">*</span></Label>
                  <Input
                    placeholder="Enter the OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              {/* Add "Remember Me" Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-black focus:ring-black"
                />
                <Label htmlFor="remember-me">Remember Me</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white font-semibold rounded-lg px-4 py-3 transition-all"
                disabled={loginLoading || otpLoading}
              >
                {loginLoading || otpLoading
                  ? "Processing..."
                  : otpSent
                  ? "Verify OTP"
                  : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}