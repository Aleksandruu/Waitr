import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard as the main entry point
  redirect('/dashboard');
}