import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Header,
  Main,
  Aside,
  Container,
  Menu,
  MenuItemGroup,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  Switch,
  TableColumn,
  Pagination,
  MenuItem } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.prototype.$message = Message
