# Task Status Display Plugin

Plugin para GLPI que mejora visualmente la vista de las tareas en los tickets mostrando badges de estado directamente en la línea de tiempo (timeline).

## Características

- **Badges de estado visuales**: Muestra el estado de las tareas (Información, Por hacer, Hecho) sin necesidad de abrir la tarea
- **Código de colores**: Cada estado tiene un color distintivo para identificación rápida
  - 🔵 **Información** (azul)
  - 🟠 **Por hacer** (naranja)
  - 🟢 **Hecho** (verde)
- **No intrusivo**: Funciona perfectamente con la interfaz existente de GLPI
- **Sin configuración**: Funciona directamente después de la instalación
- **Actualización dinámica**: Los badges se actualizan automáticamente cuando cambia el estado de una tarea

## Instalación

1. Copiar la carpeta `taskstatus` a `plugins/` en tu instalación de GLPI
2. Ir a **Configuración > Plugins**
3. Activar el plugin **Task Status Display**
4. ¡Listo! Los badges de estado aparecerán automáticamente en las tareas de los tickets

## Requisitos

- GLPI 10.0.0 o superior
- PHP 7.4 o superior

## Uso

Una vez instalado y activado, simplemente abre cualquier ticket y verás los badges de estado en cada tarea de la línea de tiempo. No se requiere ninguna configuración adicional.

## Desarrollo

### Estructura del plugin

```
taskstatus/
├── setup.php              # Archivo principal de configuración
├── plugin.xml             # Metadatos del plugin
├── install/
│   └── install.php        # Script de instalación
├── js/
│   └── taskstatus.js      # JavaScript para añadir badges
├── css/
│   └── taskstatus.css     # Estilos para los badges
└── locales/
    ├── es_ES.php          # Traducciones en español
    └── en_GB.php          # Traducciones en inglés
```

## Licencia

GPL v3+

## Autor

Juan Carlos Acosta Perabá

