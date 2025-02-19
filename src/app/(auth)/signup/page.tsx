import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";
import React from "react";

export default function SignupPage() {
  return (
    <main>
      <H1 className="text-center mb-5">Sign Up</H1>
      <AuthForm />
      <p className="text-sm mt-4 text-zinc-500">
        Already have an account? {""}
        <Link className="underline" href={"/login"}>
          Log in
        </Link>
      </p>
    </main>
  );
}
