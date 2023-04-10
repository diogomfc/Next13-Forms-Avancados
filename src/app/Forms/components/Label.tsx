type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ ...rest }: LabelProps) {
  return <label className="last:text-zinc-400" {...rest} />;
}
