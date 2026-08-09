<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <VStack gap="lg">
        <PropositionInitializerCard />
      </VStack>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import PropositionInitializerCard from '@/components/organisms/proposition/PropositionInitializerCard.vue';

</script>