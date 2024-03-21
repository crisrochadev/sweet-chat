import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { emit, listenForMessages } from 'src/boot/socket';
import { colors } from "quasar"

export const useChat = defineStore('chat', {
  state: () => ({
    rooms: [],
    chat: useStorage("chat", []),
    user: useStorage("user", null),
    color: useStorage("color", null)
  }),

  actions: {
    async getRooms() {
      const res = await api.get('/rooms').then(res => res.data).catch(err => err);

      
      if (res.success) {
        this.rooms = res.rooms
      }
    },
    async login(data) {
      const res = await api.post('/chat', data).then(res => res.data).catch(err => err);

      console.log(res)
      if (res.success) {
        this.user = res.user
        this.color = res.color
      }
      return res;
    },

    async getChat(id) {
      console.log(colors)
      const res = await api.get('/chat/' + id).then(res => res.data).catch(err => err);
      if (res.success) {
        this.chat = res.chat
        this.listen()
      }
      return res
    },
    sendMessage(message, room) {
      emit({
        user: this.user,
        color:this.color,
        room,
        message
      }, (res) => {
        console.log(res)
      })
    },
    listen() {
      listenForMessages((message) => {
        console.log('Received message:', message);
        // Atualizar this.chat com a nova mensagem recebida
        // Por exemplo:
        console.log(message)
        this.chat.push(message);
      })
    }
  },
});
