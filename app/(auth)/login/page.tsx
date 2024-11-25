import { getUser } from "@/actions/user";
import LoginClient from "@/components/Login";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Procurement System - Login',
  description: 'Procurement System - Login',
}

async function LoginPage() {
  const user = await getUser();

  if (!!user) redirect('/');

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <LoginClient />
    </div>
  );
}

export default LoginPage;