import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        ready: false,
        locale: 'en',
        locales: {
            de: 'de_DE',
            en: 'en_EN',
        },
        slugs: {
            de: [],
            en: []
        },
        translation: {},
        pages: [
            {
                slug: '',
                label: 'Dashboard'
            },
            {
                slug: 'channels',
                label: 'Channels',
                childs: [
                    {
                        slug: 'new',
                        label: 'New'
                    },{
                        slug: 'statistics',
                        label: 'Statistics'
                    }
                ]
            },
            {
                slug: 'shows',
                label: 'Shows'
            },
            {
                slug: 'podcasts',
                label: 'Podcasts'
            },
            {
                slug: 'settings',
                label: 'Settings'
            }
        ]
    },
    getters: {
        pageCount: state => {
            return state.pages.length;
        },
        isReady: state => {
            return state.ready;
        }
    },
    mutations: {
        setPages: (state, pages) => {
            state.pages = pages;
        },
        setTranslation: (state, translation) => {
            state.translation = translation;
        },
        setLocale: (state, locale) => {
            state.locale = locale;
        },
        setReady: (state, ready) => {
            state.ready = ready;
        }
    },
    actions: {}
});
