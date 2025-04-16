<script setup>
import { ref, computed } from 'vue'
import nomLogo from './assets/nom-logo.svg'
import githubIcon from './assets/github.svg'
import discordIcon from './assets/discord.svg'
import './style.css'

const email = ref('')
const isEmailValid = ref(false)
const activeTab = ref('npm')
const logs = ref([])

const validateEmail = () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isEmailValid.value = re.test(email.value)
}

const subscribe = () => {
  if (isEmailValid.value) {
    // Add subscription logic here
    alert(`Thanks for subscribing with ${email.value}!`)
    email.value = ''
  }
}

const installCommands = {
  npm: 'npm install -g @teckmill/nom-cli',
  yarn: 'yarn global add @teckmill/nom-cli',
  bun: 'bun add -g @teckmill/nom-cli'
}

const getInstallCommand = computed(() => {
  return installCommands[activeTab.value]
})
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

    <section id="get-started" class="section">
      <div class="container">
        <h2>Get Started with Nom Core</h2>
        <div class="install-container">
          <div class="tabs">
            <button 
              :class="{ active: activeTab === 'npm' }" 
              @click="activeTab = 'npm'">npm</button>
            <button 
              :class="{ active: activeTab === 'yarn' }" 
              @click="activeTab = 'yarn'">yarn</button>
            <button 
              :class="{ active: activeTab === 'bun' }" 
              @click="activeTab = 'bun'">bun</button>
          </div>
          <div class="code-block">
            <pre><code>{{ getInstallCommand }}</code></pre>
            <button class="copy-btn" @click="navigator.clipboard.writeText(getInstallCommand)">Copy</button>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="section">
      <div class="container">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>Secure Sandboxing</h3>
            <p>Run plugins in a secure WebAssembly sandbox with controlled access to system resources</p>
          </div>
          <div class="feature-card">
            <h3>Language Agnostic</h3>
            <p>Write plugins in any language that compiles to WebAssembly (Rust, C/C++, AssemblyScript, etc.)</p>
          </div>
          <div class="feature-card">
            <h3>High Performance</h3>
            <p>Near-native performance with minimal overhead compared to traditional plugin systems</p>
          </div>
          <div class="feature-card">
            <h3>Easy Integration</h3>
            <p>Simple API for loading and interacting with plugins in your application</p>
          </div>
        </div>
      </div>
    </section>

    <section id="plugins" class="section">
      <div class="container">
        <h2>Plugin Ecosystem</h2>
        <p>Discover and use plugins from our growing ecosystem, or create your own.</p>
        <div class="plugins-grid">
          <div class="plugin-card">
            <h3>Authentication Plugin</h3>
            <p>Add secure authentication to your application</p>
            <a href="https://github.com/Nom-nom-hub/nom-core/tree/main/plugins/auth" class="plugin-link">View Plugin</a>
          </div>
          <div class="plugin-card">
            <h3>Validator Plugin</h3>
            <p>Validate data with customizable rules</p>
            <a href="https://github.com/Nom-nom-hub/nom-core/tree/main/plugins/validator" class="plugin-link">View Plugin</a>
          </div>
          <div class="plugin-card">
            <h3>Logger Plugin</h3>
            <p>Advanced logging capabilities for your application</p>
            <a href="https://github.com/Nom-nom-hub/nom-core/tree/main/plugins/logger" class="plugin-link">View Plugin</a>
          </div>
        </div>
      </div>
    </section>

    <section id="docs" class="section">
      <div class="container">
        <h2>Documentation</h2>
        <div class="docs-grid">
          <div class="doc-card">
            <h3>Quick Start</h3>
            <p>Get up and running with Nom Core in minutes</p>
            <a href="#" class="doc-link">Read Guide</a>
          </div>
          <div class="doc-card">
            <h3>API Reference</h3>
            <p>Detailed API documentation for developers</p>
            <a href="#" class="doc-link">View API</a>
          </div>
          <div class="doc-card">
            <h3>Plugin Development</h3>
            <p>Learn how to create your own plugins</p>
            <a href="#" class="doc-link">Read Guide</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section newsletter">
      <div class="container">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for updates, new features, and community news</p>
        <div class="newsletter-form">
          <input 
            type="email" 
            v-model="email" 
            @input="validateEmail" 
            placeholder="Enter your email" 
            class="email-input"
          />
          <button 
            @click="subscribe" 
            :disabled="!isEmailValid" 
            class="subscribe-btn"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img :src="nomLogo" alt="Nom Core" />
            <span>Nom Core</span>
          </div>
          <div class="footer-links">
            <div class="footer-column">
              <h4>Project</h4>
              <a href="#features">Features</a>
              <a href="#plugins">Plugins</a>
              <a href="#docs">Documentation</a>
            </div>
            <div class="footer-column">
              <h4>Community</h4>
              <a href="https://github.com/Nom-nom-hub/nom-core">GitHub</a>
              <a href="#">Discord</a>
              <a href="#">Twitter</a>
            </div>
            <div class="footer-column">
              <h4>Legal</h4>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">License</a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} Nom Core. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Add these basic styles to get started */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

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

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
}

.logo img {
  width: 40px;
  height: 40px;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.nav-links img {
  width: 24px;
  height: 24px;
}

.hero-content {
  max-width: 800px;
  margin: 8rem auto 0;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.primary-btn {
  background-color: white;
  color: #0072FF;
}

.primary-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.secondary-btn {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.secondary-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.section {
  padding: 5rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #0072FF;
}

.install-container {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  background-color: #f5f5f5;
}

.tabs button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.tabs button.active {
  background-color: #e0e0e0;
  color: #0072FF;
}

.code-block {
  background-color: #2d3748;
  color: white;
  padding: 1.5rem;
  position: relative;
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.8rem;
}

.copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.features-grid, .plugins-grid, .docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card, .plugin-card, .doc-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover, .plugin-card:hover, .doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3, .plugin-card h3, .doc-card h3 {
  color: #0072FF;
  margin-top: 0;
  margin-bottom: 1rem;
}

.plugin-link, .doc-link {
  display: inline-block;
  margin-top: 1rem;
  color: #0072FF;
  font-weight: 600;
  text-decoration: none;
}

.plugin-link:hover, .doc-link:hover {
  text-decoration: underline;
}

.newsletter {
  background-color: #f5f5f5;
  text-align: center;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 2rem auto 0;
}

.email-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem 0 0 0.5rem;
  font-size: 1rem;
}

.subscribe-btn {
  background-color: #0072FF;
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.subscribe-btn:hover:not(:disabled) {
  background-color: #005dd1;
}

.subscribe-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.footer {
  background-color: #2d3748;
  color: white;
  padding: 4rem 2rem 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
}

.footer-logo img {
  width: 40px;
  height: 40px;
}

.footer-links {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-column h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #00C6FF;
}

.footer-column a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.footer-column a:hover {
  opacity: 1;
}

.copyright {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.6;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 3rem;
  }
  
  .footer-links {
    gap: 2rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .email-input {
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .subscribe-btn {
    border-radius: 0.5rem;
    padding: 0.75rem;
  }
}
</style>
