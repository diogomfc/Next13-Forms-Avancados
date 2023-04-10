type FieldProps = React.HTMLAttributes<HTMLDivElement>;

export function Field({ ...rest }: FieldProps) {
  return <div className="flex flex-col gap-1" {...rest} />;
}
