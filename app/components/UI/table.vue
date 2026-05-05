<template>
  <div class="flex flex-col h-full w-full gap-4">
    <!-- Toolbar / Top Actions -->
    <div v-if="$slots.toolbar || showAdd" class="flex justify-between items-center">
      <slot name="toolbar">
        <Button v-if="showAdd" hierarchy="primary" @click="$emit('add')"> {{ addLabel }} </Button>
      </slot>
    </div>

    <!-- The IDDS Table with the specific styling pattern -->
    <Table
      :rowClickable="rowClickable"
      :columns="columns"
      :fetchData="fetchData"
      :initialPageSize="initialPageSize"
      :initialSortField="initialSortField"
      :initialSortOrder="initialSortOrder"
      :showSearch="showSearch"
      :rowKey="rowKey"
      class="[&_.ina-table__search-controls]:flex-row [&_.ina-table__search-controls]:flex [&_.ina-table__search-controls]:gap-2 w-full"
    >
      <!-- Passthrough all slots to the underlying IDDS Table -->
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Button, Table } from '@idds/vue';

defineProps({
  columns: { type: Array as () => any[], required: true },
  fetchData: { type: Function as unknown as () => any, required: true },
  initialPageSize: { type: Number, default: 5 },
  initialSortField: { type: String, default: null },
  initialSortOrder: { type: String as () => 'desc' | 'asc' | null, default: null },
  showSearch: { type: Boolean, default: true },
  rowKey: { type: String, default: 'id' },
  rowClickable: { type: Boolean, default: true },
  showAdd: { type: Boolean, default: false },
  addLabel: { type: String, default: 'Tambah Data +' }
});

defineEmits(['add']);
</script>
