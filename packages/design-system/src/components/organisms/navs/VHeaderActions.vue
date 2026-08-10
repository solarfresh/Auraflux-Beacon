<template>
  <VCluster gap="md" align="center" justify="end" class="flex-none min-w-40">
    <VBox class="relative group">
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="Bell"
        icon-only
        @click="emit('toggle-notifications')"
      />
    </VBox>

    <VBox
      class="relative group"
    >
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="Cog6Tooth"
        icon-only
      />
      <VDropdownMenu
        attention="primary"
        class="hidden group-hover:block absolute top-full right-0"
      >
        <VDropdownItem
          attention="primary"
          v-for="item in settingItems"
          :key="item.label"
          :icon-name="item.iconName"
          @click="emit('click-setting', item)"
        >
          {{ item.label }}
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>

    <VBox
      class="relative group"
    >
<!--
      <VUserAvatar
        :src="user?.avatar"
        :status="'online'"
        attention="primary"
        size="sm"
        class="cursor-pointer"
      />
 -->
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="User"
        icon-only
      />
      <VDropdownMenu
        class="hidden group-hover:block absolute top-full right-0"
        attention="primary"
      >
        <VDropdownItem attention="primary" icon-name="UserCircle" @click="emit('open-profile')">
          Account Profile
        </VDropdownItem>
        <VBox width="full" height="px" intent="brand" surface="solid" class="my-1" />
        <VDropdownItem attention="primary" icon-name="ArrowRightOnRectangle" @click="emit('logout')">
          Sign Out
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>
  </VCluster>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
// import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';

import type { LinkItem } from '@auraflux/design-system/interfaces/navs';

defineProps<{
  settingItems?: LinkItem[];
}>();

const emit = defineEmits<{
  (e: 'toggle-notifications'): void;
  (e: 'click-setting', item: LinkItem): void;
  (e: 'open-profile'): void;
  (e: 'logout'): void;
}>();
</script>