<template>
    <div>
        <!--文章列表-->
        <div class="article-list">
            <row type="flex" justify="space-around" class="code-row-bg">
                <i-col span="24">
                    <article-list :list="list" :title="listTitle"></article-list>
                </i-col>
            </row>
        </div>
    </div>
</template>

<script>
    import ArticleList from '../components/ArticleList'

    export default {
        name: 'ArticleType',
        components: {
            ArticleList
        },
        data() {
            return {
                list: [],
                listTitle: ''
            }
        },
        created: function () {
            // console.log(this.$route)
            //传递是type
            if ('type' in this.$route.query) {
                let data = {type: this.$route.query.type}
                this.getData(data,'分类：'+ this.$route.query.type)
            }
            //传递是tag
            if ('tag' in this.$route.query) {
                let data = {tag: this.$route.query.tag}
                this.getData(data,'标签：'+ this.$route.query.tag)
            }

        },
        methods: {
            getData(data, title) {
                //获取分类下所有文章
                this.$api.post('getArticles', data).then((res) => {
                    let tData = []
                    res.data.map((item) => {
                        if (item.id !== 0) {
                            tData.push(item)
                        }
                    })
                    this.listTitle = title
                    this.list = tData
                })
            }
        }
    }
</script>