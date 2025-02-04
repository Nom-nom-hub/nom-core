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
        <div class="hero-image">
          <img src="/hero-illustration.svg" alt="Nom Core Architecture" />
        </div>
      </div>
    </header>

    <section id="features" class="features">
      <h2>Why Nom Core?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">🔌</div>
          <h3>Plugin System</h3>
          <p>Easy-to-use plugin system for WebAssembly modules</p>
        </div>
        <div class="feature-card">
          <div class="icon">🚀</div>
          <h3>High Performance</h3>
          <p>Near-native speed with WebAssembly technology</p>
        </div>
        <div class="feature-card">
          <div class="icon">🔒</div>
          <h3>Secure by Design</h3>
          <p>Sandboxed execution environment for plugins</p>
        </div>
        <div class="feature-card">
          <div class="icon">📦</div>
          <h3>Easy Distribution</h3>
          <p>Simple plugin distribution via GitHub releases</p>
        </div>
      </div>
    </section>

    <section id="demo" class="demo">
      <h2>See it in Action</h2>
      <div class="demo-container">
        <pre class="code-block"><code>
import { PluginManager } from '@nom-core/cli';

// Initialize plugin manager
const manager = new PluginManager();

// Load a plugin
await manager.loadPlugin('@nom/validator');

// Use the plugin
const validator = manager.getPlugin('@nom/validator');
const isValid = validator.validateEmail('user@example.com');
        </code></pre>
      </div>
    </section>
    <!-- After the demo section -->
    <section id="plugins" class="plugins">
      <h2>Plugin Showcase</h2>
      <div class="plugin-grid">
        <div class="plugin-card">
          <h3>Validator Plugin</h3>
          <div class="plugin-demo">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Enter email to validate"
              @input="validateEmail" 
            />
            <div class="result" :class="{ valid: isEmailValid }">
              {{ emailValidationMessage }}
            </div>
          </div>
        </div>
        <div class="plugin-card">
          <h3>Logger Plugin</h3>
          <div class="plugin-demo">
            <div class="log-window">
              <div v-for="(log, index) in logs" 
                   :key="index" 
                   :class="log.level.toLowerCase()">
                [{{ log.timestamp }}] {{ log.message }}
              </div>
            </div>
            <button @click="addLog">Add Log Entry</button>
          </div>
        </div>
      </div>
    </section>

    <section id="docs" class="documentation">
      <h2>Documentation</h2>
      <div class="doc-grid">
        <div class="doc-card">
          <h3>Quick Start</h3>
          <div class="code-tabs">
            <button 
              v-for="tab in ['npm', 'yarn']" 
              :key="tab"
              :class="{ active: activeTab === tab }"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>
          <pre class="code-block"><code>{{ installCommand }}</code></pre>
        </div>
        <div class="doc-card">
          <h3>Plugin Development</h3>
          <pre class="code-block"><code>{{ pluginExample }}</code></pre>
        </div>
      </div>
    </section>

    <section id="community" class="community">
      <h2>Join the Community</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ githubStats.stars }}</div>
          <div class="stat-label">GitHub Stars</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ githubStats.plugins }}</div>
          <div class="stat-label">Available Plugins</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ githubStats.downloads }}</div>
          <div class="stat-label">Monthly Downloads</div>
        </div>
      </div>
      <div class="community-links">
        <a href="https://github.com/Nom-nom-hub/nom-core" class="community-btn">
          <img src="/github.svg" alt="GitHub" />
          Star on GitHub
        </a>
        <a href="https://discord.gg/nom-core" class="community-btn">
          <img src="/discord.svg" alt="Discord" />
          Join Discord
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const isEmailValid = ref(false)
const activeTab = ref('npm')
const logs = ref([])

const emailValidationMessage = computed(() => {
  if (!email.value) return 'Enter an email to validate'
  return isEmailValid.value ? 'Valid email!' : 'Invalid email format'
})

const installCommand = computed(() => {
  return activeTab.value === 'npm' 
    ? 'npm install @nom-core/cli'
    : 'yarn add @nom-core/cli'
})

const pluginExample = `#[wasm_bindgen]
pub struct MyPlugin {
    state: String,
}

#[wasm_bindgen]
impl MyPlugin {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        MyPlugin {
            state: String::new(),
        }
    }
}`

const githubStats = ref({
  stars: '1.2k',
  plugins: '50+',
  downloads: '10k+'
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isEmailValid.value = emailRegex.test(email.value)
}

function addLog() {
  const levels = ['INFO', 'WARN', 'ERROR']
  const level = levels[Math.floor(Math.random() * levels.length)]
  logs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    level,
    message: `Sample ${level.toLowerCase()} message`
  })
  if (logs.value.length > 5) logs.value.shift()
}
</script>

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

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.hero-content {
  max-width: 1200px;
  margin: 4rem auto;
  text-align: center;
}

.hero-content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.primary-btn {
  background: white;
  color: #0072FF;
}

.secondary-btn {
  border: 2px solid white;
  color: white;
}

.primary-btn:hover, .secondary-btn:hover {
  transform: translateY(-2px);
}

.features {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.demo {
  padding: 6rem 2rem;
}

.demo-container {
  max-width: 800px;
  margin: 0 auto;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 2rem;
  border-radius: 8px;
  overflow-x: auto;
}

.plugins {
  padding: 6rem 2rem;
  background: white;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.plugin-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.plugin-demo {
  margin-top: 1rem;
}

.plugin-demo input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.result {
  padding: 0.5rem;
  border-radius: 4px;
  background: #ff4757;
  color: white;
}

.result.valid {
  background: #2ed573;
}

.log-window {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  height: 150px;
  overflow-y: auto;
}

.log-window .info { color: #2ed573; }
.log-window .warn { color: #ffa502; }
.log-window .error { color: #ff4757; }

.documentation {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.code-tabs {
  margin-bottom: 1rem;
}

.code-tabs button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  opacity: 0.7;
}

.code-tabs button.active {
  opacity: 1;
  border-bottom: 2px solid #0072FF;
}

.community {
  padding: 6rem 2rem;
  background: white;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 2rem auto;
}

.stat-card {
  padding: 2rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0072FF;
}

.stat-label {
  color: #666;
  margin-top: 0.5rem;
}

.community-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.community-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: #f8f9fa;
  color: #2c3e50;
  text-decoration: none;
  transition: transform 0.2s;
}

.community-btn:hover {
  transform: translateY(-2px);
}
</style>