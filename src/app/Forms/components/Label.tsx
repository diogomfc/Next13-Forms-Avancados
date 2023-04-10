type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ ...rest }: LabelProps) {
  return <label className="text-slate-700" {...rest} />;
}
