import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Folder, Clock, Plus, ExternalLink, Trash2 } from 'lucide-react'

export default function ProjectDashboard({ onOpenProject }) {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('siteforge_projects')
      if (saved) {
        setProjects(JSON.parse(saved).sort((a, b) => b.updatedAt - a.updatedAt))
      }
    } catch (e) {
      console.warn("Failed to parse projects", e)
    }
  }, [])

  const saveProjects = (newProjects) => {
    setProjects(newProjects)
    localStorage.setItem('siteforge_projects', JSON.stringify(newProjects))
  }

  const handleNewProject = () => {
    const name = prompt('Project Name:', 'New Project')
    if (!name) return

    const newProject = {
      id: uuidv4(),
      name,
      updatedAt: Date.now(),
      createdAt: Date.now()
    }

    saveProjects([newProject, ...projects])
    onOpenProject(newProject.id)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      saveProjects(projects.filter(p => p.id !== id))
      localStorage.removeItem(`siteforge_project_${id}`)
    }
  }

  function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '60px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>My Projects</h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>Manage your websites and pages.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* New Project Card */}
          <div 
            onClick={handleNewProject}
            style={{ 
              backgroundColor: '#ffffff', borderRadius: '12px', border: '2px dashed #d1d5db',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '180px', cursor: 'pointer', transition: 'all 0.2s', color: '#6b7280'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f6ef7'; e.currentTarget.style.color = '#4f6ef7' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280' }}
          >
            <Plus size={32} style={{ marginBottom: '12px' }} />
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>New Project</span>
          </div>

          {/* Project List */}
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              style={{
                backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb',
                height: '180px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s', position: 'relative'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f6ef7', marginBottom: '16px' }}>
                  <Folder size={20} />
                </div>
                <button 
                  onClick={(e) => handleDelete(e, project.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{project.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.85rem', marginTop: 'auto' }}>
                <Clock size={14} />
                <span>Updated {formatTimeAgo(project.updatedAt)}</span>
              </div>
              
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#4f6ef7', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                Open <ExternalLink size={14} />
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
