<template>
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" v-model="username" name="username" class="form-control"
                       :class="{ 'is-invalid': !username }"/>
                <div v-show="!username" class="invalid-feedback">Username is required</div>
            </div>
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" v-model="password" name="password" class="form-control"
                       :class="{ 'is-invalid': !password }"/>
                <div v-show="!password" class="invalid-feedback">Password is required</div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="blocked">Login</button>
                <img v-show="blocked"
                     src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
                blocked: false
            }
        },
        created() {
            if(this.$store.state.user.token)
                this.$router.push('/');
        },
        methods: {
            handleLogin(e) {
                const {username, password} = this;
                if (username && password) {
                    this.login(username, password);
                }
            },

            login(username, password) {
                this.blocked = true;
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);

                const requestOptions = {
                    method: 'POST',
                    body: formData
                };

                return fetch(`${this.$config.api.url}/login`, requestOptions)
                    .then(response => {
                        if (!response.ok)
                            return Promise.reject(response.statusText);

                        return response.json();
                    })
                    .then(data => {
                        if (data.token) {
                            this.$store.commit('setToken', data.token);
                        }
                        this.blocked = false;
                        this.$router.push('/');
                        return data;
                    });
            }
        }
    };
</script>
