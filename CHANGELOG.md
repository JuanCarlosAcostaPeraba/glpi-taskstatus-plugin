# Changelog - Task Status Display

## v2.0.0 - GLPI 11 native (2025-12-15)

### 🚀 Cambios principales
- Soporte nativo para GLPI 11.0.x (PHP 8.1+).
- Estructura de assets movida a `public/` para evitar 404 bajo GLPI 11 (Vue).
- Hooks actualizados para servir `public/css/taskstatus.css` y `public/js/taskstatus.js`.
- Etiquetas e iconos multilenguaje (en/es/fr) y detección de DOM compatible con timeline GLPI 11.

### 🔧 Migración
- Elimina versiones previas en `glpi/plugins/taskstatus`.
- Copia el nuevo paquete y activa el plugin.
- Limpia caché de GLPI si es necesario.

## v1.0.0 - Release inicial (2025-12-10)
- Visualización de badges de estado en la línea de tiempo (GLPI 10.x).
- Estados Información, Por hacer, Hecho con colores e iconos.
- Soporte en inglés, español y francés.

