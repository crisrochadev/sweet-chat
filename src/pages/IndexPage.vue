<template>
  <q-page class="flex flex-center p-4">
    <q-form class="w-full max-w-[600px] flex flex-col gap-2" @submit.prevent="login">
      <q-img src="/chat.png" width="50%" class="mx-auto" />
      <h2 class="text-center uppercase font-extrabold text-cyan-6 text-3xl mb-4">Sweet Chat</h2>
      <q-input required type="text" v-model="name" class="w-full" filled label="Nome de usuário" color="cyan-6"
        clearable />
      <q-select transition-show="flip-up" transition-hide="flip-down"  v-model="room" :options="options"
        class="w-full" filled label="Escolha uma Sala" color="cyan-6" use-input clearable @filter="filter"
        option-label="name" option-value="id" :error="roomError">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" :clickable="!scope.opt.disable">
            <q-item-section avatar>
              {{ scope.opt.qtd_use }}
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <q-item-label v-if="scope.opt.qtd_use >= scope.opt.qtd" caption>Sala cheia</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              {{ scope.opt.qtd }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-btn label="Entrar" class="w-full" color="cyan-6" type="submit" size="lg" />
    </q-form>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { useChat } from 'src/stores/chat';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  data() {
    const store = useChat()
    const $q = useQuasar()
    return {
      name: null,
      room: '',
      defaultOptions: [],
      store, $q,
      roomError:false
    }
  },
  computed: {
    options: {
      get() {
        return this.store.rooms.map(opt => {
          return {
            ...opt,
            disable: opt.qtd_use >= opt.qtd
          }
        })
      },
      set(newvalue) {
        this.store.rooms = newvalue
      }
    }
  },
  async mounted() {
    await this.store.getRooms()
    this.defaultOptions = JSON.parse(JSON.stringify(this.store.rooms))

  },
  methods: {
    filter(val, update) {
      if (val === '') {
        update(() => {
          this.options = this.defaultOptions;
        });
        return;
      }

      const needle = val
        .toString()
        .toLowerCase();
      // Filter out values that do not contain the search query.
      const filtered = this.defaultOptions.filter((opt) => opt.name.toLowerCase().includes(needle));
      update(() => {
        this.options = filtered;
      });
    },
    async login() {
      if(!this.room) {
        this.roomError = true;
        return
      }
      console.log({
        name: this.name,
        room: this.room.id
      })
      this.$q.loading.show()
      const res = await this.store.login({
        name: this.name,
        room: this.room.id
      });

      if (res.success) {
        this.$q.loading.hide()
        this.$router.push('/chat/'+this.room.id);
      } else {
        this.$q.loading.hide()
        console.log(res)
        this.$q.dialog({
          message: res.response.data.message,
          color: 'red',

        })
      }
    }
  }
});
</script>
