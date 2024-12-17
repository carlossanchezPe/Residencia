// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Registros from './pages/Registros';
import Alumnos from './pages/Alumnos';
import PerfilAlumno from './pages/PerfilAlumno';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const materiasPorSemestre = {
    1: ['Matemáticas', 'Historia', 'Ciencias'],
    2: ['Álgebra', 'Geografía', 'Biología'],
    3: ['Química', 'Física', 'Literatura'],
    // Agrega más semestres y materias si es necesario
  };

  const [alumnos, setAlumnos] = useState([
    { 
      id: 1, 
      matricula: '20210001', 
      nombre: 'Juan', 
      apellidoP: 'Pérez', 
      apellidoM: 'López', 
      ingreso: 2021, 
      estatus: 'ACTIVO', 
      nota: 'Buen desempeño', 
      semestre: 1, 
      materias: materiasPorSemestre[1]
    },
    { 
      id: 2, 
      matricula: '20210002', 
      nombre: 'Ana', 
      apellidoP: 'Martínez', 
      apellidoM: 'Gómez', 
      ingreso: 2021, 
      estatus: 'PENDIENTE', 
      nota: 'Necesita mejorar en matemáticas', 
      semestre: 1, 
      materias: materiasPorSemestre[1]
    },
  ]);
  



  
  const agregarAlumno = (nuevoAlumno) => {
    setAlumnos([...alumnos, { id: alumnos.length + 1, semestre: 1, materias: materiasPorSemestre[1], ...nuevoAlumno }]);
  };

  const actualizarAlumno = (id, datosActualizados) => {
    setAlumnos(
      alumnos.map((alumno) =>
        alumno.id === id ? { ...alumno, ...datosActualizados } : alumno
      )
    );
  };

  const avanzarSemestre = async () => {
    const nuevosAlumnos = alumnos.map((alumno) => ({
      ...alumno,
      semestre: alumno.semestre + 1,
      materias: materiasPorSemestre[alumno.semestre + 1] || [] // Asigna materias del siguiente semestre
    }));
    setAlumnos(nuevosAlumnos);

    // Actualizar en Firestore
    nuevosAlumnos.forEach(async (alumno) => {
      const alumnoRef = doc(db, 'alumnos', alumno.id.toString());
      await updateDoc(alumnoRef, { semestre: alumno.semestre, materias: alumno.materias });
    });
  };

  const actualizarTodosLosRegistros = (nuevosRegistros) => {
    setAlumnos(nuevosRegistros); // Actualiza el estado correctamente
  };

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <ProtectedRoute>
                <Registro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registros"
            element={
              <ProtectedRoute>
                <Registros
                  registros={alumnos}
                  agregarRegistro={agregarAlumno}
                  actualizarRegistro={actualizarAlumno}
                  avanzarSemestre={avanzarSemestre} // Pasa la función avanzarSemestre
                  actualizarTodosLosRegistros={actualizarTodosLosRegistros} // Nueva función añadida
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumnos"
            element={
              <ProtectedRoute>
                <Alumnos alumnos={alumnos} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumno/:id"
            element={
              <ProtectedRoute>
                <PerfilAlumno alumnos={alumnos} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
  