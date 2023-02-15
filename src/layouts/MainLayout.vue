<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black text-white"
        style="border-bottom: 2px solid rgb(65, 65, 65)">
          <q-space />
        <q-toolbar-title>
          Movie Buff
        </q-toolbar-title>

        <div>Movie Buff v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style>
body.body--dark {
  background: #000
}
</style>
