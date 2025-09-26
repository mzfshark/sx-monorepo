<template>
    <div class="notify-corner">
      <el-alert
        :title="title"
        :type="type"
        :closable="false"
        :description="description"
        show-icon
      />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title?: string
    description?: string
    type?: "success" | "info" | "warning" | "error"
  }>()
  </script>
  
  <style scoped>
  .notify-corner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 280px;
    z-index: 3000;
  }
  
  .el-alert__description {
    font-size: 20px !important;
  }

  .el-alert__title {
    font-size: 40px !important;
  }
  </style>
  