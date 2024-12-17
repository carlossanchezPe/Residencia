// Alumnos.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import './Alumnos.css';
import { useAuth } from '../context/authContext';

const Alumnos = ({ alumnos = [] }) => {
  const [filtro, setFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const alumnosPorPagina = 5;
  const [showModalNota, setShowModalNota] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const { role } = useAuth();
  const [filtroSemestre, setFiltroSemestre] = useState('');
  const [filtroIngreso, setFiltroIngreso] = useState('');
  

  const handlePageChange = ({ selected }) => {
    setPaginaActual(selected);
  };

  const exportarCSV = () => {
    const csv = Papa.unparse(alumnos);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'alumnos.csv');
  };

  const alumnosFiltrados = alumnos.filter((alumno) => {
    // Filtro por texto (nombre o matrícula)
    const cumpleTexto =
      !filtro ||
      alumno.matricula.toLowerCase().includes(filtro.toLowerCase()) ||
      alumno.nombre.toLowerCase().includes(filtro.toLowerCase());
  
    // Filtro por semestre
    const cumpleSemestre = !filtroSemestre || alumno.semestre.toString() === filtroSemestre;
  
    // Filtro por año de ingreso
    const cumpleIngreso = !filtroIngreso || alumno.ingreso.toString() === filtroIngreso;
  
    // Combinar todos los filtros
    return cumpleTexto && cumpleSemestre && cumpleIngreso;
  });
  
  
  
  
  
  
  const inicio = paginaActual * alumnosPorPagina;
  const alumnosPaginados = alumnosFiltrados.slice(inicio, inicio + alumnosPorPagina);

  const abrirModalNota = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setShowModalNota(true);
  };

  const abrirModalInfo = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setShowModalInfo(true);
  };

  return (
    <div className="alumnos-container">
      <h2>Lista de Alumnos</h2>

      <div className="filter-container mb-4">
  <h4>Filtros de Búsqueda</h4>

  {/* Filtro por Matrícula o Nombre */}
  <input
    type="text"
    placeholder="Buscar por matrícula o nombre"
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
    className="form-control mb-2"
  />

  {/* Filtro por Semestre */}
  <select
    onChange={(e) => setFiltroSemestre(e.target.value)}
    className="form-select mb-2"
  >
    <option value="">Filtrar por Semestre</option>
    {[...new Set(alumnos.map((alumno) => alumno.semestre))].map((semestre) => (
      <option key={semestre} value={semestre}>
        Semestre {semestre}
      </option>
    ))}
  </select>

  {/* Filtro por Año de Ingreso */}
  <select
    onChange={(e) => setFiltroIngreso(e.target.value)}
    className="form-select mb-2"
  >
    <option value="">Filtrar por Año de Ingreso</option>
    {[...new Set(alumnos.map((alumno) => alumno.ingreso))].map((anio) => (
      <option key={anio} value={anio}>
        Año {anio}
      </option>
    ))}
  </select>
</div>




      {role !== 'profesor' && (
        <button onClick={exportarCSV} className="btn btn-primary mb-3">
          Exportar a CSV
        </button>
      )}

<div className="table-responsive">
  {alumnosFiltrados.length > 0 ? (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Nombre</th>
          <th>Apellido Paterno</th>
          <th>Apellido Materno</th>
          <th>Año de Ingreso</th>
          <th>Semestre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {alumnosPaginados.map((alumno) => (
          <tr key={alumno.id}>
            <td>{alumno.matricula}</td>
            <td>
              <span
                onClick={() => abrirModalInfo(alumno)}
                className="info-link"
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                {alumno.nombre}
              </span>
            </td>
            <td>{alumno.apellidoP}</td>
            <td>{alumno.apellidoM}</td>
            <td>{alumno.ingreso}</td>
            <td>{alumno.semestre}</td>
            <td>
              <button onClick={() => abrirModalNota(alumno)} className="btn btn-info btn-sm">
                Ver Nota
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-center mt-4">No se encontraron alumnos con los filtros aplicados.</p>
  )}
</div>


      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={Math.ceil(alumnosFiltrados.length / alumnosPorPagina)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      {/* Modal para la nota */}
      <Modal show={showModalNota} onHide={() => setShowModalNota(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nota de {alumnoSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{alumnoSeleccionado?.nota || 'Sin nota disponible'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalNota(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para información detallada */}
      <Modal show={showModalInfo} onHide={() => setShowModalInfo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Información de {alumnoSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Matrícula:</strong> {alumnoSeleccionado?.matricula}</p>
          <p><strong>Semestre:</strong> {alumnoSeleccionado?.semestre}</p>
          <p><strong>Materias:</strong></p>
          <p><strong>Materias y Comentarios:</strong></p>
<ul>
  {alumnoSeleccionado?.materias?.length > 0 ? (
    alumnoSeleccionado.materias.map((materia, index) => (
      <li key={index}>
        <strong>{materia.nombre}</strong> - Créditos: {materia.creditos} <br />
        <em>Comentario:</em> {materia.nota || 'Sin comentario'}
      </li>
    ))
  ) : (
    <p>Sin materias asignadas.</p>
  )}
</ul>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalInfo(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Alumnos;
