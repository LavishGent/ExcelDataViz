<template>
  <div>
    <h1>Data: {{ data.myKey }}</h1>
    <button @click="updateData">Update Data</button>

    <ul v-if="data.items && data.items.length > 0">
      <li v-for="(item, index) in data.items" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import GlobalStore from "../../../shared/globalStore";
import EventBus from "../../../shared/eventBus";

export default {
  name: "SampleComponent",
  setup() {
    const data = ref(GlobalStore.getInstance().getState());

    // Function to update data on the server
    const updateData = () => {
      fetch("http://localhost:3000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "myKey", value: "New Value" }),
      });
    };

    // WebSocket connection and state subscription
    onMounted(() => {
      // WebSocket connection
      const ws = new WebSocket("ws://localhost:3000");

      ws.onmessage = (event) => {
        const newState = JSON.parse(event.data);
        console.log("WebSocket data received:", newState);
        data.value = newState;
      };

      // Listen for updates from GlobalStore and EventBus
      const globalStoreListener = (newState: any) => {
        console.log("Global store updated:", newState);
        data.value = newState;
      };

      GlobalStore.getInstance().subscribe(globalStoreListener);
      EventBus.getInstance().on("dataUpdated", globalStoreListener);

      // Cleanup on unmount
      onUnmounted(() => {
        ws.close();
        GlobalStore.getInstance().unsubscribe(globalStoreListener);
        EventBus.getInstance().off("dataUpdated", globalStoreListener);
      });
    });

    return { data, updateData };
  },
};
</script>

<style scoped>
/* Add styles later  */
</style>
