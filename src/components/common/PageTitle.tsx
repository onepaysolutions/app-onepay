interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </div>
  );
} 