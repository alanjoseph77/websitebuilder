import React, { useState } from 'react'
import { ELEMENT_CATEGORIES } from '../data/elementTypes'
import { useBuilder } from '../context/BuilderContext'
import ElementRenderer from './ElementRenderer'
import {
  Sparkles, LayoutTemplate, Type, ImageIcon, Puzzle,
  Menu, Star, Rows3, PanelBottom,
  Heading1, AlignLeft, Quote,
  Image, Play,
  Square, CreditCard, List, Mail, Minus, ArrowUpDown, BarChart2, MessageSquare,
  ChevronRight, Search, Lightbulb,
  BarChart3, Utensils, ChefHat, Moon, Home, TrendingUp,
  Waves, Anchor, Gift, Flower, House, ShoppingBag, Footprints, Palette, MapPin,
} from 'lucide-react'

const ELEMENT_ICONS = {
  // Templates
  'creative-navbar': Palette,
  'creative-hero': Palette,
  'creative-projects': Palette,
  'creative-footer': Palette,
  'solemate-navbar': Footprints,
  'solemate-hero': Footprints,
  'solemate-categories': Footprints,
  'solemate-products': Footprints,
  'solemate-footer': Footprints,
  'product-card-section': ShoppingBag,
  'aether-product-section': ShoppingBag,
  'homehero-navbar': House,
  'homehero-hero': House,
  'present-section': BarChart3,
  'puzzle-navbar': Puzzle,
  'trend-navbar': TrendingUp,
  'puzzle-hero': Puzzle,
  'trend-hero': TrendingUp,
  'food-navbar': Utensils,
  'food-hero': ChefHat,
  'moco-navbar': Moon,
  'moco-hero': Moon,
  'sell-home-section': Home,
  'perks-section': Gift,
  'trusted-brands': House,
  'skyline-hero': Home,
  'veluno-navbar': Star,
  'veluno-hero': Sparkles,
  'winzy-navbar': MapPin,
  'winzy-hero': MapPin,
  'qi-navbar': Flower,
  'qi-hero': Flower,
  'qi-products': Flower,
  'agensea-navbar': Waves,
  'agensea-hero': Anchor,
  'smart-home-dashboard': House,
  'lumora-navbar': ShoppingBag,
  'lumora-hero': Sparkles,
  'lumora-marquee': MessageSquare,
  'lumora-story': Lightbulb,
  'lumora-products': ShoppingBag,
  'lumora-footer': PanelBottom,
  // Sections
  'navbar': Menu,
  'hero': Star,
  'section': Rows3,
  'columns': LayoutTemplate,
  'footer': PanelBottom,
  // Text
  'heading': Heading1,
  'paragraph': AlignLeft,
  'quote': Quote,
  // Media
  'image': Image,
  'video': Play,
  // Components
  'button': Square,
  'card': CreditCard,
  'list': List,
  'form': Mail,
  'divider': Minus,
  'spacer': ArrowUpDown,
  'counter': BarChart2,
  'testimonial': MessageSquare,
}

const CATEGORY_ICONS = {
  'Navbars': Menu,
  'Hero Sections': Star,
  'Features & Content': Sparkles,
  'Products & Store': ShoppingBag,
  'Footers': PanelBottom,
  'Templates': Sparkles,
  'Sections': LayoutTemplate,
  'Text': Type,
  'Media': ImageIcon,
  'Components': Puzzle,
  'Search Results': Search,
}

const DISPLAY_CATEGORIES = []
ELEMENT_CATEGORIES.forEach(cat => {
  if (cat.name === 'Templates') {
    const navbars = cat.elements.filter(el => el.type.endsWith('-navbar') || el.type === 'navbar')
    const heroes = cat.elements.filter(el => el.type.endsWith('-hero') || el.type === 'hero')
    const products = cat.elements.filter(el => el.type.endsWith('-products') || el.type.endsWith('-product-section') || el.type.includes('product') || el.type.includes('categories'))
    const footers = cat.elements.filter(el => el.type.endsWith('-footer') || el.type === 'footer')
    const navbarSet = new Set(navbars.map(el => el.type))
    const heroSet = new Set(heroes.map(el => el.type))
    const productSet = new Set(products.map(el => el.type))
    const footerSet = new Set(footers.map(el => el.type))
    const others = cat.elements.filter(el => !navbarSet.has(el.type) && !heroSet.has(el.type) && !productSet.has(el.type) && !footerSet.has(el.type))
    
    if (navbars.length) DISPLAY_CATEGORIES.push({ name: 'Navbars', elements: navbars, isLarge: true, previewHeight: 80 })
    if (heroes.length) DISPLAY_CATEGORIES.push({ name: 'Hero Sections', elements: heroes, isLarge: true, previewHeight: 180 })
    if (others.length) DISPLAY_CATEGORIES.push({ name: 'Features & Content', elements: others, isLarge: true, previewHeight: 180 })
    if (products.length) DISPLAY_CATEGORIES.push({ name: 'Products & Store', elements: products, isLarge: true, previewHeight: 180 })
    if (footers.length) DISPLAY_CATEGORIES.push({ name: 'Footers', elements: footers, isLarge: true, previewHeight: 80 })
  } else {
    DISPLAY_CATEGORIES.push({ ...cat, isLarge: cat.name === 'Sections' })
  }
})

const S = {
  panel: {
    width: '260px',
    flexShrink: 0,
    minHeight: 0,
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: '4px 0 16px rgba(0,0,0,0.03)',
  },
  header: {
    padding: '14px 16px 10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  searchBox: {
    padding: '10px 12px',
    borderBottom: '1px solid #f0f0f0',
  },
  searchInput: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '0.82rem',
    outline: 'none',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  categoryHeader: () => ({
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#374151',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    userSelect: 'none',
    transition: 'background 0.1s',
  }),
  elementsGrid: (isSingleColumn) => ({
    padding: '12px 10px',
    display: 'grid',
    gridTemplateColumns: isSingleColumn ? '1fr' : '1fr 1fr',
    gap: '10px',
  }),
  elementCard: (isLarge) => ({
    padding: isLarge ? '0' : '10px 6px',
    borderRadius: '10px',
    border: '1px solid #eef2f6',
    cursor: 'grab',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isLarge ? '0' : '4px',
    overflow: 'hidden',
  }),
  elementIcon: {
    fontSize: '1.3rem',
    lineHeight: 1,
  },
  elementLabel: {
    fontSize: '0.72rem',
    color: '#374151',
    fontWeight: '500',
    lineHeight: 1.2,
  },
  emptySearch: {
    padding: '20px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.8rem',
  },
  tip: {
    padding: '12px 14px',
    fontSize: '0.72rem',
    color: '#9ca3af',
    borderTop: '1px solid #f0f0f0',
    lineHeight: 1.5,
    marginTop: 'auto',
  },
}

function ElementCard({ element, onAddClick, isLarge, previewHeight = 180 }) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { viewportWidth } = useBuilder()
  const Icon = ELEMENT_ICONS[element.type]

  const previewWidth = viewportWidth === 'mobile' ? 375 : viewportWidth === 'tablet' ? 768 : 960
  const scaleFactor = 240 / previewWidth

  const thumbnail = !imgError && (element.thumbnail || (element.props && (
    element.props.shStep1Image || 
    element.props.perksImage || 
    element.props.pcImage || 
    element.props.foodHeroImage || 
    element.props.trendProductImage ||
    element.props.qiImage ||
    element.props.slHeroImage ||
    element.props.vlLeftImage ||
    element.props.wzBgImg ||
    (element.props.ccHeroImages && element.props.ccHeroImages[0]) ||
    (element.props.smHeroImages && element.props.smHeroImages[0]) ||
    (element.props.ccProjects && element.props.ccProjects[0]?.image) ||
    element.props.agenseaRow1Image ||
    element.props.shdCameraImage ||
    element.props.hhPortrait1
  )))

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/x-element-type', element.type)
  }

  return (
    <div
      style={{
        ...S.elementCard(isLarge),
        backgroundColor: hovered ? (isLarge ? '#ffffff' : '#f8fafc') : '#ffffff',
        borderColor: hovered ? '#4f46e5' : '#eef2f6',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'none',
        boxShadow: hovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        zIndex: hovered ? 100 : 1,
      }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onAddClick(element)}
      title={`${element.description || element.label} — drag to canvas or click to add`}
    >
      {isLarge && (
        <div style={{
          width: '100%',
          padding: '6px 10px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #eef2f6',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28c840' }} />
          <span style={{ 
            marginLeft: '6px', 
            fontSize: '0.65rem', 
            color: '#94a3b8', 
            fontWeight: '600', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {element.label}
          </span>
        </div>
      )}
      <div style={{ 
        width: '100%', 
        height: isLarge ? `${previewHeight}px` : '64px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: isLarge ? '#ffffff' : '#f9fafb',
        overflow: 'hidden',
        position: 'relative',
        padding: isLarge ? '8px' : '0'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: isLarge ? '6px' : '0',
          overflow: 'hidden',
          boxShadow: isLarge ? '0 8px 16px -4px rgba(0,0,0,0.1)' : 'none',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {isLarge ? (
            <div style={{
              width: `${previewWidth}px`,
              transformOrigin: 'top left',
              transform: `scale(${scaleFactor})`, 
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }}>
              <ElementRenderer element={{...element, id: `panel-prev-${element.type}`}} isPreview />
            </div>
          ) : thumbnail ? (
            <img 
              src={thumbnail} 
              alt="" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: hovered ? 'brightness(1.05) contrast(1.02)' : 'brightness(1)',
                transition: 'all 0.3s ease'
              }} 
              onError={() => setImgError(true)}
            />
          ) : (
            <span style={{ ...S.elementIcon, color: hovered ? '#4f46e5' : '#64748b' }}>
              {Icon ? <Icon size={isLarge ? 28 : 22} strokeWidth={1.5} /> : <span style={{fontSize: '1.2rem'}}>{element.icon}</span>}
            </span>
          )}
        </div>
        {hovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1,
            transition: 'opacity 0.2s',
            zIndex: 10
          }}>
            <div style={{
              padding: '6px 14px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '700',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              transform: 'scale(1)',
              transition: 'transform 0.2s'
            }}>
              Add to Page
            </div>
          </div>
        )}
      </div>
      {!isLarge && <span style={S.elementLabel}>{element.label}</span>}
    </div>
  )
}

export default function ElementsPanel() {
  const { addElement } = useBuilder()
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState(() =>
    DISPLAY_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  )

  const toggleCategory = (name) =>
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }))

  const handleAddClick = (elementDef) => {
    addElement({ type: elementDef.type, props: { ...elementDef.props }, styles: { ...elementDef.styles } })
  }

  const filteredCategories = search.trim()
    ? [
      {
        name: 'Search Results',
        isLarge: true,
        elements: DISPLAY_CATEGORIES.flatMap((cat) => cat.elements).filter(
          (el) =>
            el.label.toLowerCase().includes(search.toLowerCase()) ||
            (el.description || '').toLowerCase().includes(search.toLowerCase())
        ),
      },
    ]
    : DISPLAY_CATEGORIES

  return (
    <div style={S.panel}>
      <div style={S.header}>Elements</div>

      <div style={S.searchBox}>
        <input
          style={S.searchInput}
          placeholder="Search elements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCategories.map((cat) => (
        <div key={cat.name}>
          <div
            style={S.categoryHeader(openCategories[cat.name])}
            onClick={() => toggleCategory(cat.name)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(() => { const CatIcon = CATEGORY_ICONS[cat.name]; return CatIcon ? <CatIcon size={13} strokeWidth={2} style={{ color: '#6b7280' }} /> : null })()}
              {cat.name}
            </span>
            <ChevronRight size={13} style={{ color: '#9ca3af', transform: openCategories[cat.name] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {openCategories[cat.name] !== false && (
            <>
              {cat.elements.length === 0 ? (
                <div style={S.emptySearch}>No elements found</div>
              ) : (
                <div style={S.elementsGrid(cat.isLarge)}>
                  {cat.elements.map((el) => (
                    <ElementCard 
                      key={el.type} 
                      element={el} 
                      onAddClick={handleAddClick} 
                      isLarge={cat.isLarge}
                      previewHeight={cat.previewHeight || 180}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div style={{ ...S.tip, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        <Lightbulb size={13} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
        Drag elements to the canvas, or click to add at the end.
      </div>
    </div>
  )
}
