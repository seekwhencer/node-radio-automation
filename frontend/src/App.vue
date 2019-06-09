<template>
    <div id="app" v-if="this.$store.state.ready === true">
        <page-header/>
        <page-navigation/>
        <div class="page-content">
            <router-view/>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src
    import PageHeader from "@/components/common/PageHeader.vue";
    import Navigation from "@/components/common/Navigation.vue";

    export default {
        name: "App",
        components: {
            'page-header': PageHeader,
            'page-navigation': Navigation,
        },
        created: function () {
            this.$store.state.ready = true;
            console.log('>>>> CREATED');
        }
    };
</script>

<style lang="scss">
    .page-content {
        padding: 30px;
    }

    #app {
    }
</style>
