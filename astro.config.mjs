// @ts-check

import starlight from "@astrojs/starlight";
import {defineConfig} from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
    site: 'https://refactoring-is-my-business.com',
    output: "static",

    integrations: [starlight({
        plugins: [starlightThemeRapide()],
        title: "Refactoring Is My Business",
        customCss: [
            "/src/assets/global.css",
        ],
        logo: {
            light: '/src/assets/logo.png',
            dark: '/src/assets/logo.png',
        },
        favicon: "/favicon.ico",
        social: [
            {
                icon: "github",
                label: "GitHub",
                href: "https://github.com/OpenReysin/refactoring-is-my-business",
            },
        ],

        components: {
            TableOfContents: './src/components/CustomTableOfContents.astro',
        },
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
            {
                label: "Useful libraries",
                translations: {
                    fr: "Librairies Utiles",
                },
                items: [
                    {
                        slug: "useful-libraries",
                    },
                    {
                        label: "JavaScript / TypeScript",
                        autogenerate: {
                            directory: "useful-libraries/javascript-typescript",
                        },
                    }
                ]
            }
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
    })],
});