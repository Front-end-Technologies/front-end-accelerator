/**
 * @fileoverview This file contains a React component that demonstrates the use of react-hook-form
 * with zod for form validation and type inference.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

/**
 * Schema definition using zod for form validation.
 */
const schema = z.object({
  age: z
    .number()
    .positive()
    .min(1, { message: 'Age must be a positive number and greater than 0' }),
  name: z
    .string()
    .min(3, { message: 'Name should be at least 3 characters long' }),
});

/**
 * Type inference for the schema using zod.
 */
type Schema = z.infer<typeof schema>;

/**
 * App component that renders a form using react-hook-form and zod for validation.
 * - Uses `useForm` hook from react-hook-form with zodResolver for schema validation.
 * - Handles form submission and reset.
 * - Displays form fields, validation errors, dirty fields, and submission status.
 */
export const App = () => {
  const {
    formState: { dirtyFields, errors, isSubmitSuccessful },
    handleSubmit,
    register,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  /**
   * Handles form submission.
   * @param data - The form data that conforms to the Schema type.
   */
  const onSubmit = (data: Schema) => {
    // submit date to the server
    console.log(data);
    // onSucces
    reset();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <label>
          Name:
          <input {...register('name')} />
          {errors.name && <span>{errors.name.message}</span>}
        </label>
        <label>
          Age:
          <input {...register('age', { valueAsNumber: true })} type="number" />
          {errors.age && <span>{errors.age.message}</span>}
        </label>
        <button type="submit">Submit</button>
        <button onClick={() => reset()} type="button">
          Reset
        </button>

        <strong>Dirty Fields</strong>
        <pre>{JSON.stringify(dirtyFields, null, 2)}</pre>
        <strong>isSubmitSuccessful</strong>
        {isSubmitSuccessful ? 'true' : 'false'}
      </form>
    </div>
  );
};
