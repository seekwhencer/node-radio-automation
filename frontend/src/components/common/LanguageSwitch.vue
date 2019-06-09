<template>
    <div class="language">
        <ul>
        </ul>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "LanguageSwitch",
        computed: {
            ...mapState([
                'locale',
                'locales'
            ])
        }
    };
</script>

<style scoped lang="scss">
    .language {
        position: absolute;
        right: 0px;
        top: 10px;
        z-index: 2;

        ul {
            list-style-type: none;
            padding: 0;

            li {
                display: inline-block;
                margin: 0 10px 0 0;

                a {
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 100;
                    &.router-link-exact-active {

                    }
                    opacity: 0.5;

                    &:hover {
                        opacity: 1;
                    }

                }

                &.active {
                    a {
                        opacity: 1;
                        font-weight: bold;
                    }
                }
            }
        }

    }
</style>
