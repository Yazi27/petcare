import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <H1 className="text-center mb-5">Log In</H1>
      <AuthForm />
      <p className="text-sm mt-6 text-zinc-500">
        No account yet? {""}
        <Link className="underline" href={"/signup"}>
          Sign up
        </Link>
      </p>
    </main>
  );
}
