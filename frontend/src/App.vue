<template>
    <div id="app" v-if="this.$store.state.ready === true">
        <page-loginout/>
        <page-header v-if="loggedIn"/>
        <page-navigation v-if="loggedIn"/>
        <div class="page-content">
            <router-view/>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src
    import PageHeader from "@/components/common/PageHeader.vue";
    import Navigation from "@/components/common/Navigation.vue";
    import LogInOut from "@/components/common/LogInOut.vue";

    export default {
        name: "App",
        components: {
            'page-header': PageHeader,
            'page-navigation': Navigation,
            'page-loginout': LogInOut
        },
        created() {
            this.$store.state.ready = true;
            console.log('>>>> CREATED');
        },
        computed: {
            loggedIn() {
                if (!this.$store.state.user.token) {
                    return false;
                }
                return true;
            }
        }
    };
</script>

<style lang="scss">
    .page-content {
        overflow: hidden;
        display: block;
        margin-top:0;
    }

    #app {
    }
</style>
