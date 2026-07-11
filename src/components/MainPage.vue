<template>
  <div class="main-page">
    <Navigation />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <AchievementsSection />
    <HiringSection />
    <ProjectsSection />
    <LabsSection />
    <FriendsSection />
    <InspirationsSection />
    <CommunitiesSection />
    <ContactSection />
    <Footer />
    <ModernEasterEggs />
    <SnackersEasterEggs />
    <Win11EasterEggs />
    <MacosEasterEggs />
    <Win95EasterEggs />
    <MacClassicEasterEggs />
    <ClassicEasterEggs />
  </div>
</template>

<script setup lang="ts">
import Navigation from './ui/Navigation.vue';
import HeroSection from './sections/HeroSection.vue';
import AboutSection from './sections/AboutSection.vue';
import SkillsSection from './sections/SkillsSection.vue';
import AchievementsSection from './sections/AchievementsSection.vue';
import HiringSection from './sections/HiringSection.vue';
import ProjectsSection from './sections/ProjectsSection.vue';
import LabsSection from './sections/LabsSection.vue';
import FriendsSection from './sections/FriendsSection.vue';
import InspirationsSection from './sections/InspirationsSection.vue';
import CommunitiesSection from './sections/CommunitiesSection.vue';
import ContactSection from './sections/ContactSection.vue';
import Footer from './ui/Footer.vue';
import ModernEasterEggs from './modern/ModernEasterEggs.vue';
import SnackersEasterEggs from './snackers/SnackersEasterEggs.vue';
import Win11EasterEggs from './win11/Win11EasterEggs.vue';
import MacosEasterEggs from './macos/MacosEasterEggs.vue';
import Win95EasterEggs from './win95/Win95EasterEggs.vue';
import MacClassicEasterEggs from './macclassic/MacClassicEasterEggs.vue';
import ClassicEasterEggs from './classic/ClassicEasterEggs.vue';
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

/* Page load animation */
.main-page > * {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.main-page > *:nth-child(1) { animation-delay: 0.1s; }
.main-page > *:nth-child(2) { animation-delay: 0.2s; }
.main-page > *:nth-child(3) { animation-delay: 0.3s; }
.main-page > *:nth-child(4) { animation-delay: 0.4s; }
.main-page > *:nth-child(5) { animation-delay: 0.5s; }
.main-page > *:nth-child(6) { animation-delay: 0.6s; }
.main-page > *:nth-child(7) { animation-delay: 0.7s; }
.main-page > *:nth-child(8) { animation-delay: 0.8s; }
.main-page > *:nth-child(9) { animation-delay: 0.9s; }
.main-page > *:nth-child(10) { animation-delay: 1.0s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
