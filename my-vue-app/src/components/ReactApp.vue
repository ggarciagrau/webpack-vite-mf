<template>
  <div class="react-wrapper">
    <h2>React App Configured via Module Federation</h2>
    <div ref="root">Loading React App...</div>
  </div>
</template>

<script>
export default {
  name: 'ReactApp',
  data() {
    return {
      unmount: null
    };
  },
  async mounted() {
    try {
      // Import the mount function from the remote
      const { mount } = await import('my-react-app/App');
      // Mount the React app into the ref element
      this.unmount = mount(this.$refs.root);
    } catch (error) {
      console.error('Failed to mount React app:', error);
      this.$refs.root.textContent = 'Error loading React App. Check console.';
    }
  },
  beforeDestroy() {
    if (this.unmount) {
      this.unmount();
    }
  }
}
</script>

<style scoped>
.react-wrapper {
  border: 2px dashed #61dafb;
  padding: 20px;
  margin: 20px;
}
</style>
