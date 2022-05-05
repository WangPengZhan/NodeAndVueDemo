<template>
    <div class="home">
        <Button type="info">Info</Button>
        <Button type="success">Success</Button>
        <Button type="warning">Warning</Button>
        <Button type="error">Error</Button>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        components: {},
        data() {
            return {menu: []}
        },
        created: function () {
            this.$api.get('getFooter').then((res) => {
                this.menu = res.data
            })
        }
    }
</script>
