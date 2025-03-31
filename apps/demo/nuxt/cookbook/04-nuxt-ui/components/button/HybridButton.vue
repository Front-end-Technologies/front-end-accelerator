<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '~/utils';
import { Primitive } from 'reka-ui';
import { type ButtonVariants, buttonVariants } from '.';

interface Props {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  as: string;
  asChild?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
