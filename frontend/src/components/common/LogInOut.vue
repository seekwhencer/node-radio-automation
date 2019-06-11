<template>
    <div class="loginout">
        <div v-if="!loggedIn">
            <router-link :to="`/login`">Login</router-link>
        </div>
        <div v-if="loggedIn">
            <router-link :to="`/logout`">Logout</router-link>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "LogInOut",
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

<style scoped lang="scss">
    .loginout {
        position: absolute;
        z-index:2;
        right: 0;
        top: 0;
        padding: 20px;

        a {
            color: #ffffff;
            text-decoration: none;
        }

    }
</style>
