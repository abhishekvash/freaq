<script setup lang="ts">
import { useFreaqConsoleSignal } from "~/composables/app/useFreaqConsoleSignal";

useFreaqConsoleSignal();
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtPage />
</template>
