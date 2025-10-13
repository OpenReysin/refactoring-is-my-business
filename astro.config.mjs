// @ts-check

import starlight from "@astrojs/starlight";
import {defineConfig} from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightGiscus from 'starlight-giscus'
import starlightLinksValidator from 'starlight-links-validator'

// https://astro.build/config
export default defineConfig({
    site: 'https://refactoring-is-my-business.com',
    output: "static",

    integrations: [starlight({
        plugins: [
            starlightThemeRapide(),
            starlightAutoSidebar(),
            starlightGiscus({
                repo: 'OpenReysin/refactoring-is-my-business',
                repoId: 'R_kgDOP2xpFw',
                category: 'Polls',
                categoryId: 'DIC_kwDOP2xpF84CwlCT',
                mapping: 'pathname',
                lazy: true,
                reactions: true
            }),
            starlightLinksValidator()
        ],
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
            Pagination: './src/components/CustomPagination.astro',
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
                label: "How to Contribute",
                translations: {
                    fr: "Comment contribuer"
                },
                slug: "contribute",
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
            // {
            //     label: "Design Patterns",
            //     translations: {
            //         fr: "Design Patterns",
            //     },
            //     items: [
            //         {
            //             slug: "design-patterns",
            //         },
            //         {
            //             label: "Creational Patterns",
            //             translations: {
            //                 fr: "Creational Patterns",
            //             },
            //             autogenerate: {
            //                 directory: "design-patterns/creational",
            //             },
            //         },
            //         {
            //             label: "Structural Patterns",
            //             translations: {
            //                 fr: "Structural Patterns",
            //             },
            //             autogenerate: {
            //                 directory: "design-patterns/structural",
            //             },
            //         },
            //         {
            //             label: "Behavioral Patterns",
            //             translations: {
            //                 fr: "Behavioral Patterns",
            //             },
            //             autogenerate: {
            //                 directory: "design-patterns/behavioral",
            //             },
            //         }
            //     ]
            {
                label: "Design Patterns",
                translations: {
                    fr: "Design Patterns",
                },
                autogenerate: {
                    directory: "design-patterns",
                }
            },
            {
                label: "Useful libraries",
                translations: {
                    fr: "Librairies Utiles",
                },
                autogenerate: {
                    directory: "useful-libraries",
                }
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