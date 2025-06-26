import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: "r5jmut",
  viewportWidth:1080,
  viewportHeight:1920,
  e2e: {
    supportFile: false,
  },
})
