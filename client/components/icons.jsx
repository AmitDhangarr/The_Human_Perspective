// Small inline icons (no extra dependency). Colour follows the text colour.
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const FacebookIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M14 8.5h2V5h-2.6C10.9 5 10 6.6 10 8.6V10.5H8V14h2v6h3.5v-6h2.3l.4-3.5h-2.7V9c0-.3.2-.5.5-.5z" />
  </svg>
);

export const XIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4.5l14 15M19 4.5l-14 15" />
  </svg>
);

export const LinkedInIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6.5 10v8M6.5 6.5v.01M10.5 18v-8M10.5 13.2c0-2 1.4-3.2 3-3.2 1.8 0 3 1.2 3 3.4V18" />
  </svg>
);

export const LinkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-.9.9M14 10a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l.9-.9" />
  </svg>
);

export const EyeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CommentIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const BookmarkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
  </svg>
);

export const ChevronIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const PencilIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
  </svg>
);
