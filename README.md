## Análisis de Simetría Áurea Musical (Web App)

###### Resumen:
Es una aplicación web progresiva (SPA) construida con React, TypeScript y D3.js que analiza composiciones musicales matemáticamente para determinar su correspondencia con la Proporción Áurea (Phi ≈ 1.618).

###### Funcionamiento:
La aplicación procesa archivos de audio en tiempo real utilizando la Web Audio API (sin backend) para:

Extraer la señal cruda y calcular la energía RMS (Root Mean Square).
Detectar los "Picos de Energía" (clímax musicales) mediante un algoritmo adaptativo de umbral dinámico.
Calcular los "Puntos Áureos" temporales ideales de la canción.
Generar una Puntuación de Simetría que mide la distancia entre los clímax reales y la perfección matemática.


###### Tecnologías Clave:

**Frontend:** React 19, TypeScript, Vite.
**Visualización de Datos: **D3.js (para gráficas de espectro y oscilogramas) - `npm install d3 @types/d3`
**Estilos:** Tailwind CSS (con soporte Dark Mode). - `npm install -D tailwindcss postcss autoprefixer`
**Procesamiento**: Web Audio API (Decodificación y análisis DSP nativo en el navegador).


###### Características Principales:

Visualización dual (Energía vs. Forma de Onda).
Alternancia de formato de tiempo (Minutos:Segundos / Segundos totales).
Historial de análisis persistente (LocalStorage).
Exportación de resultados científicos en formato JSON.
Arquitectura modular y procesamiento 100% Client-Side (privado y rápido).