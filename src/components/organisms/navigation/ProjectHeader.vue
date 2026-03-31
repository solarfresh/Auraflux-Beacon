<template>
  <VBaseHeader
    variant="solid"
    :has-border="true"
    :has-shadow="false"
    class="bg-slate-50/50"
  >
    <template #left>
      <VCluster gap="md" align="center">
        <!-- <VLogo size="sm" color="indigo-600" /> -->
        <VBox width="px" height="4" background="slate-50" class="self-center"/>
        <VStack gap="none">
          <VTypography tag="span" size="xs" weight="bold" color="indigo-600" class="tracking-tighter uppercase">
            Auraflux
          </VTypography>
          <VTypography tag="h1" size="sm" weight="semibold" color="slate-900" class="whitespace-nowrap">
            MISSION CONTROL
          </VTypography>
        </VStack>
      </VCluster>
    </template>

    <template #center>
      <VCluster gap="lg" align="center" class="w-full max-w-xl">
        <VGlobalSearch
          placeholder="Search nodes, projects, or agents... (Ctrl+K)"
          class="flex-1"
        />
        <!-- <VIntentTag :intent="currentIntent" size="sm" /> -->
      </VCluster>
    </template>
  </VBaseHeader>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VBaseHeader from '@/components/organisms/navigation/VBaseHeader.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';
</script>