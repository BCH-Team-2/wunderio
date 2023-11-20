import { Breadcrumbs, BreadcrumbsProps } from "components/breadcrumbs";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  breadcrumbs?: BreadcrumbsProps["items"];
}

export function PageHeader({
  breadcrumbs,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div className="container">
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex items-center py-10 text-text">{children}</div>
    </div>
  );
}
