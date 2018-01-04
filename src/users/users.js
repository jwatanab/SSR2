import React, { Component } from 'react'
import request from 'superagent'
import { Redirect } from 'react-router-dom'

export default class Users extends Component {
    constructor(props) {
        super(props)
        this.state = { users: [], jump: '', friends: [] }
    }
    componentWillMount() {
        this.loadUsers()
    }
    loadUsers() {
        request.get('/api/get_allusers')
            .end((err, res) => {
                if (err) return
                this.setState({ users: res.body.users })
            })
        request.get('/api/get_user')
            .query({ userid: window.localStorage.sns_id })
            .end((err, res) => {
                if (err) return
                this.setState({ friends: res.body.friends })
            })
    }
    addFriends(friendsid) {
        if (!window.localStorage.sns_auth_token) {
            window.alert('ログインしてください')
            this.setState({ jump: '/login' })
            return
        }
        request
            .get('/api/add_friend')
            .query({
                userid: window.localStorage.sns_id,
                token: window.localStorage.sns_auth_token,
                friendid: friendid
            })
            .end((err, res) => {
                if (err) return
                if (!res.body.status) {
                    window.alert(res.body.msg)
                    return
                }
                this.loadUsers()
            })
    }
    render() {
        if (this.state.jump) {
            return (<Redirect to={this.state.jump} />)
        }
        const friends = this.state.friends ? this.state.friends : {}
        const ulist = this.state.users.map(id => {
            const btn = (friends[id])
                ? `${id}は友達です`
                : (<button onClick={e => this.addFriends(id)}>{id}を友達に追加</button>)
            return (<div key={`fid_${id}`}><img src={'user.png'} width={80} />{btn}</div>)
        })
        return (
            <div>
                <h1>ユーザー一覧</h1>
                <div>{ulist}</div>
                <div><br /><a href={'/timeline'}>->タイムラインを見る</a></div>
            </div>
        )
    }
}