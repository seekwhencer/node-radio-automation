import Vue from "vue";
import Router from "vue-router";

import DashboardPage from "./pages/Dashboard.vue";
import LoginPage from "./pages/Login.vue";
import LogoutPage from "./pages/Logout.vue";
import ChannelsPage from "./pages/Channels.vue";
import NewChannelPage from "./pages/channels/NewChannel.vue";
import ChannelsStatisticsPage from "./pages/channels/ChannelsStatistics.vue";

import ShowsPage from "./pages/Shows.vue";
import PodcastsPage from "./pages/Podcasts.vue";
import SettingsPage from "./pages/Settings.vue";

import ChannelItem from "./pages/channels/Item.vue";



Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: DashboardPage
        }, {
            path: "/login",
            name: "login",
            component: LoginPage
        }, {
            path: "/logout",
            name: "logout",
            component: LogoutPage
        }, {
            path: "/channels",
            name: "channels",
            component: ChannelsPage,
            children: [
                {
                    path: 'new',
                    name: "channels_new",
                    component: NewChannelPage
                }, {
                    path: 'statistics',
                    name: "channels_statistics",
                    component: ChannelsStatisticsPage
                }
            ]
        }, {
            path: "/shows",
            name: "shows",
            component: ShowsPage
        }, {
            path: "/podcasts",
            name: "podcasts",
            component: PodcastsPage
        }, {
            path: "/settings",
            name: "settings",
            component: SettingsPage
        },
        {
            path: '/channels/:channel_id',
            name: 'channel',
            component: ChannelItem
        }
    ]
});
