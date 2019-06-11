<template>
    <div class="Logout">
        <h1>Logout</h1>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <button class="btn btn-primary">Logout</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        created() {
            if (!this.$store.state.user.token)
                this.$router.push('/');
        },
        methods: {
            handleLogin(e) {
                this.logout();
            },

            logout() {
                const requestOptions = {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + this.$store.state.user.token
                    })
                };

                return fetch(`${this.$config.api.url}/logout`, requestOptions)
                    .then(response => {
                        if (!response.ok)
                            return Promise.reject(response.statusText);

                        return response.json();
                    })
                    .then(data => {
                        if (data) {
                            this.$store.commit('setToken', false);
                            localStorage.removeItem('token');
                        }
                        this.$router.push('/');
                        return data;
                    });
            }
        }
    };
</script>
