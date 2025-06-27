import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: "r5jmut",
  viewportWidth:1920,
  viewportHeight:1080,
  e2e: {
    supportFile: false,
  },
})
