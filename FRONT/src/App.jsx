import { useState } from "react";
import axios from "axios";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';
import logo from './logo-smc.png';

function App() {
  const [texto, setTexto] = useState({
    certificado: 0,
    proforma: 0,
    documento: "",
    estado: "",
    emitido: "",
    ultimafecha: "",
    cliente: ""
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para mostrar el mensaje de éxito
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "emitido" || name === "ultimafecha") {
        const formattedDate = value ? moment(value).format('YYYY-MM-DD') : null;
        setTexto(prevState => ({
            ...prevState,
            [name]: formattedDate
        }));
    } else {
        setTexto(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('certificado', texto.certificado);
    formData.append('proforma', texto.proforma);
    formData.append('documento', texto.documento);
    formData.append('estado', texto.estado);
    formData.append('emitido', texto.emitido);
    formData.append('ultimafecha', texto.ultimafecha);
    formData.append('cliente', texto.cliente);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/agregar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFileName(response.data.file); // Guardar el nombre del archivo subido
      setShowSuccess(true); // Mostrar mensaje de éxito
      console.log('Datos guardados:', response.data);
      setTimeout(() => setShowSuccess(false), 3000); // Ocultar mensaje de éxito después de 3 segundos
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  };

  const handleNavigate = () => {
    navigate(`/display/${texto.certificado}`, { state: { data: texto, fileName } });
  };

  const handleGenerateQrCode = () => {
    const qrUrl = `${window.location.origin}/display/${texto.certificado}`;
    setQrCodeUrl(qrUrl);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo de la Empresa" className="logo" />
      </div>
      <h1 className="text-center mb-4">Ingresar Datos</h1>
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          Los datos han sido guardados con éxito.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label" htmlFor="certificado">Nro. Certificado</label>
            <input type="number" name="certificado" id="certificado" onChange={handleChange} className="form-control"/>
          </div>
          <div className="col">
            <label className="form-label" htmlFor="proforma">Nro. Proforma</label>
            <input type="number" name="proforma" id="proforma" onChange={handleChange} className="form-control"/>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="documento">Tipo Documento</label>
          <input type="text" name="documento" id="documento" onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="estado">Estado</label>
          <input type="text" name="estado" id="estado" onChange={handleChange} className="form-control" />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label" htmlFor="emitido">Emitido el:</label>
            <input type="date" name="emitido" id="emitido" onChange={handleChange} className="form-control" />
          </div>
          <div className="col">
            <label className="form-label" htmlFor="ultimafecha">Última Fecha</label>
            <input type="date" name="ultimafecha" id="ultimafecha" onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cliente">Cliente</label>
          <input type="text" name="cliente" id="cliente" onChange={handleChange} className="form-control"/>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="file">Seleccionar archivo</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} className="form-control" accept="application/pdf" />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mr-2">Agregar</button>
          <br />
          <br />
          <button type="button" onClick={handleNavigate} className="btn btn-primary mr-2">Siguiente</button>
          <br />
          <br />
          <button type="button" onClick={handleGenerateQrCode} className="btn btn-secondary">Generar Código QR</button>
        </div>
      </form>
      {qrCodeUrl && (
        <div className="text-center mt-3">
          <QRCodeCanvas value={qrCodeUrl} />
          <p>Escanea este código para ver los detalles</p>
        </div>
      )}
    </div>
  );
}

export default App;
