<template>
    <div>
        <h3 style="text-align: left">评论</h3>
        <i-input v-model="data" type="textarea" :rows="4" placeholder="请输入..."></i-input>
        <br> <br>
        <Button v-on:click="submitTalk">提交</Button>
    </div>
</template>

<script>
    export default {
        name: "Talk",
        data() {
            return {
                data: ''
            }
        },
        methods: {
            //提交评论
            submitTalk() {
                let data = {
                    a_id: this.a_id,
                    talk: this.data
                }
                this.$api.post('users/user/article/talk', data).then((res) => {
                    if (res.code === 0) {
                        //调用父组件方法
                        this.$parent.getArticleTalk(this.a_id)
                    } else {
                        this.$Notice.open({
                            title: '错误',
                            desc: res.message,
                            duration: 5
                        });
                    }
                })
            }
        },
        props: {
            a_id: Number
        }
    }
</script>