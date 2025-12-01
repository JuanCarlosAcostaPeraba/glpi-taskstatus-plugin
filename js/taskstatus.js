/**
 * Task Status Display Plugin - JavaScript
 * Añade badges de estado visuales a las tareas en la timeline de los tickets
 */

(function() {
    'use strict';

    // Estados de las tareas según Planning.php
    const TASK_STATE_INFO = 0;  // Información
    const TASK_STATE_TODO = 1;  // Por hacer
    const TASK_STATE_DONE = 2;  // Hecho

    // Textos de los estados (se pueden traducir si es necesario)
    const STATE_LABELS = {
        [TASK_STATE_INFO]: 'Información',
        [TASK_STATE_TODO]: 'Por hacer',
        [TASK_STATE_DONE]: 'Hecho'
    };

    // Iconos para cada estado
    const STATE_ICONS = {
        [TASK_STATE_INFO]: 'ti ti-info-circle',
        [TASK_STATE_TODO]: 'ti ti-clock',
        [TASK_STATE_DONE]: 'ti ti-check'
    };

    // Clases CSS para cada estado
    const STATE_CLASSES = {
        [TASK_STATE_INFO]: 'task-status-info',
        [TASK_STATE_TODO]: 'task-status-todo',
        [TASK_STATE_DONE]: 'task-status-done'
    };

    /**
     * Obtiene el estado de una tarea desde el elemento de la timeline
     */
    function getTaskState(timelineItem) {
        // Primero, buscar el elemento .state que contiene el estado visual
        const stateElement = timelineItem.querySelector('.todo-list-state .state');
        if (stateElement) {
            const stateClass = Array.from(stateElement.classList).find(cls => cls.startsWith('state_'));
            if (stateClass) {
                const stateNum = parseInt(stateClass.replace('state_', ''), 10);
                if (!isNaN(stateNum) && stateNum >= 0 && stateNum <= 2) {
                    return stateNum;
                }
            }
        }

        // Buscar en las clases del elemento principal (info, todo, done)
        const classes = timelineItem.className;
        if (classes.includes('info')) {
            return TASK_STATE_INFO;
        }
        if (classes.includes('todo')) {
            return TASK_STATE_TODO;
        }
        if (classes.includes('done')) {
            return TASK_STATE_DONE;
        }

        // Buscar en el atributo data-state si existe
        const stateAttr = timelineItem.getAttribute('data-state');
        if (stateAttr !== null) {
            const stateNum = parseInt(stateAttr, 10);
            if (!isNaN(stateNum) && stateNum >= 0 && stateNum <= 2) {
                return stateNum;
            }
        }

        return null;
    }

    /**
     * Crea el badge de estado para una tarea
     */
    function createStatusBadge(state) {
        if (state === null || state === undefined) {
            return null;
        }

        const badge = document.createElement('span');
        badge.className = `badge task-status-badge ${STATE_CLASSES[state] || ''}`;
        badge.setAttribute('title', STATE_LABELS[state] || 'Estado desconocido');

        const icon = document.createElement('i');
        icon.className = STATE_ICONS[state] || 'ti ti-help';
        badge.appendChild(icon);

        const text = document.createTextNode(STATE_LABELS[state] || '');
        badge.appendChild(text);

        return badge;
    }

    /**
     * Añade el badge de estado a una tarea si no existe ya
     */
    function addStatusBadgeToTask(timelineItem) {
        // Verificar si ya tiene el badge
        const existingBadge = timelineItem.querySelector('.task-status-badge');
        if (existingBadge) {
            return;
        }

        // Buscar el contenedor de badges (timeline-badges)
        const badgesContainer = timelineItem.querySelector('.timeline-badges');
        if (!badgesContainer) {
            return;
        }

        // Obtener el estado de la tarea
        const state = getTaskState(timelineItem);
        if (state === null) {
            return;
        }

        // Crear y añadir el badge
        const badge = createStatusBadge(state);
        if (badge) {
            // Insertar al principio de los badges para que sea lo primero que se vea
            badgesContainer.insertBefore(badge, badgesContainer.firstChild);
        }
    }

    /**
     * Verifica si un elemento de timeline es una tarea
     */
    function isTaskItem(timelineItem) {
        const itemType = timelineItem.getAttribute('data-itemtype');
        
        // Verificar por tipo de item
        if (itemType === 'TicketTask' || itemType === 'ProjectTask') {
            return true;
        }

        // Verificar por clases (ITILTask)
        const classes = timelineItem.className;
        if (classes.includes('ITILTask')) {
            return true;
        }

        // Verificar si tiene elementos específicos de tareas
        const hasTodoListState = timelineItem.querySelector('.todo-list-state') !== null;
        const hasReadOnlyContent = timelineItem.querySelector('.read-only-content') !== null;
        const hasItilTask = timelineItem.querySelector('.itiltask') !== null;

        return hasTodoListState && (hasReadOnlyContent || hasItilTask);
    }

    /**
     * Procesa todas las tareas en la timeline
     */
    function processAllTasks() {
        // Buscar todos los elementos de tareas en la timeline
        const timelineItems = document.querySelectorAll('.itil-timeline .timeline-item');
        
        timelineItems.forEach(item => {
            // Verificar si es una tarea
            if (isTaskItem(item)) {
                // Verificar que tenga contenedor de badges
                const badgesContainer = item.querySelector('.timeline-badges');
                if (badgesContainer) {
                    addStatusBadgeToTask(item);
                }
            }
        });
    }

    /**
     * Observa cambios en la timeline para añadir badges a nuevas tareas y actualizar estados
     */
    function setupTimelineObserver() {
        const timeline = document.querySelector('.itil-timeline');
        if (!timeline) {
            return;
        }

        // Usar MutationObserver para detectar cuando se añaden nuevas tareas o cambian estados
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Procesar nodos añadidos
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Verificar si el nodo añadido es una tarea
                        if (node.classList && node.classList.contains('timeline-item')) {
                            if (isTaskItem(node)) {
                                const badgesContainer = node.querySelector('.timeline-badges');
                                if (badgesContainer) {
                                    addStatusBadgeToTask(node);
                                }
                            }
                        } else {
                            // Buscar tareas dentro del nodo añadido
                            const tasks = node.querySelectorAll && node.querySelectorAll('.timeline-item');
                            if (tasks) {
                                tasks.forEach(function(taskItem) {
                                    if (isTaskItem(taskItem)) {
                                        const badgesContainer = taskItem.querySelector('.timeline-badges');
                                        if (badgesContainer) {
                                            addStatusBadgeToTask(taskItem);
                                        }
                                    }
                                });
                            }
                        }
                    }
                });

                // Procesar cambios en atributos (como clases que cambian cuando se actualiza el estado)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('timeline-item')) {
                        if (isTaskItem(target)) {
                            // Si cambió la clase de una tarea, actualizar el badge
                            const existingBadge = target.querySelector('.task-status-badge');
                            if (existingBadge) {
                                existingBadge.remove();
                            }
                            const badgesContainer = target.querySelector('.timeline-badges');
                            if (badgesContainer) {
                                addStatusBadgeToTask(target);
                            }
                        }
                    } else if (target.classList && target.classList.contains('state')) {
                        // Si cambió el estado visual, actualizar el badge de la tarea padre
                        const timelineItem = target.closest('.timeline-item');
                        if (timelineItem && isTaskItem(timelineItem)) {
                            const existingBadge = timelineItem.querySelector('.task-status-badge');
                            if (existingBadge) {
                                existingBadge.remove();
                            }
                            const badgesContainer = timelineItem.querySelector('.timeline-badges');
                            if (badgesContainer) {
                                addStatusBadgeToTask(timelineItem);
                            }
                        }
                    }
                }
            });
        });

        observer.observe(timeline, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Inicialización del plugin
     */
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                processAllTasks();
                setupTimelineObserver();
            });
        } else {
            processAllTasks();
            setupTimelineObserver();
        }

        // También procesar después de que se cargue completamente la página
        window.addEventListener('load', function() {
            setTimeout(processAllTasks, 500);
        });

        // Procesar cuando se actualiza la timeline (eventos de GLPI)
        // Usar jQuery si está disponible, sino usar addEventListener
        if (typeof $ !== 'undefined') {
            $(document).on('timeline.updated', function() {
                setTimeout(processAllTasks, 100);
            });

            // También procesar después de operaciones AJAX que puedan actualizar la timeline
            $(document).ajaxComplete(function() {
                setTimeout(processAllTasks, 200);
            });
        } else {
            // Fallback sin jQuery
            document.addEventListener('timeline.updated', function() {
                setTimeout(processAllTasks, 100);
            });
        }
    }

    // Inicializar
    init();
})();

