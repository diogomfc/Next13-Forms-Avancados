import { useFormContext } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input({ name, ...rest }: InputProps) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <input
        className="flex flex-col gap-1 text-sm bg-zinc-800 text-zinc-100 p-2 rounded-lg"
        id={name}
        name={name}
        {...register(name)}
        {...rest}
      />
    </div>
  );
}
