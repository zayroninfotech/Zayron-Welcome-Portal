import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api/axios'
import { toast } from 'react-toastify'
import Layout from '../../../components/Layout'
import PageLoader from '../../../components/PageLoader'
import { BtnSpinner } from '../../../components/BtnLoader'

const STATUS_COLOR = { todo: '#6b7280', in_progress: '#f59e0b', done: '#10b981' }
const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const PROJ_STATUS_COLOR = { active: '#2563eb', on_hold: '#f59e0b', completed: '#10b981' }
const PROJ_STATUS_LABEL = { active: 'Active', on_hold: 'On Hold', completed: 'Completed' }

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo', screenshot: null })
  const [saving, setSaving] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [storyText, setStoryText] = useState('')
  const [addingStory, setAddingStory] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/`)
      setProject(data)
      if (selectedTask) {
        const updated = data.tasks.find(t => t.id === selectedTask.id)
        if (updated) setSelectedTask(updated)
      }
    } catch { toast.error('Failed to load project') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleCreateTask = async e => {
    e.preventDefault()
    if (!taskForm.title.trim()) { toast.error('Task title required'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', taskForm.title)
      fd.append('description', taskForm.description)
      fd.append('status', taskForm.status)
      if (taskForm.screenshot) fd.append('screenshot', taskForm.screenshot)
      await api.post(`/projects/${id}/tasks/`, fd)
      toast.success('Task created!')
      setShowTaskModal(false)
      setTaskForm({ title: '', description: '', status: 'todo', screenshot: null })
      load()
    } catch { toast.error('Failed to create task') }
    finally { setSaving(false) }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/projects/tasks/${task.id}/`, { status: newStatus })
      load()
    } catch { toast.error('Failed to update status') }
  }

  const handleDeleteTask = async taskId => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/projects/tasks/${taskId}/`)
      setSelectedTask(null)
      load()
    } catch { toast.error('Failed to delete task') }
  }

  const handleAddStory = async e => {
    e.preventDefault()
    if (!storyText.trim()) return
    setAddingStory(true)
    try {
      await api.post(`/projects/tasks/${selectedTask.id}/stories/`, { story: storyText })
      setStoryText('')
      load()
    } catch { toast.error('Failed to add story') }
    finally { setAddingStory(false) }
  }

  const handleDeleteStory = async storyId => {
    try {
      await api.delete(`/projects/stories/${storyId}/`)
      load()
    } catch { toast.error('Failed to delete story') }
  }

  const handleUploadScreenshot = async (taskId, file) => {
    const fd = new FormData()
    fd.append('screenshot', file)
    try {
      await api.put(`/projects/tasks/${taskId}/`, fd)
      toast.success('Screenshot uploaded!')
      load()
    } catch { toast.error('Failed to upload screenshot') }
  }

  const handleUpdateProjectStatus = async newStatus => {
    try {
      await api.put(`/projects/${id}/`, { status: newStatus })
      load()
    } catch { toast.error('Failed to update status') }
  }

  if (loading) return <PageLoader text="Loading Project..." />
  if (!project) return <Layout title="Project"><div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Project not found.</div></Layout>

  const todo = project.tasks.filter(t => t.status === 'todo')
  const inProgress = project.tasks.filter(t => t.status === 'in_progress')
  const done = project.tasks.filter(t => t.status === 'done')

  return (
    <Layout title={project.name}>
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <button onClick={() => navigate('/admin/projects')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0 }}>← Projects</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{project.name}</h1>
          {project.description && <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{project.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={project.status} onChange={e => handleUpdateProjectStatus(e.target.value)}
            style={{ border: `1px solid ${PROJ_STATUS_COLOR[project.status]}`, color: PROJ_STATUS_COLOR[project.status], background: PROJ_STATUS_COLOR[project.status] + '12', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={() => setShowTaskModal(true)} style={{ background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            + Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[['todo', 'To Do', todo], ['in_progress', 'In Progress', inProgress], ['done', 'Done', done]].map(([col, label, tasks]) => (
          <div key={col} style={{ background: '#f9fafb', borderRadius: 10, padding: 14, minHeight: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: STATUS_COLOR[col] }}>{label}</span>
              <span style={{ background: STATUS_COLOR[col] + '20', color: STATUS_COLOR[col], borderRadius: 10, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{tasks.length}</span>
            </div>
            {tasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTask(task)}
                style={{ background: '#fff', border: `1px solid ${selectedTask?.id === task.id ? '#2563eb' : '#e5e7eb'}`, borderRadius: 8, padding: 12, marginBottom: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', marginBottom: 4 }}>{task.title}</div>
                {task.description && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{task.description.slice(0, 60)}{task.description.length > 60 ? '...' : ''}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {task.screenshot_url && <span style={{ fontSize: 11, color: '#2563eb' }}>📷 Screenshot</span>}
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{task.user_stories?.length || 0} stories</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{selectedTask.title}</h2>
              {selectedTask.description && <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{selectedTask.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={selectedTask.status} onChange={e => handleStatusChange(selectedTask, e.target.value)}
                style={{ border: `1px solid ${STATUS_COLOR[selectedTask.status]}`, color: STATUS_COLOR[selectedTask.status], background: STATUS_COLOR[selectedTask.status] + '12', borderRadius: 6, padding: '5px 10px', fontWeight: 600, fontSize: 12 }}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => handleDeleteTask(selectedTask.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Delete</button>
              <button onClick={() => setSelectedTask(null)} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>✕</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Screenshot */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Screenshot</h3>
              {selectedTask.screenshot_url ? (
                <div>
                  <img src={selectedTask.screenshot_url} alt="Screenshot" style={{ width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 8 }} />
                  <label style={{ display: 'inline-block', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    Replace Screenshot
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUploadScreenshot(selectedTask.id, e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #d1d5db', borderRadius: 8, padding: 30, cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
                  <span style={{ fontSize: 28, marginBottom: 8 }}>📷</span>
                  Click to upload screenshot
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUploadScreenshot(selectedTask.id, e.target.files[0])} />
                </label>
              )}
            </div>

            {/* User Stories */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Stories</h3>
              <div style={{ marginBottom: 12, maxHeight: 200, overflowY: 'auto' }}>
                {selectedTask.user_stories?.length === 0 && (
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No user stories yet. Add one below.</p>
                )}
                {selectedTask.user_stories?.map(s => (
                  <div key={s.id} style={{ background: '#f0f5ff', border: '1px solid #c7d8ff', borderRadius: 8, padding: '8px 12px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ fontSize: 13, color: '#1e40af', margin: 0, flex: 1, lineHeight: 1.5 }}>
                      <strong>As a user,</strong> {s.story}
                    </p>
                    <button onClick={() => handleDeleteStory(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, padding: 0, flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddStory}>
                <textarea value={storyText} onChange={e => setStoryText(e.target.value)}
                  rows={3} placeholder='e.g. "I want to upload a screenshot so that I can track progress"'
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }} />
                <button type="submit" disabled={addingStory || !storyText.trim()}
                  style={{ marginTop: 8, background: '#1e40af', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: addingStory ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 13, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: addingStory ? 0.8 : 1 }}>
                  {addingStory && <BtnSpinner size={14} />}
                  {addingStory ? 'Adding...' : '+ Add User Story'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 460, maxWidth: '90vw' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Task Title *</label>
                <input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, boxSizing: 'border-box' }}
                  placeholder="Enter task title" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Status</label>
                <select value={taskForm.status} onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, boxSizing: 'border-box' }}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Screenshot (optional)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px dashed #d1d5db', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' }}>
                  <span style={{ fontSize: 18 }}>{taskForm.screenshot ? '✓' : '📷'}</span>
                  <span style={{ fontSize: 13, color: taskForm.screenshot ? '#10b981' : '#6b7280' }}>
                    {taskForm.screenshot ? taskForm.screenshot.name : 'Click to upload screenshot'}
                  </span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setTaskForm(f => ({ ...f, screenshot: e.target.files[0] }))} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowTaskModal(false)}
                  style={{ border: '1px solid #d1d5db', background: '#fff', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Cancel</button>
                <button type="submit" disabled={saving}
                  style={{ background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.8 : 1 }}>
                  {saving && <BtnSpinner />}
                  {saving ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </Layout>
  )
}
