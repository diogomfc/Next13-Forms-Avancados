'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import '../../styles/global.css';

// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

/**
 * TO-DO
 * [] Validação / transformação
 * [] Field Arrays
 * [] Upload de arquivos
 * [] Composition pattern
 */

// type FormValues = {
//   email: string;
//   password: string;
// };

const createUserSchema = z.object({
  name: z
    .string()
    .nonempty('Nome obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }),
  email: z.string().email('Email inválido').nonempty('Email obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('title é obrigatório'),
        level: z.coerce
          .number()
          .int()
          .min(1, 'maior que 0')
          .max(10, 'menor que 10'),
      })
    )
    .min(1, 'Deve ter no mínimo 1 tech'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function Forms() {
  const [output, setOutput] = useState<CreateUserFormData>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  function createUserForm(data: CreateUserFormData) {
    setOutput(data as CreateUserFormData);
    console.log(output);
  }

  function addNewTech() {
    append({ title: '', level: 0 });
  }

  return (
    <main className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <form
        onSubmit={handleSubmit(createUserForm)}
        className="w-full max-w-xs bg-white rounded-md shadow-md overflow-hidden gap-4"
      >
        <div className="px-5 py-7">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="
            Enter com seu nome"
              className="border border-zinc-200 shadow-sm rounded h-10 px-3  bg-zinc-50 text-slate-700"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="
            Enter your email"
              autoComplete="email"
              className="border border-zinc-200 shadow-sm rounded h-10 px-3  bg-zinc-50 text-slate-700"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="border border-zinc-200 shadow-sm rounded h-10 px-3  bg-zinc-50 text-slate-700"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 py-5 ">
            <label
              htmlFor="techs"
              className="text-sm font-medium text-gray-700 flex items-center gap-2 justify-between"
            >
              Tecnologias
              <button
                type="button"
                onClick={() => addNewTech()}
                className="text-sm font-medium text-zinc-500"
              >
                Add
              </button>
            </label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div>
                  {/* <label
                  htmlFor={`techs[${index}].title`}
                  className="text-sm font-medium text-gray-700"
                >
                  Tech
                </label> */}
                  <input
                    id={`techs[${index}].title`}
                    type="text"
                    name={`techs[${index}].title`}
                    placeholder="Enter your tech"
                    className="border border-zinc-200 shadow-sm rounded h-10 px-3  bg-zinc-50 text-slate-700"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-xs">
                      {errors.techs?.[index]?.title.message}
                    </span>
                  )}
                </div>
                <div>
                  {/* <label
                  htmlFor={`techs[${index}].level`}
                  className="text-sm font-medium text-gray-700"
                >
                  Level
                </label> */}
                  <input
                    id={`techs[${index}].level`}
                    type="number"
                    name={`techs[${index}].level`}
                    placeholder="Enter your level"
                    className="border border-zinc-200 shadow-sm rounded h-10 w-16 px-3 bg-zinc-50 text-slate-700"
                    {...register(`techs.${index}.level`)}
                  />
                  {errors.techs?.[index]?.level && (
                    <span className="text-red-500 text-xs">
                      {errors.techs?.[index]?.level.message}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {errors.techs && (
              <span className="text-red-500 text-xs">
                {errors.techs.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Salvar
          </button>
        </div>
      </form>
      <pre>
        <code>{JSON.stringify(output, null, 2)}</code>
      </pre>
    </main>
  );
}
