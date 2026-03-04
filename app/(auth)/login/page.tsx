import { getCompany } from '@/actions/company';
import { getUser } from '@/actions/user';
import LoginClient from '@/components/Login';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Procurement and Inventory Management System',
  description: 'Procurement and Inventory Management System',
};

async function LoginPage() {
  const company: CompanyType = await getCompany();
  const user: UserType = await getUser();

  if (user) redirect('/');

  return <LoginClient company={company} />;
}

export default LoginPage;
