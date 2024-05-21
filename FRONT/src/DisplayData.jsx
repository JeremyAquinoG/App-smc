import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import './App.css';
import logo from './logo-smc.png'; // Importa el logo

function DisplayData() {
  const [estadoUser, setEstadoUser] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const location = useLocation();
  const { nroCertificado } = useParams();
  const data = location.state ? location.state.data : null;
  const fileName = location.state ? location.state.fileName : null;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (data) {
      console.log('Data from state:', data); // Debug
      setEstadoUser([data]);
      if (fileName) {
        const constructedFileUrl = `http://localhost:3000/uploads/${fileName}`;
        setFileUrl(constructedFileUrl);
        console.log('File URL:', constructedFileUrl); // Debug
      }
    } else {
      const obtenerDatos = async () => {
        try {
          let datos = await axios.get(`http://localhost:3000/api/certificado/${nroCertificado}`);
          if (datos.data) {
            console.log('Data from API:', datos.data); // Debug
            setEstadoUser([datos.data]);
            if (datos.data.file) {
              const constructedFileUrl = `http://localhost:3000/uploads/${datos.data.file}`;
              setFileUrl(constructedFileUrl);
              console.log('File URL:', constructedFileUrl); // Debug
            }
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      obtenerDatos();
    }
  }, [data, fileName, nroCertificado]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo de la Empresa" className="logo" />
      </div>
      <h1 className="text-center">Detalles Del Registro</h1>
      <div className="row">
        <div className="col-md-4" id="details">
          {estadoUser.length > 0 ? estadoUser.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <p className="card-text"><strong>Nro. Certificado:</strong> {item.certificado}</p>
                <p className="card-text"><strong>Nro. Proforma:</strong> {item.proforma}</p>
                <p className="card-text"><strong>Tipo de Documento:</strong> {item.documento}</p>
                <p className="card-text"><strong>Estado:</strong> {item.estado}</p>
                <p className="card-text"><strong>Emitido el:</strong> {item.emitido}</p>
                <p className="card-text"><strong>Ultima Fecha:</strong> {item.ultimafecha}</p>
                <p className="card-text"><strong>Cliente:</strong> {item.cliente}</p>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary mr-2">Editar</button>
              </div>
            </div>
          )) : <h1 className="text-center">Cargando datos...</h1>}
        </div>
        <div className="col-md-8" id="pdf-preview">
          {fileUrl && (
            <div>
              <h1>Vista previa del PDF</h1>
              <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js`}>
                <div style={{ height: '750px', border: '1px solid #000', overflow: 'auto' }}>
                  <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                </div>
              </Worker>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
