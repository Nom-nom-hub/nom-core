<script setup>
import { ref, computed } from 'vue'
import nomLogo from './assets/nom-logo.svg'
import githubIcon from './assets/github.svg'
import discordIcon from './assets/discord.svg'

const email = ref('')
const isEmailValid = ref(false)
const activeTab = ref('npm')
const logs = ref([])

</script>

<template>
  <div class="app">
    <header class="hero">
      <nav class="nav">
        <div class="logo">
          <img :src="nomLogo" alt="Nom Core" />
          <span>Nom Core</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#plugins">Plugins</a>
          <a href="#docs">Docs</a>
          <a href="https://github.com/Nom-nom-hub/nom-core" class="github-link">
            <img :src="githubIcon" alt="GitHub" />
          </a>
        </div>
      </nav>
      
      <div class="hero-content">
        <h1>Plugin Manager for WebAssembly</h1>
        <p>Build extensible applications with secure, high-performance plugins</p>
        <div class="cta-buttons">
          <a href="#get-started" class="primary-btn">Get Started</a>
          <a href="#docs" class="secondary-btn">Documentation</a>
        </div>
      </div>
    </header>
  </div>
</template>

<style>
.app {
  font-family: 'Inter', sans-serif;
  color: #2c3e50;
}

.hero {
  background: linear-gradient(135deg, #00C6FF 0%, #0072FF 100%);
  min-height: 100vh;
  color: white;
  padding: 2rem;
}

.logo img {
  width: 40px;
  height: 40px;
}

.nav-links img {
  width: 24px;
  height: 24px;
  color: white;
}
</style>
