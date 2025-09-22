<template>
  <form @submit.prevent="handleSearch" class="flex w-full items-center justify-center space-x-4">
    <div class="relative w-full">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon name="magnifying-glass" type="solid" size="md" color="gray-400" />
      </div>
      <Input
        v-model="searchQuery"
        placeholder="Search for knowledge..."
        variant="search"
        class="pl-10"
      />
    </div>
    <SearchButton type="submit">
      <span class="hidden sm:inline">Search</span>
    </SearchButton>
  </form>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import SearchButton from '@/components/molecules/SearchButton.vue';
import { ref } from 'vue';

const searchQuery = ref<string>('');
const emit = defineEmits(['search']);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};
</script>