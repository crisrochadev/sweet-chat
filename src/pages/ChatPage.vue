<template>
  <q-page class="q-pa-md row justify-center">
    <q-scroll-area style="width: 100%; max-width: 600px;height:calc(100svh - 170px)" ref="chatScroll">
      <template v-if="store.chat.length > 0">
        <template v-for="item in chat" :key="item.id">
          <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutBottom">
            <q-item  :style="{ backgroundColor: item.color }" class="w-11/12 h-auto p-2 my-4 rounded"
              :class="[item.user_id == store.user ? 'ml-[10%]' : 'mr-[10%]']">
              <q-item-section>
                <q-item-label>
                  <p v-if="item.user_id == store.user" class="font-bold text-grey-9">Eu</p>
                  <p v-else class="font-bold text-grey-9">@{{ item.name }}</p>
                </q-item-label>
                <q-item-label>
                  <p v-html="item.messages"></p>
                </q-item-label>
                <q-item-label caption class="text-right">
                  {{ calcDate(item) }}
                </q-item-label>
              </q-item-section>



            </q-item>
          </transition>
        </template>
      </template>
    </q-scroll-area>
    <div class="flex justify-center items-center w-full max-w-[600px]">
      <q-input type="text" filled class="w-full" v-model="message">
        <template #append>
          <q-btn icon="send" color="cyan-6" type="submit"
            @click="store.sendMessage(message, $route.params.room), message = '', setPosition()" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from 'quasar';
import { useChat } from 'src/stores/chat';
import moment from "moment"

export default {
  data() {
    const store = useChat();
    const $q = useQuasar()
    return {
      store,
      $q,
      message: null
    }
  },
  async mounted() {
    const res = await this.store.getChat(this.$route.params.room)
    console.log(res)
    if (!res.success) {
      this.$q.dialog({
        message: res.response.data.message,
        color: 'red',
        persistent: true
      }).onOK(() => {
        this.$router.push('/')
      })
    }

    console.log(this.store.user)
  },
  computed: {
    chat: {
      get() {
        return this.store.chat
      },
      set(val) {
        this.store.chat = val
      }
    }
  },

  methods: {
    setPosition() {
      const scrollArea = this.$refs.chatScroll;
      const scrollTarget = scrollArea.getScrollTarget();
      console.log("position => ", scrollTarget.scrollHeight)
      const duration = 300; // ms - use 0 to instant scroll
      scrollArea.setScrollPosition("vertical", scrollTarget.scrollHeight, duration);
    },
    calcDate(item) {
      const date = moment(item.date);

      let now = moment();
      let sec = Math.abs(now.diff(date, 'seconds'));
      if (sec <= 60) {
        return "agora";
      } else if (sec > 60 && sec <= 3600) {
        return Math.round(sec / 60) + " minutos atrás";
      } else if (sec > 3600 && sec <= 86400) {
        return Math.round(sec / 3600) + " horas atrás";
      } else if (sec > 86400 && sec <= 604800) {
        return Math.round(sec / 86400) + " dias atrás";
      } else if (sec > 604800) {
        return "Semanas atrás";
      }

    },

  }
}
</script>
<style lang="sass">
.my-emoji
  vertical-align: middle
  height: 2em
  width: 2em
</style>
