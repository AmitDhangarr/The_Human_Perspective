import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import ResetPasswordForm from "@/components/ResetPasswordForm.jsx";

export const metadata = { title: "Reset password - The Human Perspective" };

export default function ResetPasswordPage() {
  return (
    <div>
      <Header />
      <main>
        <ResetPasswordForm />
      </main>
      <Footer />
    </div>
  );
}
