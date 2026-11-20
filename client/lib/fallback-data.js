// ---------------------------------------------------------------------------
// Placeholder content used until Sanity is connected.
// Every object here has the same shape the CMS will return later, so pages
// never need to change when we switch the data source (see lib/content.js).
//
// image.src can be a local import (now) or a URL string (Sanity, later).
// ---------------------------------------------------------------------------
import Fields from "@/app/assests/blog/desktop-blog-img-1.avif";
import oldLady from "@/app/assests/blog/desktop-blog-img-2.avif";
import Ocean from "@/app/assests/blog/desktop-blog-img-3.avif";
import womenatHills from "@/app/assests/home/desktop-home-img-3.avif";
import Landscape from "@/app/assests/home/desktop-home-img-4.avif";
import menlookingatMountain from "@/app/assests/home/desktop-home-img-5.avif";

export const categories = [
  { title: "Content Creation", slug: "content-creation" },
  { title: "Marketing", slug: "marketing" },
];

// Post body = list of blocks. Sanity's Portable Text will be mapped to this
// same list (paragraph / heading / quote / image).
const sampleBody = [
  {
    _type: "paragraph",
    text: "Welcome to your blog post. Use this space to connect with your readers and potential customers in a way that’s current and interesting. Think of it as an ongoing conversation where you can share updates about business, trends, news, and more.",
  },
  {
    _type: "quote",
    text: "Do you have a design in mind for your blog? Whether you prefer a trendy postcard look or you’re going for a more editorial style blog - there’s a stunning layout for everyone.",
  },
  {
    _type: "paragraph",
    text: "You’ll be posting loads of engaging content, so be sure to keep your blog organized with Categories that also allow visitors to explore more of what interests them.",
  },
  { _type: "heading", text: "Create Relevant Content" },
  {
    _type: "paragraph",
    text: "Writing a blog is a great way to position yourself as an authority in your field and captivate your readers’ attention. Do you want to improve your site’s SEO ranking? Consider topics that focus on relevant keywords and relate back to your website or business. You can also add hashtags (#vacation #dream #summer) throughout your posts to reach more people, and help visitors search for relevant content.",
  },
  {
    _type: "paragraph",
    text: "Blogging gives your site a voice, so let your business’ personality shine through. Choose a great image to feature in your post or add a video for extra engagement. Are you ready to get started? Simply create a new post now.",
  },
];

const subtitle =
  "Create a blog post subtitle that summarizes your post in a few short, punchy sentences and entices your audience to continue reading.";

const admin = { name: "Admin", image: null };

export const posts = [
  {
    _id: "post-1",
    title: "A path to Deeper Connection",
    slug: "a-path-to-deeper-connection",
    subtitle,
    image: { src: Fields, alt: "laying_hand_on_crop_in_the_morning" },
    author: admin,
    category: categories[0],
    publishedAt: "2026-05-23",
    updatedAt: "2026-06-14",
    readTime: 1,
    views: 0,
    comments: 0,
    body: sampleBody,
  },
  {
    _id: "post-2",
    title: "The Beauty of an Unfinished Faith",
    slug: "the-beauty-of-an-unfinished-faith",
    subtitle,
    image: { src: oldLady, alt: "an_old_south_asian_lady" },
    author: admin,
    category: categories[1],
    publishedAt: "2026-05-21",
    updatedAt: "2026-06-14",
    readTime: 1,
    views: 0,
    comments: 0,
    body: sampleBody,
  },
  {
    _id: "post-3",
    title: "The Art of Listening",
    slug: "the-art-of-listening",
    subtitle,
    image: { src: Ocean, alt: "wave_in_ocean" },
    author: admin,
    category: categories[0],
    publishedAt: "2026-05-19",
    updatedAt: "2026-06-14",
    readTime: 1,
    views: 0,
    comments: 0,
    body: sampleBody,
  },
];

// Where "Watch on YouTube" goes. Replace with your own channel / playlist and
// per-episode video links (listenUrl below) when you publish your podcast.
export const podcast = {
  youtubeUrl:
    "https://www.youtube.com/playlist?list=PL6xBLYUXbFiCNOSUDdWTWtfPtc2VQR_pI",
};

export const episodes = [
  {
    _id: "ep-1",
    number: 1,
    duration: 28,
    title: "The Pilgrim's Path",
    summary:
      "A conversation on finding meaning in the journey, not just the destination",
    description:
      "What does it mean to be a pilgrim in the 21st century? This episode considers the spiritual significance of journeying, both inward and outward",
    image: { src: womenatHills, alt: "a_young_lady_roaming_in_grassland" },
    listenUrl: podcast.youtubeUrl,
  },
  {
    _id: "ep-2",
    number: 2,
    duration: 32,
    title: "The Fabric of Faith",
    summary:
      "Weaving together stories of doubt and devotion with guest author Léonie Dubois",
    description:
      "Guest author Léonie Dubois joins us to discuss how moments of doubt can unexpectedly strengthen the foundations of our belief. A deep dive into the tapestry of a modern spiritual life",
    image: { src: Landscape, alt: "a_mountains_landscape" },
    listenUrl: podcast.youtubeUrl,
  },
  {
    _id: "ep-3",
    number: 3,
    duration: 45,
    title: "Echoes of Silence",
    summary:
      "Exploring the profound wisdom found in quiet moments and sacred spaces",
    description:
      "In this guided reflection, we explore the power of silence as a tool for spiritual discovery. Learn simple practices to carve out sacred quiet in your daily routine.",
    image: {
      src: menlookingatMountain,
      alt: "a_man_sitting_facing_mountains_on_the_edge_of_motel",
    },
    listenUrl: podcast.youtubeUrl,
  },
];
