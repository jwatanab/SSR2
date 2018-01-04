## Document

***

### サーバサイド

- Controllerファイル
    - ここではDB Controllerをrequireしてルーティングおよびクライアントへのレスポンス処理を行っていた
    - /api/以降のクライアントからの問い合わせにあわせて適切なDB関数のパラメーターにクエリを食わせてデータの検索や挿入を行う
- Routing
    - ReactRouterDOMを利用するためExpress.Router()を使用すると自動的にルーティングが行われてしまう(Reactが使えない)
```js
        Router.get('/',(req,res)=>{console.log('ここでのレンダリングしか適応できない')})

        /**  SSRが本当に有効な手立てなのかは、取りあえず置いといてここではシンプルなappを利用してルーティングを行う  */

        const express = require('express')
        const app = express().listen(3000,()=>{console.log('listen to localhost:3000')})

        /*  サーバサイドでは情報の受け渡しのみ行う  */
        app.get('/api/???',(req,res)=>{
            /*  req.queryでフロントからの情報を受け取り外部ファイルに纏めた関数を利用して処理を行い、DB情報をresする  */
        })
```
- 注意点
    - ここでの注意点はrequireしたファイルの関数の情報を理解していなければならないこと
    - あわせて使用しているデータベースの使い方も把握して置かなければならないこと

### クライアント

- React-Router-DOM
    - `<a></a>`(./srcにファイルを置いてルーティング)は推移できるがコンポーネント毎のルーティング管理が煩雑になってしまう
    - Reactでのレンダリングを綺麗に書くにはReact-Router-DOMを利用する
```js
        <Link to='/hoge'></Link>//<a></a>と同位
        <Redirect to='/bar'></Redirect>//推移(HTML内に存在すると飛んでしまうため、あくまで挿入メイン)
        /*  ルーティングの書き方  */
        import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
        ReactDOM.render((
            <Router>
                <div>
                    <Switch>
                        <Route path='./bar' component={Bar} />
                        <Route path='./hoge' component={Hoge} />
                        <Route component={App} />
                    </Switch>
                </div>
            </Router>),
            document.querySelector('.root'))
        /*  推奨  */
        import { BrowserRouter as Route } from 'react-router-dom'
        ReactDOM.render((
            <BrowserRouter>
                <div>
                    <Route path='./bar' component={Bar} />
                    <Route path='./hoge' component={Hoge} />
                    <Route component={App} />
                </div>
            </BrowserRouter>
        ),document.querySelector('.root'))
```
- Ajax
    - 非同期通信にはsuperagentを利用する(デフォルトではWS)
    - get.post.put.delete.headなどの基本的なHTTP通信が行える
    - getでreq.queryに入れておけば、サーバでDBに読み書きできる(一応POSTも使える)
```js
        const request = require('superagent')

        const api = (command) => {
        request
            .get(`/api/${command}`)
            .query({
                userid: this.state.userid,
                passwd: this.state.passwd
            })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    return
                }
                const r = res.body
                if (r.status && r.token) {
                    window.localStorage['sns_id'] = this.state.userid
                    window.localStorage['sns_auth_token'] = r.token
                    this.setState({ jump: '/timeline' })
                    return
                }
                this.setState({ msg: r.msg })
            })
        }
```
### データベース

- 今回使用したのはNeDB(jsonテキストをdbファイルに保存できる)
- クライアントから来た情報をNeDBに保存、そのための関数を纏めたものをserveディレクトリに保存
- データベースの接続と外部ファイルに公開する関数を作成、公開
```js
    /*  User,Timelineデータベースに接続  */

    const path = require('path')
    const nedb = require('nedb')

    const userDB = new nedb({
        filename: path.join(__dirname, 'users.db'),
        autoload: true
    })
    const timelineDB = new nedb({
        filename: path.join(__dirname, 'line.db'),
        autoload: true
    })

    /*  処理関数  */

    function getHash (pass) {}

    function addUser (user,pass) {}

    function getUser (user,pass) {}

    function login (user,hash) {}

    /*  データベース操作インスタンスおよび処理関数を外部に公開  */
    
    module.exports = {
        userDB, timelineDB, getUser, addUser, login
    }

    /**
     * 外部ファイルではrequire('./db.js'),module.exportsしたものrequireインスタンスの
     * メソッドとして扱うことで関数や該当データベースを外部に公開できる
    */

    const db = require('./db')
    app.get('/ai/getItem',(req,res)=>{
        db.getUser(req,param)
    })
```