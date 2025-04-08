<script setup>
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: 'This is required' })
      .email({ message: 'Must be a valid email' }),
    password: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Too short' }),
  })
);
const { values, handleSubmit, errors, isSubmitting, meta } = useForm({
  validationSchema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <div>
    <h1>Vee validate: Composition API with Zod</h1>
    <p>
      use this when making custom/advanced forms, this is the preferred way of
      writing forms, use zod for type safety and validation. Writing forms this
      ways gives you full control over the form state and validation.
    </p>

    <form @submit="onSubmit">
      <input v-model="email" name="email" type="email" >

      <span v-if="errors.email && meta.touched">
        {{ errors.email }}
      </span>

      <input v-model="password" name="password" type="password" >
      <span v-if="errors.password && meta.touched">
        {{ errors.password }}
      </span>
      <button>Submit</button>
    </form>

    <h2>values</h2>
    <pre>{{ values }}</pre>

    <h2>errors</h2>
    <pre>{{ errors }}</pre>

    <h2>isDirty</h2>
    <pre>{{ meta.dirty }}</pre>

    <h2>isSubmitting</h2>
    <pre>{{ isSubmitting }}</pre>
  </div>
</template>
