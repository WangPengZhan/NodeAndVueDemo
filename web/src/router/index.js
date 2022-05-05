import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index'
import Articles from '../views/Articles'
import Article from '../views/Article'
import ArticleType from '../views/ArticleType'
import Login from '../views/Login'
import Register from '../views/Register'
import UserInfo from '../views/UserInfo'
import Mail from '../views/Mail'
import Mails from '../views/Mails'
import Collection from '../views/Collection'
import Admin from '../views/admin/Admin'
import WriterArticle from '../views/admin/WriterArticle'
import AdminArticles from '../views/admin/AdminArticles'
import AdminUsers from '../views/admin/AdminUsers'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/articles',
        name: 'Articles',
        component: Articles
    },
    {
        path: '/article/:id',
        name: 'Article',
        component: Article
    },
    {
        path: '/ArticleType',
        name: 'ArticleType',
        component: ArticleType
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/userInfo/:username',
        name: 'UserInfo',
        component: UserInfo
    },
    {
        path: '/mail',
        name: 'Mails',
        component: Mails
    },
    {
        path: '/mailGetter/:id',
        name: 'Mail',
        component: Mail
    },
    {
        path: '/collection',
        name: 'Collection',
        component: Collection
    },
    {
        path: '/admin', component: Admin,
        children: [
            {
                // 当 /admin 匹配成功再进行匹配，
                path: 'article',
                component: WriterArticle
            },
            {
                // 当 /admin 匹配成功再进行匹配，
                path: 'articles',
                component: AdminArticles
            },
            {
                // 当 /admin 匹配成功再进行匹配，
                path: 'users',
                component: AdminUsers
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 导出
export default router
