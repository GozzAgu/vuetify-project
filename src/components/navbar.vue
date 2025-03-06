<template>
  <v-app-bar app color="primary" density="compact">
    <v-container class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-white">Vuetify Blog</v-app-bar-title>
      </div>

      <v-menu v-if="$vuetify.display.smAndDown" transition="slide-x-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-menu" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item to="/">Home</v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>