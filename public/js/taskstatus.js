(function () {
    'use strict';

    const TASK_STATE_INFO = 0;
    const TASK_STATE_TODO = 1;
    const TASK_STATE_DONE = 2;

    const STATE_LABELS = (() => {
        const lang = (document.documentElement.lang || navigator.language || '').toLowerCase();
        const translations = {
            es: {
                [TASK_STATE_INFO]: 'Información',
                [TASK_STATE_TODO]: 'Por hacer',
                [TASK_STATE_DONE]: 'Hecho'
            },
            fr: {
                [TASK_STATE_INFO]: 'Information',
                [TASK_STATE_TODO]: 'À faire',
                [TASK_STATE_DONE]: 'Terminé'
            },
            en: {
                [TASK_STATE_INFO]: 'Information',
                [TASK_STATE_TODO]: 'To do',
                [TASK_STATE_DONE]: 'Done'
            }
        };

        if (lang.startsWith('es')) {
            return translations.es;
        }
        if (lang.startsWith('fr')) {
            return translations.fr;
        }
        return translations.en;
    })();

    const STATE_ICONS = {
        [TASK_STATE_INFO]: 'ti ti-info-circle',
        [TASK_STATE_TODO]: 'ti ti-clock',
        [TASK_STATE_DONE]: 'ti ti-check'
    };

    const STATE_CLASSES = {
        [TASK_STATE_INFO]: 'task-status-info',
        [TASK_STATE_TODO]: 'task-status-todo',
        [TASK_STATE_DONE]: 'task-status-done'
    };

    function getTaskState(timelineItem) {
        const normalizeState = (value) => {
            if (value === null || value === undefined) {
                return null;
            }
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 2) {
                return parsed;
            }
            const text = String(value).toLowerCase();
            if (text.includes('info')) {
                return TASK_STATE_INFO;
            }
            if (text.includes('todo') || text.includes('to do') || text.includes('pending') || text.includes('à faire')) {
                return TASK_STATE_TODO;
            }
            if (text.includes('done') || text.includes('termin') || text.includes('hecho')) {
                return TASK_STATE_DONE;
            }
            return null;
        };

        const stateElement = timelineItem.querySelector('.todo-list-state .state, .task-status .state');
        if (stateElement) {
            const stateClass = Array.from(stateElement.classList).find(cls => cls.startsWith('state_'));
            const stateFromClass = normalizeState(stateClass ? stateClass.replace('state_', '') : null);
            if (stateFromClass !== null) {
                return stateFromClass;
            }

            const stateData = stateElement.getAttribute('data-state') || stateElement.getAttribute('data-status') || stateElement.getAttribute('data-status-code');
            const stateFromData = normalizeState(stateData);
            if (stateFromData !== null) {
                return stateFromData;
            }

            const ariaLabelState = normalizeState(stateElement.getAttribute('aria-label'));
            if (ariaLabelState !== null) {
                return ariaLabelState;
            }
        }

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

        const stateAttr = timelineItem.getAttribute('data-state') || timelineItem.getAttribute('data-status') || timelineItem.getAttribute('data-status-code');
        const stateFromAttr = normalizeState(stateAttr);
        if (stateFromAttr !== null) {
            return stateFromAttr;
        }

        return null;
    }

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

    function addStatusBadgeToTask(timelineItem) {
        const existingBadge = timelineItem.querySelector('.task-status-badge');
        if (existingBadge) {
            return;
        }

        const badgesContainer = timelineItem.querySelector('.timeline-badges');
        if (!badgesContainer) {
            return;
        }

        const state = getTaskState(timelineItem);
        if (state === null) {
            return;
        }

        const badge = createStatusBadge(state);
        if (badge) {
            badgesContainer.insertBefore(badge, badgesContainer.firstChild);
        }
    }

    function isTaskItem(timelineItem) {
        const itemType = timelineItem.getAttribute('data-itemtype');

        if (itemType === 'TicketTask' || itemType === 'ProjectTask') {
            return true;
        }

        const classes = timelineItem.className;
        if (classes.includes('ITILTask')) {
            return true;
        }

        const hasTodoListState = timelineItem.querySelector('.todo-list-state') !== null;
        const hasReadOnlyContent = timelineItem.querySelector('.read-only-content') !== null;
        const hasItilTask = timelineItem.querySelector('.itiltask') !== null;

        return hasTodoListState && (hasReadOnlyContent || hasItilTask);
    }

    function processAllTasks() {
        const timelineItems = document.querySelectorAll('.itil-timeline .timeline-item, .timeline .timeline-item, .ticket-timeline .timeline-item');

        timelineItems.forEach(item => {
            if (isTaskItem(item)) {
                const badgesContainer = item.querySelector('.timeline-badges');
                if (badgesContainer) {
                    addStatusBadgeToTask(item);
                }
            }
        });
    }

    function setupTimelineObserver() {
        const timeline = document.querySelector('.itil-timeline, .timeline, .ticket-timeline');
        if (!timeline) {
            return;
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('timeline-item')) {
                            if (isTaskItem(node)) {
                                const badgesContainer = node.querySelector('.timeline-badges');
                                if (badgesContainer) {
                                    addStatusBadgeToTask(node);
                                }
                            }
                        } else {
                            const tasks = node.querySelectorAll && node.querySelectorAll('.timeline-item');
                            if (tasks) {
                                tasks.forEach(function (taskItem) {
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

                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('timeline-item')) {
                        if (isTaskItem(target)) {
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

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                processAllTasks();
                setupTimelineObserver();
            });
        } else {
            processAllTasks();
            setupTimelineObserver();
        }

        window.addEventListener('load', function () {
            setTimeout(processAllTasks, 500);
        });

        if (typeof $ !== 'undefined') {
            $(document).on('timeline.updated', function () {
                setTimeout(processAllTasks, 100);
            });

            $(document).ajaxComplete(function () {
                setTimeout(processAllTasks, 200);
            });
        } else {
            document.addEventListener('timeline.updated', function () {
                setTimeout(processAllTasks, 100);
            });
        }
    }

    init();
})();

