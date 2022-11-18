import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './login/Login'
import Playlists from './playlists/Playlists'


export default class Router extends Component {

  render() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/playlists' element={<Playlists />} />

            <Route path='/*' element={<Login />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
