export default function Headline({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div>
      <h1 className={className}>{text}</h1>
    </div>
  );
}
