<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app">
    <header class="hero">
      <nav class="nav">
        <div class="logo">
          <img src="/nom-logo.svg" alt="Nom Core" />
          <span>Nom Core</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#plugins">Plugins</a>
          <a href="#docs">Docs</a>
          <a href="https://github.com/Nom-nom-hub/nom-core" class="github-link">
            <img src="/github.svg" alt="GitHub" />
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
</style>
