// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import {ion} from 'starlight-ion-theme';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Refactoring Is My Business',
            social: [
                {icon: 'github', label: 'GitHub', href: 'https://github.com/OpenReysin/refactoring-is-my-business'}
            ],
            sidebar: [
                {
                    label: 'Home',
                    translations: {
                        fr: 'Accueil',
                    },
                    slug: ''
                },
                {
                    label: 'Principes',
                    translations: {
                        fr: 'Principes',
                    },
                    items: [
                        {
                            label: 'Development Principles',
                            translations: {
                                fr: 'Principes de Développement',
                            },
                            slug: 'principles'
                        },
                        {
                            label: 'KISS, Keep it simple, stupid!',
                            slug:  'principles/kiss'
                        },
                        {
                            label: 'SOLID, 5 Principles OOP',
                            translations:  {
                                fr: 'SOLID, 5 Principes POO'
                            },
                            slug:  'principles/solid'
                        },
                        {
                            label: 'DRY, Don\'t Repeat Yourself',
                            slug:  'principles/dry'
                        },
                        {
                            label: 'Law of Demeter',
                            translations:  {
                                fr: 'Loi de Déméter'
                            },
                            slug:  'principles/demeter'
                        },
                    ]
                },
            ],
            defaultLocale: 'root',
            locales: {
                root: {
                    label: 'English',
                    lang: 'en', // lang est nécessaire pour les locales racine
                },
                // Docs en arabe dans `src/content/docs/ar/`
                fr: {
                    label: 'Francais',
                    lang: 'fr',
                },
            },
            plugins: [ion()],
        }),
    ],
});
