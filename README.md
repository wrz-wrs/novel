# Novel

## Novel是什么?
为一个小说阅读软件提供api的server代码

* 安卓app正在开发[安卓客户端](https://github.com/clyj/DriverBook)`慢`，欢迎大家去肛他
    * github:[@clyj](https://github.com/clyj)
    * 邮件:不知道
* 后台服务开发`也慢`,去肛↑emmm
    * 邮件:这辈子都不会有的

## API
* 需要Token
    * /api/user/info
    * /api/user/update
    * /api/user/history
    * /api/novel/create
    * /api/novel/tags 为小说添加tag
    * searchTag

* 不需要Token
    * /api/user/create
    * /api/user/login
    * /api/novel/search
    * /api/novel/read
    * /api/novel/info
    * /api/novel/list

## User API详细
* /api/user/create @params un&ps
    * un用户名，ps密码这两参数`必须`
    * example:/api/user/create?un=user1&ps=123456

* /api/novel/info @params uid||name
    * uid(用户id)或者name(用户名)`必须一个`
    * example:/api/novel/info?uid=1

* /api/user/update @params uid&sex&info&ps
    * uid用户id`必须`
    * info和sex`保持不更改需要`从/api/user/info中获取，默认sex='♂♀'&info='',ps选填可用于更改密码
    * example:/api/user/update?id=1&info=2333&sex=♂

* /api/user/login @params name&ps
    * 必填参数
    * example:/api/user/login?name=eltoo&ps=123456

## Novel API
novel处理比较特殊，爬虫不会主动去爬取资源，需要用户先search后调用create_Api才能在服务器中生成某本小说的详情

* /api/novel/search @params an
    * na小说名`必须`
    * example:/api/novel/search?an=放开那个女巫

* /api/novel/create @params an&cover&index&type&author
    * must_params: an(书名),cover(封面),index(章节列表页地址),type(类型),author(作者)
    * 从/api/novel/search获得
    * example:/api/novel/create?an=放开那个女巫&cover=...&index=...&type=...&author=...

* /api/novel/info @params an
    * must_params: an(书名)
    * example:/api/novel/info?an=放开那个女巫

* /api/novel/list @params type&limit&offset
    * must_params: type(类型)
    * default:limit=10, offset=0(没有此参数服务器默认值)
    * example:/api/novel/list?type=魔法&limit=10&offset=0

* /api/novel/read @params an&cno
    * must_params: an(书名),cno(章节)
    * example:/api/novel/read?an=放开那个女巫&cno=1

## 有问题反馈
* 安卓问题：[@clyj](https://github.com/clyj)
* 服务：[@me](https://github.com/zimulili)

## 捐助开发者
`服务器`也要`成本`,支持下服务器吧。
在兴趣的驱动下,写一个`免费`的东西，有欣喜，也还有汗水，希望你喜欢我的作品，同时也能支持一下。
当然，有钱捧个钱场（右上角的爱心标志，支持支付宝和PayPal捐助），没钱捧个人场，谢谢各位。

## 感激
感谢党，感谢国家
