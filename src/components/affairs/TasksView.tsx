import React, { useState, useMemo } from 'react';
import { TaskRecord, TaskPriority, TaskStatus } from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import { Plus, Search, Edit2, Trash2, CheckSquare, Filter, X, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface TasksViewProps {
  tasks: TaskRecord[];
  onAddTask: (task: TaskRecord) => void;
  onEditTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setPriority('Medium');
    setStatus('Pending');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskRecord) => {
    setEditingId(task.id);
    setTitle(task.title || task.task || '');
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setNotes(task.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      const existing = tasks.find((t) => t.id === editingId);
      if (existing) {
        onEditTask({
          ...existing,
          title: title.trim(),
          task: title.trim(),
          dueDate,
          priority,
          status,
          notes: notes.trim() || undefined,
        });
      }
    } else {
      const newTask: TaskRecord = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        task: title.trim(),
        dueDate,
        priority,
        status,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onAddTask(newTask);
    }
    setIsModalOpen(false);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskTitle = task.title || task.task || '';
      const matchesSearch =
        taskTitle.toLowerCase().includes(search.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-700" />
            <span>{t.affairs.tasks}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.affairs.tasks_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="text-right px-3 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-mono text-amber-800">
              <span className="font-bold">{pendingCount}</span> Open Tasks
            </div>
          )}
          <button
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.affairs.add_task}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.common.search || 'Search tasks...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      {tasks.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
          <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700 text-sm">{t.affairs.no_records_added}</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Organize critical operational to-dos, statutory filing deadlines, vendor follow-ups, and audit tasks.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-3 py-1.5 bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            {t.affairs.add_task}
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-6 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No tasks match your filter.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5">Task Title</th>
                <th className="p-2.5">Due Date</th>
                <th className="p-2.5 text-center">Priority</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5">Notes</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-semibold text-slate-900">
                    <span className={task.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                      {task.title}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{task.dueDate}</span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        task.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : task.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500 truncate max-w-xs">{task.notes || '—'}</td>
                  <td className="p-2.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? t.affairs.edit_task : t.affairs.add_task}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. File Q3 GST Return, Stock reorder review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Checklist Details</label>
                <textarea
                  rows={2}
                  placeholder="Key milestones or required documentation"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {editingId ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
