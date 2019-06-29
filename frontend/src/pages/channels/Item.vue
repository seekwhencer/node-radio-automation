<template>
    <div class="item" v-if="channel">
        <h2>{{channel.name}}</h2>
        <h3>{{channel.options.description}}</h3>
        <h3>{{channel.mount}}</h3>
    </div>
</template>

<script>
    export default {
        name: 'channel_item',
        props: ['channel_id'],

        data() {
            return {
                channel: false
            }
        },

        watch: {
            channel_id(newVal) {
                this.select(newVal);
            }
        },

        methods: {
            /**
             * @param id
             */
            select(id) {
                if (id === false)
                    return false;

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
                            this.channel = data;
                            this.$store.commit('selectChannel', data);
                        }
                        return data;
                    });

            }
        }
    };
</script>

<style>
    .item {
        overflow: hidden;
    }
</style>