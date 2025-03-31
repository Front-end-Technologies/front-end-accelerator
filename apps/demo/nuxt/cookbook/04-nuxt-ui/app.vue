<script setup lang="ts">
import { Primitive } from 'reka-ui';
import HybridButton from './components/button/HybridButton.vue';
</script>

<template>
  <ClientOnly>
    <main class="flex flex-col gap-4 p-4">
      <h1 class="text-3xl font-bold">CSS Only</h1>
      <div>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          html button with tailwindcss
        </button>

        <p>Not recommended to use this strategy, UNLESS YOU ARE A CSS WIZARD</p>
      </div>

      <hr />

      <h1 class="text-3xl font-bold">Framework only</h1>
      <div>
        <Primitive as="button" class="border rounded-md p-2"
          >Primitive Reka UI button UNSTYLED</Primitive
        >
        <p class="italic">
          use this as base component to build your own component, look into the
          compiled source code, to see the html output
        </p>
      </div>
      <hr />

      <h1 class="text-3xl font-bold">Hybrid button with multiple variants</h1>
      <p>
        this is our recommended approach, start from a base component and
        customize with variants.
        <br />
        e.g. if you are forced to use a design system and the design system is
        limiting your possibilities, you can extend the component like this with
        extra variants and sizes.
      </p>
      <div>
        <h2 class="text-2xl font-semibold">Primary Variant</h2>
        <div class="space-x-4">
          <HybridButton variant="primary" size="large"
            >Primary Large</HybridButton
          >
          <HybridButton variant="primary" size="medium"
            >Primary Medium</HybridButton
          >
          <HybridButton variant="primary" size="small"
            >Primary Small</HybridButton
          >
        </div>

        <h2 class="text-2xl font-semibold">Secondary Variant</h2>
        <div class="space-x-4">
          <HybridButton variant="secondary" size="large"
            >Secondary Large</HybridButton
          >
          <HybridButton variant="secondary" size="medium"
            >Secondary Medium</HybridButton
          >
          <HybridButton variant="secondary" size="small"
            >Secondary Small</HybridButton
          >
        </div>

        <h2 class="text-2xl font-semibold">Danger Variant</h2>
        <div class="space-x-4">
          <HybridButton variant="danger" size="large"
            >Danger Large</HybridButton
          >
          <HybridButton variant="danger" size="medium"
            >Danger Medium</HybridButton
          >
          <HybridButton variant="danger" size="small"
            >Danger Small</HybridButton
          >
        </div>
      </div>
    </main>
  </ClientOnly>
</template>
