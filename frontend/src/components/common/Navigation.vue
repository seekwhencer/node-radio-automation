<template>
    <div class="navigation">
        <ul>
            <li v-for="page in pages" v-bind:class="{'active': (page.slug.toLowerCase() === path)}">
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
        padding: 30px;
        z-index: 1;

        ul {
            list-style-type: none;
            padding: 0;

            li {
                display: block;
                transition: all ease-in-out .3s;
                opacity: 0.9;
                position: relative;

                a {
                    &:before {
                        width: 0px;
                        position: absolute;
                        content: '';
                        height: 2px;
                        background-color: #ffffff;
                        bottom: 0px;
                    }

                }

                &.active {
                    opacity: 1;
                    margin: 50px 0px 50px 0px;
                    transition: all 0.2s 0.3s;

                    a {
                        position: relative;

                        &:before {
                            transition: width ease-out 0.4s 0.4s;
                            width: 100%;
                        }
                    }
                }
            }
        }

        a {
            font-size: 2em;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
            &.router-link-exact-active {

            }

        }
    }
</style>
