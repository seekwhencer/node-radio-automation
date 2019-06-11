<template>
    <div>
        <div class="listing">
            <ul>
                <li v-bind:key="channel.id" v-for="channel in channels">
                    <button v-on:click="select(channel.id, $event)">{{channel.name}}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "channel-listing",
        mounted() {
            //if (!this.$store.state.channels)

        },
        data() {
            return {
                selected: false
            }
        },

        computed: {
            channels() {
                return this.$store.state.channels || false;
            }
        },
        methods: {
            /**
             *
             * @returns {Promise<Response>}
             */
            getChannels() {
                const requestOptions = {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + this.$store.state.user.token
                    })
                };

                return fetch(`${this.$config.api.url}/channels`, requestOptions)
                    .then(response => {
                        if (!response.ok)
                            return Promise.reject(response.statusText);

                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            this.$store.commit('setChannels', data);
                        }
                        return Promise.resolve(data);
                    });
            },

            /**
             *
             * @param id
             * @param event
             */
            select(id, event) {
                if (event)
                    event.preventDefault();

                this.selected = id;

                const requestOptions = {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + this.$store.state.user.token
                    })
                };

                return fetch(`${this.$config.api.url}/channel/${id}`, requestOptions)
                    .then(response => {
                        if (!response.ok)
                            return Promise.reject(response.statusText);

                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            this.$store.commit('selectChannel', data);
                        }
                        return data;
                    });

            }
        }
    };
</script>

<style lang="scss">
    .listing {
        width: 30%;
        float: left;
        ul {
            li {
                width: 100%;
                margin-bottom: 1px;
                background-color: $color-bg-mid;
                a {
                    text-decoration: none;
                    display: block;
                    font-weight: bold;
                    color: $color-bg-primary;
                    padding: 20px;
                    font-size: $fs-mid;
                }
            }
        }
    }
</style>