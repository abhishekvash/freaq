<script setup lang="ts">
import { useFreaqConsoleSignal } from "~/composables/app/useFreaqConsoleSignal";

useHead({
	script: [
		{
			innerHTML: "document.documentElement.classList.add('js')",
			tagPosition: "head",
		},
	],
});

useFreaqConsoleSignal();
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtPage />
</template>
