import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Folder, Clock, Plus, ExternalLink, Trash2, LayoutTemplate, ArrowRight } from 'lucide-react'
import { getProjects, saveProject as saveProjectToDB, deleteProject as deleteProjectFromDB } from '../utils/db'

export default function ProjectDashboard({ onOpenProject, onGoHome }) {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data.sort((a, b) => b.updatedAt - a.updatedAt))
    }).catch(e => console.warn("Failed to load projects", e))
  }, [])

  const handleNewProject = async () => {
    const name = prompt('Project Name:', 'New Project')
    if (!name) return

    const newProject = {
      id: uuidv4(),
      name,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      // Initial empty state will be populated by BuilderProvider or TemplateLoader
    }

    await saveProjectToDB(newProject)
    setProjects([newProject, ...projects])
    onOpenProject(newProject.id)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      await deleteProjectFromDB(id)
      setProjects(projects.filter(p => p.id !== id))
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
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafb', fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .pd-bg-mesh { position: absolute; top: 0; left: 0; right: 0; height: 600px; background: radial-gradient(circle at 15% 50%, rgba(234, 88, 12, 0.08), transparent 50%), radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.08), transparent 50%); z-index: 0; pointer-events: none; }
        .pd-header-nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 40px; position: sticky; top: 0; z-index: 50; background: rgba(250, 250, 251, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.03); }
        
        .pd-btn-home { display: flex; alignItems: center; gap: 8px; padding: 10px 20px; background: #ffffff; color: #111827; border: 1px solid #e5e7eb; border-radius: 30px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .pd-btn-home:hover { border-color: #ea580c; color: #ea580c; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(234, 88, 12, 0.1); }
        
        .pd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 32px; position: relative; z-index: 10; padding: 40px; max-width: 1400px; margin: 0 auto; }
        
        .pd-card { background: #ffffff; border-radius: 20px; padding: 24px; cursor: pointer; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); position: relative; overflow: hidden; height: 220px; }
        .pd-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ea580c, #f97316); opacity: 0; transition: opacity 0.3s ease; }
        .pd-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -15px rgba(234, 88, 12, 0.15); border-color: rgba(234, 88, 12, 0.2); }
        .pd-card:hover::before { opacity: 1; }
        
        .pd-card-new { background: rgba(255,255,255,0.5); border: 2px dashed #d1d5db; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; cursor: pointer; transition: all 0.3s ease; gap: 16px; color: #6b7280; box-shadow: none; }
        .pd-card-new:hover { background: #ffffff; border-color: #ea580c; border-style: solid; color: #ea580c; transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(234, 88, 12, 0.15); }
        .pd-card-new .icon-wrap { width: 56px; height: 56px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
        .pd-card-new:hover .icon-wrap { background: rgba(234, 88, 12, 0.1); transform: scale(1.1) rotate(90deg); }

        .pd-icon-btn { opacity: 0; transform: scale(0.9); transition: all 0.2s ease; background: #fee2e2; color: #ef4444; border: none; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; }
        .pd-card:hover .pd-icon-btn { opacity: 1; transform: scale(1); }
        .pd-icon-btn:hover { background: #ef4444; color: #fff; }

        .pd-open-btn { opacity: 0; transform: translateX(-10px); transition: all 0.3s ease; display: flex; alignItems: center; gap: 6px; color: #ea580c; font-weight: 600; font-size: 0.9rem; }
        .pd-card:hover .pd-open-btn { opacity: 1; transform: translateX(0); }
      `}} />

      <div className="pd-bg-mesh"></div>

      <div className="pd-header-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ea580c, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)' }}>
            <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }}></div>
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>Dashboard</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem', fontWeight: '500' }}>Manage your workspaces</p>
          </div>
        </div>
        
        {onGoHome && (
          <button onClick={onGoHome} className="pd-btn-home">
            <LayoutTemplate size={16} />
            Templates & Landing Page
          </button>
        )}
      </div>

      <div className="pd-grid">
        {/* New Project Card */}
        <div className="pd-card-new" onClick={handleNewProject}>
          <div className="icon-wrap">
            <Plus size={28} />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Create New Project</span>
        </div>

        {/* Project List */}
        {projects.map(project => (
          <div key={project.id} className="pd-card" onClick={() => onOpenProject(project.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 88, 12, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                <Folder size={24} strokeWidth={2.5} />
              </div>
              <button 
                className="pd-icon-btn"
                onClick={(e) => handleDelete(e, project.id)}
                title="Delete Project"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
              {project.name}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
              <Clock size={14} />
              <span>Edited {formatTimeAgo(project.updatedAt)}</span>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <div className="pd-open-btn">
                Open Editor <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
