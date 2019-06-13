<template>
    <div>
        <div class="listing">
            <ul>
                <li v-bind:key="channel.id" v-for="channel in channels"
                    v-bind:class="{'active': (channel.id === channel_id)}">
                    <a v-on:click="select(channel.id, $event)">{{channel.name}}</a>
                </li>
                <li class="action" v-bind:class="{'active': (new_id)}">
                    <a v-on:click="createNew()">New</a>
                </li>
            </ul>
        </div>
        <channel-item v-bind:channel_id="channel_id"/>
    </div>
</template>

<script>
    import Item from "@/pages/channels/Item.vue";

    export default {
        name: "channel-listing",
        components: {
            'channel-item': Item
        },


        data() {
            return {
                channel_id: false,
                new_id: false
            }
        },

        computed: {
            channels() {
                return this.$store.state.channels || false;
            }
        },
        methods: {
            /**
             * @param id
             * @param event
             */
            select(id, event) {
                if (event)
                    event.preventDefault();

                this.new_id = false;
                this.channel_id = id;
            },

            createNew() {
                this.channel_id = false;
                this.channel = false;
                this.new_id = true;
            }
        }
    };
</script>

<style lang="scss">
    .listing {
        width: 100%;
        overflow: hidden;
        padding-left: 10px;

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;

            li {
                display: inline-block;
                transition: all ease-in-out .3s;
                opacity: 0.5;
                padding: 10px;
                margin: 0;

                a {
                    font-size: $fs-xl;
                    &:before {
                        width: 0;
                        position: absolute;
                        content: '';
                        height: 2px;
                        background-color: #ffffff;
                        bottom: 0px;
                        overflow: hidden;
                    }

                    &:hover {
                        cursor: pointer;
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

            .action {
                font-weight: bold;
            }
        }
    }
</style>