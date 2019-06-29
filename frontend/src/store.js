import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


const getStorageJson = (field) => {
    if (localStorage[field]) {
        try {
            return JSON.parse(localStorage[field]);
        } catch (e) {
        }
        return [];
    }
};

const setStorageJson = (field, data) => {
    try {
        localStorage[field] = JSON.stringify(data);
    } catch(e){}
};


export default new Vuex.Store({
    state: {
        ready: false,
        locale: 'en',
        locales: {
            de: 'de_DE',
            en: 'en_EN',
        },
        user: {
            token: localStorage.token
        },
        channels: getStorageJson('channels'),
        pages: [
            {
                slug: '',
                label: 'Dashboard'
            },
            {
                slug: 'channels',
                label: 'Channels',
               /* childs: [
                    {
                        slug: 'new',
                        label: 'New'
                    }, {
                        slug: 'statistics',
                        label: 'Statistics'
                    }
                ]*/
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
        setToken: (state, data) => {
            state.user.token = data;
            localStorage.token = data;
        },
        setChannels: (state, data) => {
            state.channels = data;
            setStorageJson('channels', data);
        },
        selectChannel: (state, data) => {
            state.channel = data;
            setStorageJson('channel', data);
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
