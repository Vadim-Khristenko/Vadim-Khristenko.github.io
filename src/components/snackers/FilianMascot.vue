<template>
  <!-- Custom Filian-style chibi (white hair · cat ears · violet eyes).
       Hand-drawn SVG — her official art was pulled in May 2026, so we don't
       hotlink it; this is a recognisable tribute, not a copyrighted asset. -->
  <svg class="filian" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Filian mascot">
    <!-- ears -->
    <path d="M19 32 L13 7 L36 23 Z" fill="#FFFFFF" stroke="#9B4DFF" stroke-width="2" stroke-linejoin="round" />
    <path d="M61 32 L67 7 L44 23 Z" fill="#FFFFFF" stroke="#9B4DFF" stroke-width="2" stroke-linejoin="round" />
    <path d="M21 28 L18 14 L31 23 Z" fill="#FF5FA2" />
    <path d="M59 28 L62 14 L49 23 Z" fill="#FF5FA2" />
    <!-- face -->
    <circle cx="40" cy="45" r="24" fill="#FFE9F1" />
    <!-- hair -->
    <path d="M15 46 Q15 18 40 18 Q65 18 65 46 Q57 31 40 31 Q23 31 15 46 Z" fill="#FFFFFF" stroke="#EBDDFF" stroke-width="1.5" />
    <path d="M15 45 Q12 58 20 64 L25 45 Z" fill="#FFFFFF" stroke="#EBDDFF" stroke-width="1.2" />
    <path d="M65 45 Q68 58 60 64 L55 45 Z" fill="#FFFFFF" stroke="#EBDDFF" stroke-width="1.2" />
    <!-- eyes -->
    <ellipse cx="31" cy="47" rx="5" ry="7.5" fill="#9B4DFF" />
    <ellipse cx="49" cy="47" rx="5" ry="7.5" fill="#9B4DFF" />
    <circle cx="33" cy="44" r="2.1" fill="#FFFFFF" />
    <circle cx="51" cy="44" r="2.1" fill="#FFFFFF" />
    <circle cx="30" cy="50" r="1" fill="#FFD24A" />
    <circle cx="48" cy="50" r="1" fill="#FFD24A" />
    <!-- blush -->
    <ellipse cx="23" cy="54" rx="4" ry="2.4" fill="#FF9EC9" opacity="0.75" />
    <ellipse cx="57" cy="54" rx="4" ry="2.4" fill="#FF9EC9" opacity="0.75" />
    <!-- :3 mouth -->
    <path d="M36 55 Q40 60 44 55" fill="none" stroke="#B83A78" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts"></script>

<style scoped>
.filian { display: block; width: 100%; height: 100%; }
</style>
