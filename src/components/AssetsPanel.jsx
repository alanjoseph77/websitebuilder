import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { getProjectAssets, saveAsset, deleteAsset } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { Search, Upload, Trash2, Edit2, Image as ImageIcon, FileCode, Check, X } from 'lucide-react';

const S = {
  panel: { padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '0.85rem', fontWeight: '700', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' },
  searchBox: { display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '6px', padding: '6px 12px', gap: '8px' },
  searchInput: { border: 'none', background: 'transparent', flex: 1, fontSize: '0.8rem', outline: 'none', color: '#111827' },
  uploadBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#4f6ef7', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'background 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', overflowY: 'auto', paddingBottom: '20px' },
  assetCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' },
  previewWrap: { position: 'relative', width: '100%', paddingBottom: '100%', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  previewInner: { position: 'absolute', inset: 0, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  info: { padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' },
  nameInput: { fontSize: '0.75rem', border: '1px solid #4f6ef7', borderRadius: '4px', padding: '2px 4px', width: '100%', outline: 'none' },
  name: { fontSize: '0.75rem', fontWeight: '600', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  meta: { fontSize: '0.65rem', color: '#6b7280', display: 'flex', justifyContent: 'space-between' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '4px' },
}

export default function AssetsPanel() {
  const { projectId, addElement } = useBuilder();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssets();
  }, [projectId]);

  const loadAssets = async () => {
    if (!projectId) return;
    try {
      const projAssets = await getProjectAssets(projectId);
      setAssets(projAssets.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error("Failed to load assets:", err);
    }
  };

  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      // SVGs bypass canvas optimization to keep them vector
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ dataUrl: e.target.result, type: 'svg' });
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 1920
          const MAX = 1920;
          if (width > height && width > MAX) {
            height *= MAX / width;
            width = MAX;
          } else if (height > MAX) {
            width *= MAX / height;
            height = MAX;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP, 0.8 quality
          const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve({ dataUrl: webpDataUrl, type: 'webp' });
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !projectId) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Only images are supported currently.");
      return;
    }

    setIsUploading(true);
    try {
      const { dataUrl, type } = await optimizeImage(file);
      
      const newAsset = {
        id: `asset-${uuidv4()}`,
        projectId,
        name: file.name.replace(/\.[^/.]+$/, "") + (type === 'webp' ? '.webp' : '.svg'),
        dataUrl,
        type: file.type === 'image/svg+xml' ? 'svg' : 'image',
        createdAt: Date.now()
      };

      await saveAsset(newAsset);
      await loadAssets();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload asset");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this asset? Existing instances on the canvas will break.")) return;
    try {
      await deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleRename = async (id) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const asset = assets.find(a => a.id === id);
      if (asset) {
        const updated = { ...asset, name: editName };
        await saveAsset(updated);
        setAssets(assets.map(a => a.id === id ? updated : a));
      }
    } catch (err) {
      console.error("Rename failed", err);
    }
    setEditingId(null);
  };

  const startDrag = (e, asset) => {
    e.dataTransfer.setData('application/x-siteforge-asset', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddClick = (asset) => {
    addElement({
      type: 'image',
      props: {
        src: asset.dataUrl,
        alt: asset.name
      },
      styles: {
        width: '100%',
        maxWidth: '300px',
        objectFit: 'cover'
      }
    });
  };

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={S.panel}>
      <div style={S.header}>
        <span style={S.title}>Assets Manager</span>
      </div>

      <div style={S.searchBox}>
        <Search size={14} color="#9ca3af" />
        <input 
          style={S.searchInput} 
          placeholder="Search assets..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button style={S.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        <Upload size={16} />
        {isUploading ? 'Optimizing...' : 'Upload Asset'}
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleUpload}
      />

      <div style={S.grid}>
        {filteredAssets.map(asset => (
          <div 
            key={asset.id} 
            style={S.assetCard}
            draggable
            onDragStart={(e) => startDrag(e, asset)}
          >
            <div 
              onClick={() => handleAddClick(asset)}
              title="Click to add to canvas, or drag and drop"
              style={{...S.previewWrap, cursor: 'pointer'}}
            >
              <div style={S.previewInner}>
                {asset.type === 'svg' ? (
                  <img src={asset.dataUrl} alt={asset.name} style={S.image} />
                ) : (
                  <img src={asset.dataUrl} alt={asset.name} style={S.image} />
                )}
              </div>
            </div>
            
            <div style={S.info}>
              {editingId === asset.id ? (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <input 
                    autoFocus
                    style={S.nameInput} 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRename(asset.id); if (e.key === 'Escape') setEditingId(null); }}
                  />
                  <button style={{...S.actionBtn, color: '#10b981'}} onClick={() => handleRename(asset.id)}><Check size={12} /></button>
                  <button style={S.actionBtn} onClick={() => setEditingId(null)}><X size={12} /></button>
                </div>
              ) : (
                <div style={S.name} title={asset.name}>{asset.name}</div>
              )}
              
              <div style={S.meta}>
                <span>{asset.type.toUpperCase()}</span>
                <div style={S.actions}>
                  <button 
                    style={S.actionBtn} 
                    title="Rename"
                    onClick={() => { setEditingId(asset.id); setEditName(asset.name); }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    style={{...S.actionBtn, color: '#ef4444'}} 
                    title="Delete"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredAssets.length === 0 && !isUploading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '20px 0', fontSize: '0.8rem' }}>
            No assets found. Upload some images to get started!
          </div>
        )}
      </div>
    </div>
  )
}
