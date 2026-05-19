<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
	if (typeof window === "undefined") return;
	const freaqWindow = window as Window & { __freaqSignaled?: boolean };
	if (freaqWindow.__freaqSignaled) return;
	freaqWindow.__freaqSignaled = true;

	const mono =
		"font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace";
	console.log(
		"%c> FREAQ // SIGNAL CHECK",
		`${mono};color:#F04436;font-size:18px;font-weight:700;letter-spacing:0.04em`
	);
	console.log(
		"%c  one seed. one clock. one bounce. friday opens the vault.",
		`${mono};color:#AFA89D;font-size:12px`
	);
	console.log(
		"%c  if you finish ideas under pressure, signal@freaq.club",
		`${mono};color:#E8E2D8;font-size:12px`
	);
});
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtPage />
</template>
