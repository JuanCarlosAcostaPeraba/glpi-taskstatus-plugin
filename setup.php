<?php

if (!defined('GLPI_ROOT')) {
    die('Direct access not allowed');
}

define('TASKSTATUS_VERSION', '2.0.0');

/**
 * Inicialización del plugin (GLPI la ejecuta al cargar el plugin)
 */
function plugin_init_taskstatus()
{
    global $PLUGIN_HOOKS, $CFG_GLPI;

    // Marcar el plugin como compatible con CSRF
    $PLUGIN_HOOKS['csrf_compliant']['taskstatus'] = true;

    // Inyectar CSS para los badges de estado (GLPI 11 sirve desde /public)
    $PLUGIN_HOOKS['add_css']['taskstatus'][] = 'public/css/taskstatus.css';

    // Inyectar JavaScript para añadir badges de estado en la timeline
    $PLUGIN_HOOKS['add_javascript']['taskstatus'][] = 'public/js/taskstatus.js';
}

/**
 * Información del plugin (pantalla de plugins)
 */
function plugin_version_taskstatus()
{
    return [
        'name'    => 'Task Status Display',
        'version' => TASKSTATUS_VERSION,
        'author'  => 'Juan Carlos Acosta Perabá',
        'license' => 'GPLv3+',
        'homepage' => 'https://github.com/JuanCarlosAcostaPeraba/glpi-taskstatus-plugin',
        'requirements' => [
            'glpi' => [
                'min' => '11.0.0',
                'max' => '11.0.99',
            ],
        ],
    ];
}

/**
 * Requisitos mínimos
 */
function plugin_taskstatus_check_prerequisites()
{
    return true;
}

/**
 * Estado de configuración
 */
function plugin_taskstatus_check_config($verbose = false)
{
    return true;
}

/**
 * Instalación del plugin taskstatus
 */
function plugin_taskstatus_install()
{
    // Este plugin no requiere tablas de base de datos
    // Solo añade funcionalidad visual mediante CSS y JavaScript
    return true;
}

/**
 * Desinstalación del plugin
 */
function plugin_taskstatus_uninstall()
{
    // No hay tablas que eliminar
    return true;
}
