<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent">
      <q-toolbar>
        <q-toolbar-title class="text-cyan-6 uppercase font-bold text-center" v-if="$route.path !== '/'">
          Sweet Chat
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'


export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
     
    }
  },

  methods: {
    
  }
})
</script>
