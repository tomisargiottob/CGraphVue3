<template>
    <div>
        <h1>Hi {{account.user.firstName}}!</h1>
        <p>Welcome to coinGraph</p>
        <h3>HOME PAGE</h3>
        <em v-if="account.loading">Loading user information...</em>
        <span v-if="account.error" class="text-danger">ERROR: {{account.error}}</span>
         <apexchart
            width="500"
            type="pie"
            :options="labels"
            :series="wallet.data || []"
            ></apexchart>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
import VueApexCharts from "vue3-apexcharts";

export default {
    components: {
        apexchart: VueApexCharts,
    },
    data: function() {
        return {
            chartOptions: {
                labels: ["Blue", "Green", "Yellow", "Red"]
            },
            series: [11, 32, 45, 32]
        };
    },
    computed: {
        ...mapState({
            account: state => state.account,
            wallet: state => state.users.currentWallet
        }),
        labels() {
            return ({ labels: this.wallet.labels || []})
        }
    },
    created () {
        this.getWallet({ id: this.account.user.id, from: Date.now(), to: Date.now()-1000*60*60*24*5 })
    },
    methods: {
        ...mapActions('users', ['getWallet']),
    }
};
</script>