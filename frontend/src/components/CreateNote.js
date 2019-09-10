import React, { Component } from 'react'
import axios from 'axios'
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class CreateNote extends Component {

    state= {
        users: [],
        userSelected: '',
        title: '',
        description: '',
        date: new Date(),
        editing: false,
        _noteId: ''
    }

    async componentDidMount() {
        console.log(this.props.match.params)
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        })
        if (this.props.match.params.id){
            const res = await axios.get('http://localhost:4000/api/notes/' + this.props.match.params.id);
            console.log(res.data)
            this.setState({
                title: res.data.title,
                description: res.data.description,
                date: new Date(res.data.date),
                userSelected: res.data.author,
                editing: true,
                _noteId: this.props.match.params.id
            })
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: this.state.title,
            description: this.state.description,
            date: this.state.date,
            author: this.state.userSelected
        }

        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/notes/' + this.state._noteId, newNote);
        } else{
            await axios.post('http://localhost:4000/api/notes', newNote);
        }
        window.location.href = '/';
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = date => {
        this.setState({date});
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create Note</h4>

                    {/** SELECT USER */}
                    <div className="form-group">
                        <select
                            className="form-control"
                            name="userSelected"
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                        >
                            {
                                this.state.users.map(user =>
                                <option key={user} value={user}>
                                    {user}
                                </option>)
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Title"
                            onChange={this.onInputChange}
                            value={this.state.title} 
                            name="title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            name="description"
                            className="form-control"
                            placeholder="description"
                            onChange={this.onInputChange}
                            value={this.state.description}
                            required
                            >

                            </textarea>
                    </div>

                    <div className="form-group">
                        <Datepicker
                            className="form-control"
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>

                    <form onSubmit={this.onSubmit}>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
