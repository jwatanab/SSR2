import React, { Component } from 'react'
import request from 'superagent'

export default class Line extends Component {
    constructor(props) {
        super(props)
        this.state = { timelines: [], comment: '' }
    }
    componentWillMount() {
        this.loadTimelines()
    }
    loadTimelines() {
        request
            .get('/api/get_friends_timeline')
            .query({
                userid: window.localStorage.sns_id,
                token: window.localStorage.sns_auth_token
            })
            .end((err, res) => {
                if (err) return
                this.setState({ timelines: res.body.timelines })
            })
    }
    post() {
        request
            .get('/api/add_timeline')
            .query({
                userid: window.localStorage.sns_id,
                token: window.localStorage.sns_auth_token,
                comment: this.state.comment
            })
            .end((err, res) => {
                if (err) return
                this.setState({ comment: '' })
                this.loadTimelines()
            })
    }
    render() {
        const timelines = this.state.timelines.map(e => {
            return (
                <div key={e._id}>
                    <img src={'user.png'} />
                    <div>{e.userid}:</div>
                    <div>{e.comment}</div>
                    <p style={{ clear: 'both' }}></p>
                </div>
            )
        })
        return (
            <div>
                <h1>タイムライン</h1>
                <div>
                    <input value={this.state.comment} size={40} onChange={e => this.setState({ comment: e.target.value })} />
                    <button onClick={e => this.post()}>書き込む</button>
                </div>
                <div>{timelines}</div>
                <hr />
                <p><a href={'/users'}>友達を追加する</a></p>
                <p><a href={'/login'}>別のユーザ^でログイン</a></p>
            </div>
        )
    }
}