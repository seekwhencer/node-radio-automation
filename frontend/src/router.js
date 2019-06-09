import Vue from "vue";
import Router from "vue-router";

import HomePage from "./pages/Home.vue";
import LoginPage from "./pages/Login.vue";
import ChannelsPage from "./pages/Channels.vue";
import NewChannelPage from "./pages/channels/NewChannel.vue";
import ChannelsStatisticsPage from "./pages/channels/ChannelsStatistics.vue";

import ShowsPage from "./pages/Shows.vue";
import PodcastsPage from "./pages/Podcasts.vue";
import SettingsPage from "./pages/Settings.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage
        },
        {
            path: "/login",
            name: "login",
            component: LoginPage
        },
        {
            path: "/channels",
            name: "channels",
            component: ChannelsPage,
            children: [
                {
                    path: 'new',
                    name: "channels_new",
                    component: NewChannelPage
                },{
                    path: 'statistics',
                    name: "channels_statistics",
                    component: ChannelsStatisticsPage
                }
            ]
        },
        {
            path: "/shows",
            name: "shows",
            component: ShowsPage
        },
        {
            path: "/podcasts",
            name: "podcasts",
            component: PodcastsPage
        },
        {
            path: "/settings",
            name: "settings",
            component: SettingsPage
        }
    ]
});
