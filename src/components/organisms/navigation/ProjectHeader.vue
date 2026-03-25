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

    <template #right>
      <VCluster gap="md" align="center">
        <VBox position="relative">
          <VButton
            variant="tertiary"
            size="sm"
            icon-name="Bell"
            icon-only
            @click="toggleNotifications"
          />
          <VBox
            position="absolute"
            top="1"
            right="1"
            width="2"
            height="2"
            background="rose-50"
            rounded="full"
            class="border-2 border-white"
          />
        </VBox>
        <VButton
          variant="tertiary"
          size="sm"
          icon-name="Cog6Tooth"
          icon-only
          @click="openSettings"
        />
        <VBox width="px" height="4" background="slate-50" />
        <VUserAvatar
          :src="user?.avatar"
          :status="'online'"
          size="sm"
        />
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
import VButton from '@/components/atoms/buttons/VButton.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';
// import VIntentTag from '@/components/molecules/indicators/VIntentTag.vue';
import VUserAvatar from '@/components/molecules/indicators/VUserAvatar.vue';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Mocking the intent from your previous session/login state
const currentIntent = ref('exploratory');

const toggleNotifications = () => console.log('Toggle Notifications');
const openSettings = () => {
  console.log('Opening Global System Settings');
};
</script>