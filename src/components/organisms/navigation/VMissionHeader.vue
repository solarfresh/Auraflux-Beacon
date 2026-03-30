<template>
  <VBaseHeader
    variant="glass"
    :has-border="true"
    class="bg-white/90"
  >
    <template #left>
      <VCluster gap="sm" align="center">
        <VButton
          variant="tertiary"
          size="sm"
          icon-name="ArrowLeft"
          icon-only
          @click="handleBack"
        />
        <VBox width="px" height="4" background="slate-50" />
        <VStack gap="none">
          <VTypography size="xs" weight="bold" color="indigo-600" class="uppercase">
            Mission
          </VTypography>
          <VTypography size="sm" weight="semibold" color="slate-900">
            {{ title }}
          </VTypography>
        </VStack>
      </VCluster>
    </template>

    <template #center>
      <VBox
        background="slate-50"
        padding="xs"
        rounded="lg"
        class="border border-slate-200/60 inline-flex items-center"
      >
        <VCluster gap="xs">
          <VButton
            v-for="label in stageLabels"
            :variant="currentStage === label.toUpperCase() ? 'primary' : 'tertiary'"
            size="xs"
            class="px-4 py-1.5"
            @click="changeStage(label.toUpperCase() as ISPStage)"
          >
            {{ label }}
          </VButton>
        </VCluster>
      </VBox>
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
/**
 * VMissionHeader (Stage-Switching Edition)
 * Replaces search with a segmented control to navigate through ISP-inspired phases.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';
import VBaseHeader from '@/components/organisms/navigation/VBaseHeader.vue';
import type { ISPStage } from '@/interfaces/project';
import { useAuthStore } from '@/stores/auth';
import { useProjectStore } from '@/stores/project';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const stageLabels = ref<string[]>(['Initiation', 'Exploration', 'Synthesis']);

const currentProjectId = computed(() => projectStore.currentProjectId);
const currentStage = computed(() => projectStore.currentStage);
const title = computed(() => projectStore.projectName);
const user = computed(() => authStore.user);

const changeStage = (stage: ISPStage) => {
  if (stage === 'SYNTHESIS') return;
  router.push(`/isearch/${currentProjectId.value}/${stage.toLowerCase()}/`);
};

const handleBack = () => {
  // Navigate back to the project list or previous context
  router.push({ name: 'ProjectPage' });
};
const toggleNotifications = () => console.log('Toggle Notifications');
const openSettings = () => {
  console.log('Opening Global System Settings');
};
</script>