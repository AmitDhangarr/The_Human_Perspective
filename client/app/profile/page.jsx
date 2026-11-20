import Footer from "@/components/footer.jsx";
import Header from "@/components/header.jsx";
import ProfileClient from "@/components/ProfileClient.jsx";
import { getPosts } from "@/lib/content";

export const metadata = { title: "My Profile - The Human Perspective" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const posts = await getPosts();
  // only plain, serialisable fields go to the client component
  const slim = posts.map((p) => ({
    _id: p._id,
    slug: p.slug,
    title: p.title,
    image: p.image,
    publishedAt: p.publishedAt,
  }));
  return (
    <div>
      <Header />
      <main>
        <ProfileClient posts={slim} />
      </main>
      <Footer />
    </div>
  );
}
