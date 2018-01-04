import React, { Component } from 'react'
import request from 'superagent'
import { Redirect } from 'react-router-dom'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { userid: '', passwd: '', jump: '', msg: '' }
    }
    api(command) {
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
                    console.log(r.status && r.token)
                    this.setState({ jump: '/timeline' })
                    return
                }
                this.setState({ msg: r.msg })
            })
    }
    render() {
        if (this.state.jump) {
            return <Redirect to={this.state.jump} />
        }
        const changed = (name, e) => this.setState({ [name]: e.target.value })
        return (
            <div>
                <h1>ログイン</h1>
                <div>ユーザID:<br />
                    <input value={this.state.userid} onChange={e => changed('userid', e)} /><br />
                    パスワード:<br />
                    <input type='password' value={this.state.passwd} onChange={e => changed('passwd', e)} /><br />
                    <button onClick={e => this.api('login')}>ログイン</button><br />
                    <p><button onClick={e => this.api('adduser')}>ユーザー登録</button></p>
                </div>
            </div>
        )
    }
}