import Image from "next/image";

// Renders the list of body blocks. Later, Sanity Portable Text is converted
// into the same blocks, so this file stays as it is.
export default function PostBody({ blocks = [] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        const key = block._key || i;
        switch (block._type) {
          case "heading":
            return (
              <h2
                key={key}
                data-anim="fade-up"
                className="mb-3 mt-10 font-display text-2xl leading-snug md:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                data-anim="fade-up"
                className="my-8 border-l-2 border-black py-1 pl-5 text-xl leading-snug md:pl-6 md:text-2xl"
              >
                {block.text}
              </blockquote>
            );
          case "image":
            return (
              <figure key={key} className="my-8">
                <div
                  data-anim="image"
                  className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={block.src}
                    alt={block.alt || ""}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-sm text-neutral-600">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return (
              <p
                key={key}
                data-anim="fade-up"
                className="my-5 text-base leading-7 text-neutral-800"
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
