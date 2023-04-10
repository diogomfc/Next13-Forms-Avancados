'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, XCircle } from 'lucide-react';
import { z } from 'zod';

import { supabase } from '../../lib/supabase';
import { Forms } from './components';

import '../../styles/global.css';

// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

/**
 * TO-DO
 * [x] Validação / transformação
 * [x] Field Arrays
 * [x] Upload de arquivos
 * [] Composition pattern
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const createUserSchema = z.object({
  name: z
    .string()
    .nonempty({
      message: 'O nome é obrigatório',
    })
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(' ');
    }),
  email: z
    .string()
    .nonempty({
      message: 'O e-mail é obrigatório',
    })
    .email({
      message: 'Formato de e-mail inválido',
    })
    .toLowerCase(),
  password: z
    .string()
    .nonempty({
      message: 'A senha é obrigatória',
    })
    .min(6, {
      message: 'A senha precisa ter no mínimo 6 caracteres',
    }),
  techs: z
    .array(
      z.object({
        title: z
          .string()
          .nonempty({ message: 'O nome da tecnologia é obrigatório' }),
      })
    )
    .min(3, {
      message: 'Pelo menos 3 tecnologias devem ser informadas.',
    }),
  avatar: z
    .instanceof(FileList)
    .refine((files) => !!files.item(0), 'A imagem de perfil é obrigatória')
    .refine(
      (files) => files.item(0)?.size <= MAX_FILE_SIZE,
      `Tamanho máximo de 5MB`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files.item(0)?.type),
      'Formato de imagem inválido'
    )
    .transform((files) => {
      return files.item(0);
    }),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function App() {
  const [output, setOutput] = useState<CreateUserFormData>();

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  async function createUser(data: CreateUserFormData) {
    const { data: uploadData, error } = await supabase.storage
      .from('forms-react')
      .upload(`avatars/${data.avatar?.name}`, data.avatar, {
        cacheControl: '3600',
        upsert: false,
      });

    console.log(uploadData);

    setOutput(
      data as CreateUserFormData & {
        avatar: {
          name: string;
          size: number;
          type: string;
          url: string;
        };
      }
    );
  }

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    control,
  } = createUserForm;

  const userPassword = watch('password');
  const isPasswordStrong = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'
  ).test(userPassword);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  function addNewTech() {
    append({ title: '' });
  }

  return (
    <main className="h-screen flex flex-row gap-6 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="
            w-full
            max-w-md
            bg-white
            rounded-lg
            shadow-lg

            px-8
            pt-6
            pb-8
            mb-4
            flex
            flex-col
            gap-4

            dark:bg-gray-950
            dark:text-gray-100

            sm:max-w-xl
            sm:shadow-lg
            sm:px-10
            sm:py-8

            md:max-w-2xl
            md:px-12
            md:py-10

            lg:max-w-4xl
            lg:px-16
            lg:py-12

            xl:max-w-5xl
            xl:px-20
            xl:py-14

            2xl:max-w-6xl
            2xl:px-24
            2xl:py-16


          "
        >
          <Forms.Field>
            <Forms.Label htmlFor="avatar">Avatar</Forms.Label>
            <Forms.Input type="file" name="avatar" />
            <Forms.ErrorMessage field="avatar" />
          </Forms.Field>

          <Forms.Field>
            <Forms.Label htmlFor="name">Nome</Forms.Label>
            <Forms.Input type="name" name="name" />
            <Forms.ErrorMessage field="name" />
          </Forms.Field>

          <Forms.Field>
            <Forms.Label htmlFor="email">E-mail</Forms.Label>
            <Forms.Input type="email" name="email" />
            <Forms.ErrorMessage field="email" />
          </Forms.Field>

          <Forms.Field>
            <Forms.Label htmlFor="password">
              Senha
              {isPasswordStrong ? (
                <span className="text-xs text-emerald-600">Senha forte</span>
              ) : (
                <span className="text-xs text-red-500">Senha fraca</span>
              )}
            </Forms.Label>
            <Forms.Input type="password" name="password" />
            <Forms.ErrorMessage field="password" />
          </Forms.Field>

          <Forms.Field>
            <Forms.Label>
              Tecnologias
              <button
                type="button"
                onClick={addNewTech}
                className="text-emerald-500 font-semibold text-xs flex items-center gap-1"
              >
                Adicionar nova
                <PlusCircle size={14} />
              </button>
            </Forms.Label>
            <Forms.ErrorMessage field="techs" />

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`;

              return (
                <Forms.Field key={field.id}>
                  <div className="flex gap-2 items-center">
                    <Forms.Input type={fieldName} name={fieldName} />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                  <Forms.ErrorMessage field={fieldName} />
                </Forms.Field>
              );
            })}
          </Forms.Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
          >
            Salvar
          </button>
        </form>
      </FormProvider>

      {output && (
        <pre className="text-sm bg-zinc-800 text-zinc-100 p-6 rounded-lg">
          {output && JSON.stringify(output, null, 2)}
        </pre>
      )}
    </main>
  );
}
