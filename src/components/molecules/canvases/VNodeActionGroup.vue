<template>
  <VBox
    class="v-node-action-group absolute -top-12 left-1/2 -translate-x-1/2 shadow-xl"
    background="white"
    padding="xs"
    rounded="lg"
    border="all"
    @click.stop
  >
    <VCluster gap="xs" align="center">
      <template v-if="props.status === 'AI_EXTRACTED'">
        <VButton
          variant="primary"
          size="xs"
          class="bg-emerald-600! hover:bg-emerald-700!"
          @click="emit('accept')"
        >
          ACCEPT
        </VButton>

        <VButton
          variant="ghost"
          size="xs"
          class="hover:bg-rose-50! hover:text-rose-600!"
          @click="emit('reject')"
        >
          REJECT
        </VButton>
      </template>

      <template v-else-if="props.status === 'USER_DRAFT'">
        <VButton
          variant="primary"
          size="xs"
          class="bg-indigo-600! hover:bg-indigo-700!"
          @click="emit('accept')"
        >
          CONFIRM
        </VButton>

        <VButton
          variant="ghost"
          size="xs"
          class="hover:bg-red-50! hover:text-red-600!"
          @click="emit('delete')"
        >
          DELETE
        </VButton>
      </template>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'
import VButton from '@/components/atoms/buttons/VButton.vue'

const props = defineProps<{
  status: string
}>()

const emit = defineEmits<{
  (e: 'accept'): void
  (e: 'reject'): void
  (e: 'delete'): void
}>()
</script>

<style scoped>
.v-node-action-group {
  z-index: 50;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.9);
}
</style>