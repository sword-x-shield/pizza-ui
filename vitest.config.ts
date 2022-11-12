import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
    plugins: [
        VueMacros({
            setupComponent: false,
            setupSFC: false,
            plugins: {
                vue: Vue()
            },
        }),
    ],
    test: {
        clearMocks: true,
        globals: true,
        environment: 'jsdom',
        include: [
            'packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
        setupFiles: ['./vitest.setup.ts'],
        transformMode: {
            web: [/\.[jt]sx$/],
        },
    },
})
