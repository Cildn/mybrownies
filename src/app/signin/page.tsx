import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "Les Brownies | Signin",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
  <SignInForm />
  </GoogleOAuthProvider>);
}
