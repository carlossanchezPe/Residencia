// Registros.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Registros.css';

const Registros = ({ registros = [], agregarRegistro, actualizarRegistro, actualizarTodosLosRegistros}) => {
  const materiasPorSemestre = {
    1: [
      { nombre: "CALCULO DIFERENCIAL", creditos: 5 },
      { nombre: "FUNDAMENTOS DE PROGRAMACION", creditos: 5 },
      { nombre: "ALGEBRA LINEAL", creditos: 5 },
      { nombre: "MATEMATICAS DISCRETAS", creditos: 5 },
      { nombre: "TALLER DE ADMINISTRACION", creditos: 4 },
    ],
    2: [
      { nombre: "CALCULO INTEGRAL", creditos: 5 },
      { nombre: "PROGRAMACION ORIENTADA A OBJETOS", creditos: 5 },
      { nombre: "QUIMICA", creditos: 5 },
      { nombre: "FISICA GENERAL", creditos: 5 },
      { nombre: "CULTURA EMPRESARIAL", creditos: 4 },
    ],
    3: [
      { nombre: "CALCULO VECTORIAL", creditos: 5 },
      { nombre: "ESTRUCTURA DE DATOS", creditos: 5 },
      { nombre: "ECOLOGIA", creditos: 4 },
      { nombre: "ALGEBRA ABSTRACTA", creditos: 4 },
      { nombre: "SISTEMAS OPERATIVOS", creditos: 5 },
    ],
    // Agregar más semestres según sea necesario
  };

  const [nuevoRegistro, setNuevoRegistro] = useState({
    matricula: '',
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    ingreso: '',
    estatus: 'PENDIENTE',
    nota: '', // Nota general agregada en Datos Personales
    semestre: 1,
    materias: [],
  });

  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estatusFiltro, setEstatusFiltro] = useState('');
  const [editando, setEditando] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({ ...nuevoRegistro, [name]: value });
  };

  const handleSemestreChange = (e) => {
    const semestre = parseInt(e.target.value, 10);
    setNuevoRegistro({ ...nuevoRegistro, semestre: semestre });

    if (semestre === 1) {
      setMateriasSeleccionadas(materiasPorSemestre[1].map((materia) => ({ ...materia, nota: '' })));
    } else {
      setMateriasDisponibles(materiasPorSemestre[semestre] || []);
      setMateriasSeleccionadas([]);
    }
  };

  const agregarMateria = (materia) => {
    if (!materiasSeleccionadas.some((m) => m.nombre === materia.nombre)) {
      setMateriasSeleccionadas([...materiasSeleccionadas, { ...materia, nota: '' }]);
    }
  };

  const eliminarMateria = (materia) => {
    setMateriasSeleccionadas(materiasSeleccionadas.filter((m) => m.nombre !== materia.nombre));
  };

  const handleNotaChange = (index, nota) => {
    const materiasActualizadas = materiasSeleccionadas.map((materia, i) =>
      i === index ? { ...materia, nota } : materia
    );
    setMateriasSeleccionadas(materiasActualizadas);
  };
  
 
  
const agregarNuevoRegistro = () => {
  const registroConMaterias = {
    ...nuevoRegistro,
    materias: materiasSeleccionadas.map((materia) => ({
      nombre: materia.nombre,
      creditos: materia.creditos,
      nota: materia.nota || 'Sin comentario', // Guardamos la nota de texto
    })),
  };

  agregarRegistro(registroConMaterias);
  setNuevoRegistro({
    matricula: '',
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    ingreso: '',
    estatus: 'PENDIENTE',
    nota: '',
    semestre: 1,
    materias: [],
  });
  setMateriasSeleccionadas([]);
  Swal.fire('Registro agregado', 'El registro se ha agregado exitosamente.', 'success');
  
};

const confirmarRegistro = () => {
  // Validación de campos obligatorios
  if (!nuevoRegistro.matricula.trim() || !nuevoRegistro.nombre.trim() || !nuevoRegistro.semestre) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor completa todos los campos obligatorios.',
    });
    return;
  }

  // Modal de confirmación
  Swal.fire({
    title: 'Confirmar Registro',
    html: `
      <h4>Datos del Alumno</h4>
      <p><strong>Matrícula:</strong> ${nuevoRegistro.matricula}</p>
      <p><strong>Nombre:</strong> ${nuevoRegistro.nombre} ${nuevoRegistro.apellidoP} ${nuevoRegistro.apellidoM}</p>
      <p><strong>Semestre:</strong> ${nuevoRegistro.semestre}</p>
      <h4>Materias Seleccionadas</h4>
      <ul>
        ${materiasSeleccionadas.map((m) => `<li>${m.nombre} - Nota: ${m.nota || 'Sin comentario'}</li>`).join('')}
      </ul>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Guardar Registro',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      agregarNuevoRegistro();
    }
  });
};



  const editarRegistro = (registro) => {
    setNuevoRegistro(registro);
    setMateriasSeleccionadas(registro.materias);
    setEditando(registro.id);
  };

  const guardarEdicion = () => {
    const registroEditado = {
      ...nuevoRegistro,
      materias: materiasSeleccionadas,
    };
    actualizarRegistro(editando, registroEditado);
    setNuevoRegistro({
      matricula: '',
      nombre: '',
      apellidoP: '',
      apellidoM: '',
      ingreso: '',
      estatus: 'PENDIENTE',
      nota: '',
      semestre: 1,
      materias: [],
    });
    setMateriasSeleccionadas([]);
    setEditando(null);
    Swal.fire('Registro actualizado', 'Los cambios se han guardado exitosamente.', 'success');
  };

  const eliminarRegistro = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Filtrar los registros para eliminar el seleccionado
        const registrosActualizados = registros.filter((registro) => registro.id !== id);
        
        // Actualizar el estado o prop con los registros nuevos
        actualizarRegistro(registrosActualizados);
  
        // Mostrar mensaje de éxito
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
      }
    });
  };
  

  const registrosFiltrados = (registros || []).filter((registro) => {
    const cumpleFiltro =
      (!filtro ||
        registro.matricula.toLowerCase().includes(filtro.toLowerCase()) ||
        registro.nombre.toLowerCase().includes(filtro.toLowerCase())) &&
      (!estatusFiltro || registro.estatus === estatusFiltro);
  
    const cumpleSemestre = !filtro || registro.semestre.toString() === filtro;
  
    return cumpleFiltro && cumpleSemestre;
  });
  

  

  return (
    <div className="registros-container">
    <h2>Registros de Alumnos</h2>
    
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
  
      {/* Filtro por Estatus */}
      <select
        value={estatusFiltro}
        onChange={(e) => setEstatusFiltro(e.target.value)}
        className="form-select mb-2"
      >
        <option value="">Todos los Estatus</option>
        <option value="ACTIVO">ACTIVO</option>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="COMPLETADO">COMPLETADO</option>
      </select>
  
      {/* Filtro por Semestre */}
      <select
        onChange={(e) => setFiltro(e.target.value)}
        className="form-select mb-2"
      >
        <option value="">Buscar por Semestre</option>
        {Object.keys(materiasPorSemestre).map((semestre) => (
          <option key={semestre} value={semestre}>
            Semestre {semestre}
          </option>
        ))}
      </select>
    </div>
  
   
  
    {/* Formulario de Datos Personales */}
    <div className="form-section">
      <h4>Datos Personales</h4>
      <div className="form-row">
        <input type="text" name="matricula" placeholder="Matrícula" value={nuevoRegistro.matricula} onChange={handleInputChange} className="form-control mb-2" />
        <input type="text" name="nombre" placeholder="Nombre" value={nuevoRegistro.nombre} onChange={handleInputChange} className="form-control mb-2" />
        <input type="text" name="apellidoP" placeholder="Apellido Paterno" value={nuevoRegistro.apellidoP} onChange={handleInputChange} className="form-control mb-2" />
        <input type="text" name="apellidoM" placeholder="Apellido Materno" value={nuevoRegistro.apellidoM} onChange={handleInputChange} className="form-control mb-2" />
        <input type="number" name="ingreso" placeholder="Año de Ingreso" value={nuevoRegistro.ingreso} onChange={handleInputChange} className="form-control mb-2" />
        <select name="estatus" value={nuevoRegistro.estatus} onChange={handleInputChange} className="form-select mb-2">
          <option value="ACTIVO">ACTIVO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="COMPLETADO">COMPLETADO</option>
        </select>
        <input
          type="text"
          name="nota"
          placeholder="Nota general"
          value={nuevoRegistro.nota}
          onChange={handleInputChange}
          className="form-control mb-2"
          />
          <div className="form-row">
  <label htmlFor="semestre"><strong>Seleccionar Semestre</strong></label>
  <select
    name="semestre"
    value={nuevoRegistro.semestre}
    onChange={handleSemestreChange}
    className="form-select mb-3"
  >
    <option value="">Selecciona un semestre</option>
    {Object.keys(materiasPorSemestre).map((semestre) => (
      <option key={semestre} value={semestre}>
        Semestre {semestre}
      </option>
    ))}
  </select>
  {nuevoRegistro.semestre && (
  <div className="materias-section">
    <h4>Materias Disponibles del Semestre {nuevoRegistro.semestre}</h4>
    <ul className="list-group">
      {materiasPorSemestre[nuevoRegistro.semestre].map((materia, index) => (
        <li key={index} className="list-group-item">
          <label>
            <input
              type="checkbox"
              checked={materiasSeleccionadas.some((m) => m.nombre === materia.nombre)}
              onChange={(e) => {
                if (e.target.checked) {
                  agregarMateria(materia);
                } else {
                  eliminarMateria(materia);
                }
              }}
              className="form-check-input me-2"
            />
            {materia.nombre} - Créditos: {materia.creditos}
          </label>
        </li>
      ))}
    </ul>
  </div>
)}


</div>

        </div>

        {nuevoRegistro.semestre > 1 && (
          <div className="materias-section">
            <h4>Materias Disponibles</h4>
            <ul>
              {materiasDisponibles.map((materia, index) => (
                <li key={index}>
                  {materia.nombre} - Créditos: {materia.creditos}
                  <button onClick={() => agregarMateria(materia)} className="btn btn-info btn-sm ms-2">Agregar</button>
                </li>
              ))}
            </ul>
          </div>
        )}

<div className="materias-section">
  <h4>Materias Seleccionadas</h4>
  <ul>
    {materiasSeleccionadas.map((materia, index) => (
      <li key={index}>
        {materia.nombre} - Créditos: {materia.creditos}
        <input
          type="text" // Ahora es texto libre
          placeholder="Nota (comentario)"
          value={materia.nota || ''} // Nota como texto
          onChange={(e) => handleNotaChange(index, e.target.value)}
          className="form-control-sm ms-2"
        />
        <button onClick={() => eliminarMateria(materia)} className="btn btn-danger btn-sm ms-2">
          Eliminar
        </button>
      </li>
    ))}
  </ul>
</div>



        <div className="button-group">
          {editando ? (
            <button onClick={guardarEdicion} className="btn btn-primary">Guardar Cambios</button>
          ) : (
            <button onClick={confirmarRegistro} className="btn btn-success">Agregar Registro</button>
          )}
        </div>
      </div>
      

{/* Tabla de Registros */}
<h4 className="mt-4">Lista de Registros</h4>
{registrosFiltrados.length > 0 ? (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Matrícula</th>
        <th>Nombre</th>
        <th>Semestre</th>
        <th>Estatus</th>
        <th>Nota</th>
        <th>Materias</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {registrosFiltrados.map((registro, index) => (
        <tr key={index}>
          <td>{registro.matricula}</td>
          <td>{`${registro.nombre} ${registro.apellidoP} ${registro.apellidoM}`}</td>
          <td>{registro.semestre}</td>
          <td>{registro.estatus}</td>
          <td>{registro.nota}</td>
          <td>
            {registro.materias.length > 0 ? (
              <ul>
                {registro.materias.map((materia, i) => (
                  <li key={i}>{materia.nombre} (Créditos: {materia.creditos})</li>
                ))}
              </ul>
            ) : (
              <span>Sin materias</span>
            )}
          </td>
          <td>
            <button onClick={() => editarRegistro(registro)} className="btn btn-primary btn-sm">Editar</button>
            <button onClick={() => eliminarRegistro(registro.id)} className="btn btn-danger btn-sm ms-2">Eliminar</button>
          </td>
        </tr>
        
      ))}
    </tbody>
  </table>
) : (
  <p>No hay registros disponibles.</p>
)}




    </div>
  );
};

export default Registros;

