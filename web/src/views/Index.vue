<template>
    <div>
        <!--轮播图-->
        <Carousel v-model="value2" loop>
            <CarouselItem :key="item.title" v-for="item in pic">
                <div class="demo-carousel">
                    <router-link :to="item.src">
                        <img :src="item.img"/>
                        <div>
                            {{item.title}}
                        </div>
                    </router-link>
                </div>
            </CarouselItem>
        </Carousel>
        <!--文章列表-->
        <div class="article-list">
            <row type="flex" justify="space-around" class="code-row-bg">
                <i-col span="11">
                    <article-list :list="list" :title="listTitle"></article-list>
                </i-col>
                <i-col span="11">
                    <article-list :list="hotList" :title="hotListTitle"></article-list>
                </i-col>
            </row>
        </div>
    </div>
</template>

<script>
    import ArticleList from '../components/ArticleList'

    export default {
        name: 'Home',
        components: {
            ArticleList
        },
        data() {
            return {
                value2: 0,
                pic: [],
                list: [],
                listTitle: '最新文章',
                hotList: [],
                hotListTitle: "最热文章"
            }
        },
        created: function () {
            //获取主页轮播图
            this.$api.get('getIndexPic').then((res) => {
                console.log(res.data)
                this.pic = res.data
            })
            //获取所有文章
            this.$api.get('getNewArticle').then((res) => {
                let rData = res.data.slice(0, 5)
                let tData = []
                rData.map((item) => {
                    if (item.id !== 0) {
                        tData.push(item)
                    }
                })
                this.list = tData
            })
            //获得热点文章
            this.$api.get('getHotArticle').then((res) => {
                let rData = res.data.slice(0, 5)
                let tData = []
                rData.map((item) => {
                    if (item.id !== 0) {
                        tData.push(item)
                    }
                })
                this.hotList = tData
            })
        }
    }
</script>
<style>
    .demo-carousel {
        width: 98vw;
        height: 30vw;
    }

    .demo-carousel img {
        width: 100%;
        position: relative;
    }

    .demo-carousel div {
        padding: 30px;
        background: RGBA(0, 0, 0, 0.5);
        position: absolute;
        z-index: 1;
        color: white;
        font-size: 60px;
        width: 70%;
        top: 10vw;
        text-align: center;
        margin-left: 15%;
    }
    .article-list{
        padding: 20px 0 20px 0;
    }
</style>