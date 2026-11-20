// One labelled form field with an accessible inline error message.
export default function Field({ id, label, error, hint, as: Tag = "input", className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full border bg-white p-3 font-label text-black transition-colors duration-300 ${
          error ? "border-red-700" : "border-black"
        } ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-neutral-500">
          {hint}
        </p>
      )}
      <p id={`${id}-error`} role="alert" className={`text-sm text-red-700 ${error ? "" : "hidden"}`}>
        {error}
      </p>
    </div>
  );
}
