import React, { Component } from "react";
import Global from "../../Global/Global";
import axios from "axios";
import './Playlist.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen, faHeart } from '@fortawesome/free-solid-svg-icons'
import Header from "../header/Header";
import { Navigate } from "react-router-dom";


export default class Playlists extends Component {

  // searchParams = new URLSearchParams(window.location.search);
  // access_token = this.searchParams.get("access_token");

  access_token = localStorage.getItem('access_token');
  nombreUsuario = localStorage.getItem('user_id');

  

  state = {
    playlists: [],
    playlistsPublicas: [],
    playlistsPrivadas: [],
    playlistsSeguidas: [],
    statusPlay: false,
    statusLoading: false,
    total: 0,
    songs: [],
    songsText: [],
    statusSong: false,
    imgP: "",
    nombreP: ""
  }

  headers = {
    headers: {
      "Authorization": "Bearer " + this.access_token
    }
  }

  componentDidMount = () => {
    
    // console.log("en playlist: "+Global.access_token)
    this.getListas()
    
  }
  
  offsetPlaylist = 0;
  getListas = () => {
    axios.get("https://api.spotify.com/v1/me/playlists?limit=" + Global.playlistLimit + "&offset=" + this.offsetPlaylist + "", this.headers).then(response => {
      const datos = response.data
      // console.log(datos);
      var totalListas = (datos.total)
      // BUCLE
      if (this.offsetPlaylist < totalListas) {

        for (var i = 0; i < datos.items.length; i++) {
          this.state.playlists.push(datos.items[i])
          if (datos.items[i].public === true) {
            this.state.playlistsPublicas.push(datos.items[i])
          }
          if (datos.items[i].public === false && datos.items[i].owner.display_name === this.nombreUsuario){
            this.state.playlistsPrivadas.push(datos.items[i])
          }
          if (datos.items[i].owner.display_name !== this.nombreUsuario){
            this.state.playlistsSeguidas.push(datos.items[i])
          }
        }
        this.offsetPlaylist += Global.playlistLimit;
        this.getListas()

      }
      else {
        this.setState({
          playlists: this.state.playlists,
          playlistsPrivadas: this.state.playlistsPrivadas,
          playlistsPublicas: this.state.playlistsPublicas,
          playlistsSeguidas: this.state.playlistsSeguidas,
          statusPlay: true,
          totalListas: totalListas,
        })
      }
    })
  }




  offsetSongs = 0;
  auxSongs = [];
  getCanciones = (playlist) => {
    const id = playlist.id
    const total = playlist.tracks.total

    this.setState({
      statusSong:false,
      statusLoading: true,
    })

    if (total !== 0) {


      this.setState({
        imgP: playlist.images[0].url,
        nombreP: playlist.name
      })

      axios.get("https://api.spotify.com/v1/playlists/" + id + "/tracks?limit=" + Global.songLimit + "&offset=" + this.offsetSongs + "", this.headers).then(response => {
        // console.log(total);



        if (this.offsetSongs < total) {
          const datos = response.data
          // console.log(datos);
          for (var i = 0; i < datos.items.length; i++) {

            var artists = "";
            if (datos.items[i].track.artists.length === 1) {
              artists = datos.items[i].track.artists[0].name
            } else {
              for (var s = 0; s < datos.items[i].track.artists.length; s++) {
                if (s > 0) {
                  artists += ", " + datos.items[i].track.artists[s].name;
                }
                artists += datos.items[i].track.artists[s].name;
              }
            }

            var album = datos.items[i].track.album.name

            var duration = datos.items[i].track.duration_ms;
            var min = Math.floor((duration / 1000 / 60) << 0);
            var sec = Math.floor((duration / 1000) % 60);

            if (sec.toString().length === 1) {
              sec = "0" + sec;
            }

            this.auxSongs.push(
              <tr key={datos.items[i].track.id + i}>
                <td className="numeroCancion">{i + 1}</td>
                <td className="nombreCancion"><a href={datos.items[i].track.album.images[0].url} target="blank" ><img className="imagenCancion" alt="" src={datos.items[i].track.album.images[0].url} /></a><span className="nombreEspecial">{datos.items[i].track.name}</span></td>
                <td className="artistaCancion"><span>{artists}</span></td>
                <td className="albumCancion"><span>{album}</span></td>
                <td className="duracionCancion">{min}:{sec}</td>
              </tr>
            )
          }


          this.offsetSongs += Global.songLimit;
          this.getCanciones(playlist)


        } else {
          //ACABA DE AÑADIR TODAS LAS CANCIONES
          this.offsetSongs = 0;
          this.contCanciones = 0;

          this.setState({
            songs: this.auxSongs,
            songsText: this.auxSongs,
            statusSong: true,
            statusLoading: false,
          })
          this.auxSongs = [];
        }

      })
    }

  }


  // *RENDER
  render() {

    if(this.access_token === null){
      return(<Navigate to="/" />)
    }


    return (
      <div>
        <Header seleccion="playlists" />
        <div className="general">
          <div className="playlists row mx-lg-5 mx-3">
            <div className="datosPlaylist col-sm-12 col-md-3 col-lg-3 p-0">
              <div className="totalPlaylists">
                <h1 className="numeroListas">PLAYLISTS: {this.state.totalListas}</h1>
              </div>
              <div className="listas">
                <details>
                  <summary><FontAwesomeIcon icon={faLockOpen} className="mx-2 icon" />Publicas</summary>
                  {/* CREACION DE BOTONES */}
                  {
                    this.state.playlistsPublicas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "")?
                            ("Sin Nombre"):
                            (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
                <details>
                  <summary><FontAwesomeIcon icon={faLock} className="mx-2 icon" />Privadas</summary>
                  {
                    this.state.playlistsPrivadas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "")?
                            ("Sin Nombre"):
                            (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
                <details>
                  <summary><FontAwesomeIcon icon={faHeart} className="mx-2 icon" />Seguidas</summary>
                  {
                    this.state.playlistsSeguidas.map((playlist, index) => {
                      return (
                        <button key={playlist.id + index} data-plistid={playlist.id} onClick={() => this.getCanciones(playlist)} className="btnPlist">
                          {
                            (playlist.name === "")?
                            ("Sin Nombre"):
                            (playlist.name)
                          }
                        </button>
                      )
                    })
                  }
                </details>
              </div>
            </div>
        
            {
              (this.state.statusSong === true) ?
                (
                  <div className="canciones p-0 col-sm-12 col-md-9 col-lg-9">
                    <div className="infoLista">
                      <img className="imgLista" src={this.state.imgP} alt=""></img>
                      <h3 className="nombrePlaylist">{this.state.nombreP}</h3>
                    </div>
                    <div className="divTablaCanciones">
                      <table className="tablaCanciones">
                        <thead>
                          <tr>
                            <th className="col-xs-1 numeroCancion">#</th>
                            <th className="col-xs-4 nombreCancion ">NOMBRE</th>
                            <th className="col-xs-3 artistaCancion ">ARTISTA</th>
                            <th className="col-xs-2 albumCancion ">ALBUM</th>
                            <th className="col-xs-1 duracionCancion">DURACION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.songsText}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) :
                (this.state.statusLoading === true) ?
                  (
                    <div className="canciones col-sm-12 col-md-9 col-lg-9">
                      <div className="load">
                        <h1>CARGANDO...</h1>
                        <div className="mx-auto carga"></div>
                      </div>
                    </div>
                  ) :
                  (
                    <div className="canciones p-0 col-sm-12 col-md-9 col-lg-9">
                      <div className="noSongs">
                        <h1>NO HAS SELECIONADO UNA PLAYLIST</h1>
                      </div>
                    </div>
                  )
            }
        
          </div>
        </div>
      </div>
    );
  }
}
