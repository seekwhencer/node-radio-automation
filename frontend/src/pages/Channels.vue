<template>
    <div class="channels">
        <channel-listing  v-if="channels.length > 0"/>
        <channel-item/>
    </div>
</template>

<script>
    import Listing from "@/pages/channels/Listing.vue";
    import Item from "@/pages/channels/Item.vue";

    export default {
        name: "channels",
        components: {
            'channel-listing': Listing,
            'channel-item': Item
        },

        async created(){
            return this.getChannels();
        },

        computed:{
            channels(){
                return this.$store.state.channels;
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
                        return data;
                    });
            },
        }
    };
</script>

<style>

</style>
