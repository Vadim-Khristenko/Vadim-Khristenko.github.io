<template>
  <section id="donate" class="donate">
    <div class="donate-container">
      <!-- Header -->
      <div class="section-header">
        <h2 class="section-title">
          <span class="heart">💝</span>
          {{ t('donate.title') }}
        </h2>
        <p class="section-subtitle">{{ t('donate.subtitle') }}</p>
      </div>

      <!-- Fiat Methods -->
      <div class="donate-fiat">
        <a href="https://dalink.to/vai_prog" target="_blank" rel="noopener" class="fiat-card coffee">
          <div class="fiat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/>
              <line x1="10" y1="1" x2="10" y2="4"/>
              <line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <h3>Buy Me a Coffee</h3>
          <p>dalink.to</p>
        </a>

        <a href="https://patreon.com/VAI_PROG" target="_blank" rel="noopener" class="fiat-card patreon">
          <div class="fiat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 .48v23.04h4.22V.48zm15.385.634c-4.612 0-8.154 3.37-8.154 8.078 0 4.666 3.509 8.047 8.154 8.047 4.639 0 8.17-3.381 8.17-8.047 0-4.708-3.531-8.078-8.17-8.078z"/>
            </svg>
          </div>
          <h3>Patreon</h3>
          <p>@VAI_PROG</p>
        </a>

        <a href="https://yoomoney.ru/fundraise/1GA2JV51324.260304" target="_blank" rel="noopener" class="fiat-card yoomoney">
          <div class="fiat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-15v4H8v2h3v7h2v-7h3v-2h-3V7h-2z"/>
            </svg>
          </div>
          <h3>YooMoney</h3>
          <p>РФ карты</p>
        </a>
      </div>

      <!-- Crypto Section -->
      <div class="crypto-section">
        <h3 class="crypto-title">
          <span class="crypto-icon">₿</span>
          {{ t('donate.crypto') }}
        </h3>
        
        <div class="crypto-grid">
          <button 
            v-for="crypto in cryptos" 
            :key="crypto.id"
            class="crypto-card"
            @click="copyAddress(crypto)"
          >
            <div class="crypto-card__header">
              <div class="crypto-logo" :style="{ background: crypto.color + '20', color: crypto.color }">
                <span v-if="crypto.symbol === 'BTC'">₿</span>
                <span v-else-if="crypto.symbol === 'ETH'">Ξ</span>
                <span v-else-if="crypto.symbol === 'TON'">T</span>
                <span v-else-if="crypto.symbol === 'USDT'">₮</span>
                <span v-else-if="crypto.symbol === 'TRX'">Ŧ</span>
                <span v-else-if="crypto.symbol === 'SOL'">◎</span>
                <span v-else>◈</span>
              </div>
              <div class="crypto-info">
                <h4>{{ crypto.name }}<span v-if="crypto.note" class="crypto-net">{{ crypto.note }}</span></h4>
                <span class="crypto-hint">{{ copied === crypto.id ? t('contact.copied') : t('donate.cryptoCopy') }}</span>
              </div>
            </div>
            <div class="crypto-address">
              {{ crypto.address }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '@/composables/useI18n';

const { t } = useI18n();

const copied = ref<string | null>(null);

const cryptos = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1qwvfpdhjuzelw8s9vxcfjj6fatnq3cltf0d48jy',
    color: '#f7931a',
    note: '',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x277195Ff068756F09683FAB523b2cdDf8Ef35B44',
    color: '#627eea',
    note: '',
  },
  {
    id: 'ton',
    name: 'Toncoin',
    symbol: 'TON',
    address: 'UQBVdcwKqy8lx_2plsf2YPbcBJdYbPtnKbddmFWZntqiAEME',
    color: '#0098ea',
    note: 'Toncoin Wallet',
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    address: 'UQCaNScHxNbJsCi5Wc47rJqNpJPiDASUlMJ1nRwxq-hXSGoQ',
    color: '#26a17b',
    note: 'JETTON · TON',
  },
  {
    id: 'trx',
    name: 'TRON',
    symbol: 'TRX',
    address: 'TC8dYqkDYQkuCKe7A6PWXUgDRB8Rr2Xd9f',
    color: '#ff060a',
    note: 'Trust Wallet',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    address: '4i2uWx82jhgVorPQyM2y47X2YvRgCVNNWPfNmVrGcCaE',
    color: '#14f195',
    note: '',
  },
];

function copyAddress(crypto: typeof cryptos[0]) {
  navigator.clipboard.writeText(crypto.address).then(() => {
    copied.value = crypto.id;
    setTimeout(() => {
      copied.value = null;
    }, 2000);
  });
}
</script>

<style scoped>
.donate {
  padding: 6rem 2rem;
  position: relative;
}

.donate-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.heart {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.section-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Fiat */
.donate-fiat {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 4rem;
}

.fiat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s ease;
}

.fiat-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.06);
}

.fiat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
}

.fiat-icon svg {
  width: 28px;
  height: 28px;
}

.fiat-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.fiat-card p {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Platform colors */
.coffee:hover {
  border-color: #ffdd00;
  box-shadow: 0 10px 30px rgba(255, 221, 0, 0.1);
}

.coffee .fiat-icon {
  background: rgba(255, 221, 0, 0.15);
  color: #ffdd00;
}

.patreon:hover {
  border-color: #ff424d;
  box-shadow: 0 10px 30px rgba(255, 66, 77, 0.1);
}

.patreon .fiat-icon {
  background: rgba(255, 66, 77, 0.15);
  color: #ff424d;
}

.yoomoney:hover {
  border-color: #8b5cf6;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.1);
}

.yoomoney .fiat-icon {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

/* Crypto Section */
.crypto-section {
  margin-top: 3rem;
}

.crypto-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.crypto-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f7931a, #ff6b35);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.crypto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.crypto-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-family: inherit;
}

.crypto-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.crypto-card__header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.75rem;
}

.crypto-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  flex-shrink: 0;
}

.crypto-info h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.125rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.crypto-net {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.crypto-hint {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.crypto-address {
  font-size: 0.6875rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  word-break: break-all;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Responsive */
@media (max-width: 640px) {
  .donate {
    padding: 4rem 1rem;
  }
  
  .donate-fiat {
    grid-template-columns: 1fr;
  }
  
  .crypto-grid {
    grid-template-columns: 1fr;
  }
}
</style>