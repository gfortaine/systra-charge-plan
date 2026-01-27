<script>
import { useIndexStore } from '@src/store'
import DataTable from '@comp/newComp/DataTable.vue'
import Upload from '@comp/newComp/Upload.vue'
import RadioAlert from '@comp/newComp/RadioAlert.vue'
import CaloriesDataTable from '@comp/newComp/CaloriesDataTable.vue'

export default {
  name: 'NewComp',
  components: {
    DataTable,
    Upload,
    RadioAlert,
    CaloriesDataTable,
  },
  mounted () {
    const store = useIndexStore()
    store.changeRoute(this.$options.name)
  },
}
</script>
<template>
  <section class="view">
    <div class="column left">
      <DataTable />
      <CaloriesDataTable />
    </div>
    <div class="column right">
      <Upload />
      <RadioAlert />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.left {
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 65%;
  height: inherit;
}
.right {
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 35%;
  height: inherit;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
