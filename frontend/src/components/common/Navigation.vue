<template>
    <div class="navigation">
        <ul>
            <li v-bind:key="page.slug" v-for="page in pages"
                v-bind:class="{'active': (page.slug.toLowerCase() === path)}">
                <router-link :to="`/${page.slug}`">{{ page.label }}</router-link>
                <SubNavigation v-if="path === page.slug.toLowerCase()" v-bind:active_page="page"/>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import SubNavigation from "@/components/common/SubNavigation.vue";

    export default {
        name: "Navigation",
        components: {
            SubNavigation
        },
        computed: {
            ...mapState([
                'pages'
            ]),
            route: {
                get: function () {
                    return this.$route;
                }
            },
            path: {
                get: function () {
                    return this.$route.path.split('/')[1];
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .navigation {
        line-height: 1em;
        position: relative;

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;

            li {
                display: inline-block;
                transition: all ease-in-out .3s;
                opacity: 0.5;
                padding: 20px;
                margin: 0;

                a {
                    &:before {
                        width: 0;
                        position: absolute;
                        content: '';
                        height: 2px;
                        background-color: #ffffff;
                        bottom: 0px;
                        overflow: hidden;
                    }

                }

                &.active {
                    opacity: 1;
                    transition: all 0.2s 0.3s;

                    a {
                        position: relative;

                        &:before {
                            transition: width ease-out 0.4s;
                            width: 100%;
                        }
                    }
                }
            }
        }

        a {
            font-size: $fs-xl;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
            &.router-link-exact-active {

            }

        }
    }
</style>
