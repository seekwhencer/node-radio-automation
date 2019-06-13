<template>
    <div class="subnavigation">
        <ul>
            <li  v-bind:key="page.slug" v-for="page in active_page.childs" v-bind:class="{'active': (`${page.slug.toLowerCase()}` === sub)}">
                <router-link :to="`/${active_page.slug}/${page.slug}`">{{ page.label }}</router-link>
            </li>
        </ul>

    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "SubNavigation",
        props: ['active_page'],
        computed: {
            ...mapState([
                'pages'
            ]),
            route: {
                get: function () {
                    return this.$route.path;
                }
            },
            sub: {
                get: function () {
                    return this.route.split('/')[2];
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .subnavigation {
        position: absolute;
        padding: 0;
        margin: 0;
        bottom: -50px;
        left: 0;
        z-index: 1;
        width: 100%;

        ul {
            list-style-type: none;
            padding: 20px;
            margin: 0;
            display: block;

            li {
                display: inline-block;
                transition: all ease-in-out 0.2s;
                opacity: 0.6;
                margin: 0 20px 10px 0;

                &:last-child {
                    margin: 0;
                }

                a {
                    font-size: 1em;

                    &:before {
                        width: 0;
                        position: absolute;
                        content: '';
                        height: 2px;
                        background-color: #ffffff;
                        bottom: 0;
                    }

                }

                &.active {
                    opacity: 1;
                    transition: all 0.2s 0.3s;

                    a {
                        position: relative;

                        &:before {
                            transition: width ease-out 0.2s 0.4s;
                            width: 100%;
                            opacity: 1;
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
