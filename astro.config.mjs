// @ts-check

import starlight from "@astrojs/starlight";
import {defineConfig} from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    site: 'https://refactoring-is-my-business.com',
    output: "server",
    server: {
        host: true, // This makes it listen on 0.0.0.0
        port: 4321
    },
    adapter: node({
        mode: "standalone",
    }),

    integrations: [
        starlight({
            plugins: [starlightThemeRapide()],
            title: "Refactoring Is My Business",
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/OpenReysin/refactoring-is-my-business",
                },
            ],
            sidebar: [
                {
                    label: "Getting Starred",
                    translations: {
                        fr: "Pour Commencer",
                    },
                    slug: "getting-started",
                },
                {
                    label: "Principes",
                    translations: {
                        fr: "Principes",
                    },
                    autogenerate: {
                        directory: "principles",
                    },
                },
                {
                    label: "Design Patterns",
                    translations: {
                        fr: "Design Patterns",
                    },
                    items: [
                        {
                            slug: "design-patterns",
                        },
                        {
                            label: "Creational Patterns",
                            translations: {
                                fr: "Creational Patterns",
                            },
                            autogenerate: {
                                directory: "design-patterns/creational",
                            },
                        },
                        {
                            label: "Structural Patterns",
                            translations: {
                                fr: "Structural Patterns",
                            },
                            autogenerate: {
                                directory: "design-patterns/structural",
                            },
                        },
                        {
                            label: "Behavioral Patterns",
                            translations: {
                                fr: "Behavioral Patterns",
                            },
                            autogenerate: {
                                directory: "design-patterns/behavioral",
                            },
                        }
                    ]
                },
            ],
            defaultLocale: "root",
            locales: {
                root: {
                    label: "English",
                    lang: "en",
                },
                fr: {
                    label: "Francais",
                    lang: "fr",
                },
            },
        }),
    ],
});