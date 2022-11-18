import axios from 'axios'
import React, { Component } from 'react'
import './Estadisticas.css'
import Header from '../header/Header'

export default class Estadisticas extends Component {
    access_token = localStorage.getItem('access_token');

    state = {
        estadisticasCanciones: [],
        statusCanciones: false,
        estadisticasArtistas: [],
        statusArtistas: false,
    }

    headers = {
        headers: {
            "Authorization": "Bearer " + this.access_token
        }
    }



    componentDidMount = () => {
        this.cargarEstadisticas()
    }

    cargarEstadisticas = () => {

        axios.get("https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=short_term", this.headers).then(re => {
            const datos = re.data
            console.log(datos);

            this.setState({
                estadisticasCanciones: datos,
                statusCanciones: true,
            })
        })
    }

    render() {
        return (
            <div>
                <Header seleccion="estadisticas" />
                <div className="general">
                    <div className='mx-lg-5 mx-3 generalEstadisticas' >
                        <div className="row mx-lg-5 mx-3">
                            <table className="barraG">
                                <tbody>
                                    <tr>
                                        <td className="opc1 opcI" >Canciones</td>
                                        <td className="opc1 opcD" >Artistas</td>
                                    </tr>
                                </tbody>
                            </table>
                            <ul className="barra2">
                                <li className="opcion2 contenidoOpciones">
                                    <p>Ultimo Mes</p>
                                </li>
                                <li className="opcion2 contenidoOpciones">
                                    <p>Ultimos 6 Meses</p>
                                </li>
                                <li className="opcion2 contenidoOpciones">
                                    <p>Siempre</p>
                                </li>
                            </ul>
                        </div>
                        <div className="contenido">
                            <table className="tablaDatos" border="4">
                                <thead>
                                    <tr>
                                        <th className="thPequeño">
                                            <p>#</p>
                                        </th>
                                        <th>
                                            <p className="thNombre">Nombre</p>
                                        </th>
                                        <th className="thPequeño">
                                            <p>Duracion</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    (this.state.statusCanciones === true) &&
                                    (
                                        this.state.estadisticasCanciones.items.map((c,i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="tdPequeño">
                                                        <p>{i+1}</p>
                                                    </td>

                                                    <td>
                                                        <div className="divNombre">
                                                            <img src="../../assets/images/test.png" alt="" className="imgCancion" />
                                                            <p className="nombreCancion">{c.name}</p>
                                                            <p className="nombreArtista">Artistas</p>
                                                        </div>
                                                    </td>
                                                    <td className="tdPequeño">
                                                        <p>546</p>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
