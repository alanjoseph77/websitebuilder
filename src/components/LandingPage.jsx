import React, { useState } from 'react';
import { 
  ArrowRight, Play, X, CheckCircle, Layout, Code, Globe, Star, 
  ArrowUpRight, ArrowDown, Download, FileJson, FileCode2, Image as ImageIcon,
  Sparkles, Palette, Move, Camera, Music, MessageSquare, Gift, Sliders,
  Smile, Share2, Box, Maximize2, Compass, Heart, Menu
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onGoDashboard, onOpenMuseum, hasProjects }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const container = document.querySelector('.lp-scroll-container');
    if (!container) return;
    
    if (id === 'top') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      container.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); // -80px to account for the navbar
    }
  };

  // Ticker items
  const tickerItems = ['Drag & Drop', '50+ Templates', 'Code Export', 'Responsive Design', 'Fast Editing', 'Custom Assets'];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <Star size={20} className="text-orange-500" /> },
    { value: '50+', label: 'Stunning Templates', icon: <Layout size={20} className="text-orange-500" /> },
    { value: '99%', label: 'Code Quality', icon: <Code size={20} className="text-orange-500" /> },
    { value: '1M+', label: 'Sites Exported', icon: <Globe size={20} className="text-orange-500" /> },
  ];

  return (
    <div className="lp-scroll-container" style={{ position: 'relative', fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif', backgroundColor: '#ffffff', color: '#111827', height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .lp-navbar { padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; position: absolute; top: 0; left: 0; right: 0; z-index: 50; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .lp-nav-links { display: flex; gap: 32px; font-weight: 500; font-size: 0.95rem; color: #4b5563; align-items: center; }
        
        .lp-nav-mobile-3d { display: none; }
        .lp-nav-toggle { display: none; }
        .lp-mobile-drawer { display: none; }

        @media (max-width: 960px) { 
          .lp-navbar { padding: 14px 18px; } 
          .lp-nav-links { display: none; } 
          .lp-nav-mobile-3d { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background: linear-gradient(135deg, #ea580c, #c2410c); color: #fff; border: none; border-radius: 20px; font-weight: 700; font-size: 0.8rem; cursor: pointer; box-shadow: 0 4px 12px rgba(234,88,12,0.3); }
          .lp-nav-toggle { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 50%; color: #111827; cursor: pointer; flex-shrink: 0; }
          .lp-mobile-drawer { display: flex; flex-direction: column; gap: 12px; position: fixed; top: 68px; left: 16px; right: 16px; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); border: 1px solid #e5e7eb; border-radius: 20px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.18); z-index: 100; animation: mobile-drop 0.25s ease-out; }
        }
        @media (max-width: 480px) { 
          .lp-brand-tag { display: none; } 
          .lp-nav-editor-text { display: none; }
        }

        @keyframes mobile-drop { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .lp-hero-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 80px; padding: 0 20px; }
        @media (max-width: 1024px) { .lp-hero-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { 
          .lp-hero-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin-top: 36px !important; padding: 0 10px !important; } 
          .lp-hero-img-wrap { height: 135px !important; border-radius: 14px !important; }
          .lp-hero-img-offset-1, .lp-hero-img-offset-2 { transform: translateY(0) !important; }
        }

        .lp-hero-img-wrap { border-radius: 20px; overflow: hidden; height: 260px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%); display: flex; align-items: center; justify-content: center; }
        .lp-hero-img-offset-1 { transform: translateY(-20px); }
        .lp-hero-img-offset-2 { transform: translateY(-10px); }

        .lp-hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; align-items: center; }
        @media (max-width: 520px) {
          .lp-hero-btns { flex-direction: column; width: 100%; max-width: 340px; margin: 0 auto; gap: 12px; }
          .lp-hero-btns > button { width: 100% !important; justify-content: center !important; }
        }

        .lp-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .lp-about-text { text-align: left; }
        @media (max-width: 1024px) { 
          .lp-about-container { grid-template-columns: 1fr; gap: 60px; } 
          .lp-about-text { text-align: center; display: flex; flex-direction: column; align-items: center; } 
        }

        .lp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; position: relative; }
        @media (max-width: 640px) { .lp-stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; } }
        .lp-stat-center-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: #ffffff; border: 2px solid #f3f4f6; border-radius: 50%; z-index: 10; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 640px) { .lp-stat-center-badge { display: none; } }

        .lp-services-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
        .lp-services-header h2 { text-align: right; }
        @media (max-width: 768px) { 
          .lp-services-header { flex-direction: column; align-items: center; gap: 20px; text-align: center; margin-bottom: 36px; } 
          .lp-services-header h2 { text-align: center; } 
        }

        .lp-projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
        .lp-proj-offset { transform: translateY(-20px); }
        @media (max-width: 1024px) { .lp-projects-grid { grid-template-columns: repeat(2, 1fr); } .lp-proj-offset { transform: translateY(0); } }
        @media (max-width: 768px) { .lp-projects-grid { grid-template-columns: 1fr; } }

        .lp-badge { position: absolute; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .lp-badge-1 { top: 25%; left: 10%; background: #ea580c; color: #fff; transform: rotate(-5deg); }
        .lp-badge-2 { top: 15%; right: 15%; background: #fff; border: 1px solid #e5e7eb; color: #111827; transform: rotate(8deg); }
        @media (max-width: 1024px) { .lp-badge-1 { left: 5%; } .lp-badge-2 { right: 5%; } }
        @media (max-width: 768px) { .lp-badge-1, .lp-badge-2 { display: none; } }

        .lp-stack-container { display: flex; justify-content: center; position: relative; height: 500px; }
        .lp-card-1 { position: absolute; top: 0; width: 70%; height: 400px; background: #111827; border-radius: 24px; opacity: 0.9; transform: scale(0.9) translateY(0); transition: all 0.5s ease; overflow: hidden; }
        .lp-card-2 { position: absolute; top: 20px; width: 75%; height: 400px; background: #1e293b; border-radius: 24px; opacity: 0.95; transform: scale(0.95) translateY(20px); transition: all 0.5s ease; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .lp-card-3 { position: absolute; top: 40px; width: 80%; height: 400px; background: #0f172a; border-radius: 24px; transform: scale(1) translateY(40px); transition: all 0.5s ease; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .lp-stack-container:hover .lp-card-1 { transform: scale(0.9) translateY(-20px) rotate(-4deg); opacity: 0.8; }
        .lp-stack-container:hover .lp-card-2 { transform: scale(0.95) translateY(10px) rotate(2deg); opacity: 0.9; }
        .lp-stack-container:hover .lp-card-3 { transform: scale(1.02) translateY(50px); box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
        
        @media (max-width: 1024px) { 
          .lp-card-1 { width: 80%; } .lp-card-2 { width: 85%; } .lp-card-3 { width: 95%; } 
        }
        @media (max-width: 768px) { 
          .lp-stack-container { height: 350px; } 
          .lp-card-1, .lp-card-2 { display: none; } 
          .lp-card-3 { top: 0; width: 100%; transform: none; height: 300px; } 
        }

        .lp-padding { padding: 120px 20px; }
        @media (max-width: 768px) { .lp-padding { padding: 56px 16px !important; } }

        .lp-watermark-1 { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-size: 18vw; font-weight: 900; color: rgba(0,0,0,0.03); white-space: nowrap; pointer-events: none; z-index: 0; margin: 0; }
        .lp-watermark-2 { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); font-size: 15vw; font-weight: 900; color: rgba(255,255,255,0.03); white-space: nowrap; pointer-events: none; z-index: 0; margin: 0; }
        .lp-watermark-museum { position: absolute; top: 120px; left: 50%; transform: translateX(-50%); font-size: 17vw; font-weight: 900; color: rgba(255,255,255,0.02); white-space: nowrap; pointer-events: none; z-index: 0; margin: 0; }
        @media (max-width: 768px) { 
          .lp-watermark-1 { font-size: 24vw; } 
          .lp-watermark-2 { font-size: 18vw; bottom: 0; }
          .lp-watermark-museum { font-size: 22vw; top: 60px; }
        }

        /* 3D Museum Section Styles */
        .lp-museum-showcase { display: grid; grid-template-columns: 1.55fr 1fr; gap: 32px; align-items: stretch; margin-top: 48px; margin-bottom: 64px; }
        @media (max-width: 1024px) { 
          .lp-museum-showcase { grid-template-columns: 1fr; gap: 24px; margin-top: 32px; margin-bottom: 40px; } 
        }

        .lp-museum-preview { position: relative; border-radius: 24px; overflow: hidden; background: #0f1218; border: 1px solid rgba(234, 88, 12, 0.3); box-shadow: 0 25px 60px rgba(0,0,0,0.5); min-height: 440px; display: flex; flex-direction: column; justify-content: flex-end; }
        .lp-museum-preview:hover .lp-museum-bg-img { transform: scale(1.04); }
        .lp-museum-bg-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

        .lp-polaroid-wrap { background: #13161f; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .lp-polaroid-frame { background: #fffdf8; padding: 14px 14px 24px; border-radius: 4px; box-shadow: 0 20px 45px rgba(0,0,0,0.45); transform: rotate(2.5deg); transition: transform 0.4s ease; max-width: 320px; width: 100%; }
        .lp-polaroid-frame:hover { transform: rotate(0deg) scale(1.03); }

        .lp-adv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1100px) { .lp-adv-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
        @media (max-width: 640px) { .lp-adv-grid { grid-template-columns: 1fr; gap: 14px; } }

        .lp-adv-card { background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; position: relative; }
        .lp-adv-card:hover { background: linear-gradient(180deg, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0.02) 100%); border-color: rgba(234, 88, 12, 0.45); transform: translateY(-4px); box-shadow: 0 16px 36px rgba(0,0,0,0.4); }

        .lp-ctrl-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 8px 16px; font-size: 0.85rem; color: #e5e7eb; backdrop-filter: blur(8px); }
        .lp-ctrl-pill kbd { background: #1e1b19; border: 1px solid rgba(234,88,12,0.4); border-radius: 6px; padding: 3px 8px; font-size: 0.75rem; font-family: monospace; color: #ea580c; font-weight: 700; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }

        .lp-museum-btns { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; align-items: center; }
        @media (max-width: 520px) {
          .lp-museum-btns { flex-direction: column; width: 100%; gap: 12px; }
          .lp-museum-btns > button { width: 100% !important; justify-content: center !important; }
        }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
      `}} />

      {/* Navbar */}
      <nav className="lp-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.4rem', color: '#111827', letterSpacing: '-0.5px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }}></div>
          </div>
          SiteForge <span className="lp-brand-tag" style={{ fontSize: '0.8rem', fontWeight: '500', color: '#6b7280', letterSpacing: 'normal', marginTop: '4px' }}>by OTAGA</span>
        </div>
        
        <div className="lp-nav-links">
          <span onClick={() => scrollTo('top')} style={{ cursor: 'pointer', color: '#111827', fontWeight: '600' }}>Home</span>
          <span onClick={() => scrollTo('about')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>About</span>
          <span onClick={() => scrollTo('museum')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>
            3D Museum <span style={{ fontSize: '0.65rem', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>HOT</span>
          </span>
          <span onClick={() => scrollTo('templates')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>Templates</span>
          <span onClick={() => scrollTo('features')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>Features</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quick Mobile 3D Museum Button */}
          <button 
            onClick={onOpenMuseum}
            className="lp-nav-mobile-3d"
            title="Launch 3D Museum"
          >
            <Sparkles size={14} /> 3D Museum
          </button>

          {hasProjects && (
            <button 
              onClick={onGoDashboard}
              style={{ padding: '8px 14px', background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: '30px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              Dashboard
            </button>
          )}

          <button 
            onClick={onGetStarted}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#111827', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            <span className="lp-nav-editor-text">Editor</span> 
            <div style={{ width: '22px', height: '22px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={13} color="#111827" />
            </div>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lp-nav-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lp-mobile-drawer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>Navigation Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div 
              onClick={() => { scrollTo('top'); setMobileMenuOpen(false); }}
              style={{ padding: '12px 14px', borderRadius: '12px', fontWeight: '600', color: '#111827', cursor: 'pointer', background: '#f9fafb' }}
            >
              Home
            </div>
            <div 
              onClick={() => { scrollTo('museum'); setMobileMenuOpen(false); }}
              style={{ padding: '12px 14px', borderRadius: '12px', fontWeight: '700', color: '#ea580c', cursor: 'pointer', background: 'rgba(234, 88, 12, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} /> 3D Celebration Museum
              </span>
              <span style={{ fontSize: '0.7rem', background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>HOT 3D</span>
            </div>
            <div 
              onClick={() => { scrollTo('about'); setMobileMenuOpen(false); }}
              style={{ padding: '12px 14px', borderRadius: '12px', fontWeight: '600', color: '#4b5563', cursor: 'pointer' }}
            >
              About & Code Export
            </div>
            <div 
              onClick={() => { scrollTo('features'); setMobileMenuOpen(false); }}
              style={{ padding: '12px 14px', borderRadius: '12px', fontWeight: '600', color: '#4b5563', cursor: 'pointer' }}
            >
              Features & Solutions
            </div>
            <div 
              onClick={() => { scrollTo('templates'); setMobileMenuOpen(false); }}
              style={{ padding: '12px 14px', borderRadius: '12px', fontWeight: '600', color: '#4b5563', cursor: 'pointer' }}
            >
              Website Templates (50+)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenMuseum(); }}
              style={{ padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(234,88,12,0.3)' }}
            >
              <Sparkles size={16} /> Launch 3D Museum
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onGetStarted(); }}
              style={{ padding: '12px', background: '#111827', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Open Website Editor <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div id="home" style={{ position: 'relative', paddingTop: '130px', paddingBottom: '70px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Gradient Mesh Background */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '800px', background: 'radial-gradient(circle at top right, rgba(234, 88, 12, 0.4), rgba(255, 237, 213, 0.5) 40%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '40%', height: '600px', background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.3), rgba(255,255,255,0) 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 90%)', zIndex: 1, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderRadius: '30px', border: '1px solid #e5e7eb', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '600', color: '#111827', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
            SiteForge Builder by OTAGA
          </div>

          <h1 style={{ fontSize: 'clamp(2.3rem, 6.5vw, 5.5rem)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.03em', marginBottom: '24px', color: '#111827' }}>
            We Design Digital <br /> Experiences That <br /> <span style={{ position: 'relative' }}>
              Drive Growth.
              <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '12px' }} viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10" fill="none" stroke="#ea580c" strokeWidth="3" />
              </svg>
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#4b5563', maxWidth: '550px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            From branding to websites, we help ambitious companies turn ideas into measurable success without writing code.
          </p>

          <div className="lp-hero-btns">
            <button 
              onClick={onGetStarted}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(234, 88, 12, 0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(234, 88, 12, 0.2)'; }}
              style={{ padding: '8px 8px 8px 24px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.2)' }}
            >
              Start Your Project 
              <div style={{ width: '36px', height: '36px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={18} color="#ea580c" />
              </div>
            </button>
            <button 
              onClick={onOpenMuseum}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.18)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
              style={{ padding: '8px 24px', background: '#ffffff', color: '#111827', border: '1px solid #d1d5db', borderRadius: '30px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease', minHeight: '52px' }}
            >
              <Sparkles size={18} color="#ea580c" />
              Explore 3D Museum
            </button>
          </div>
          <div style={{ marginTop: '16px' }}>
            <span 
              onClick={() => scrollTo('museum')} 
              style={{ cursor: 'pointer', color: '#ea580c', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              onMouseOver={e => e.currentTarget.style.color = '#c2410c'}
              onMouseOut={e => e.currentTarget.style.color = '#ea580c'}
            >
              Discover all 3D Museum advantages & interactive features ↓
            </span>
          </div>

          {/* Floating Badges */}
          <div className="lp-badge lp-badge-1">Fast Tool</div>
          <div className="lp-badge lp-badge-2">Expert</div>

          {/* Hero Images Grid */}
          <div className="lp-hero-grid">
            <div className="lp-hero-img-wrap">
              <img src="/assets/img/landing2.png" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }} alt="SiteForge drag-and-drop website builder interface on laptop" />
            </div>
            <div className="lp-hero-img-wrap lp-hero-img-offset-1">
              <img src="/assets/img/landing3.png" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }} alt="Responsive website preview across desktop and mobile devices" />
            </div>
            <div className="lp-hero-img-wrap">
              <img src="/assets/img/productdesign.png" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '32px' }} alt="Product design template built with SiteForge builder" />
            </div>
            <div className="lp-hero-img-wrap lp-hero-img-offset-2">
              <img src="/assets/img/landing5.png" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }} alt="Mobile-optimized website layout created in SiteForge" />
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ padding: '30px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', background: '#ffffff', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'marquee 30s linear infinite', gap: '40px' }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', fontSize: '1.1rem', fontWeight: '700', color: '#111827', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Star size={20} className="text-orange-500" fill="#ea580c" color="#ea580c" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Killer Feature: Download Code */}
      <div id="about" className="lp-padding" style={{ background: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1', color: '#111827', marginBottom: '20px' }}>
            BUILD VISUALLY
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <ArrowDown size={40} color="#ea580c" />
          </div>

          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1', color: '#111827', marginBottom: '40px' }}>
            DOWNLOAD CODE
          </h2>

          <div style={{ 
            background: '#111827', borderRadius: '24px', padding: '40px', 
            maxWidth: '500px', margin: '0 auto 40px auto', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'left',
            fontFamily: '"Fira Code", monospace', color: '#e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Download size={24} color="#ea580c" />
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>website.zip</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4b5563' }}>├──</span>
                <FileCode2 size={20} color="#3b82f6" />
                <span>index.html</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4b5563' }}>├──</span>
                <FileJson size={20} color="#8b5cf6" />
                <span>styles.css</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4b5563' }}>├──</span>
                <FileCode2 size={20} color="#eab308" />
                <span>script.js</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4b5563' }}>└──</span>
                <ImageIcon size={20} color="#10b981" />
                <span>images/</span>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            No lock-in. Your website belongs to you.
          </h3>
          <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Unlike other visual builders that hold your site hostage, SiteForge gives you production-ready, clean code that you can host anywhere, modify anytime, and own forever.
          </p>

        </div>
      </div>

      {/* Services Section */}
      <div id="features" className="lp-padding" style={{ background: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-watermark-1" aria-hidden="true">
          OUR SERVICES
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="lp-services-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderRadius: '30px', border: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
              <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
              Our Features
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#111827', maxWidth: '400px' }}>
              Our Expertise & Solutions
            </h2>
          </div>

          <div className="lp-stack-container">
            {/* Stacked Cards */}
            <div className="lp-card-1">
               <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Creative digital workspace for web design projects" />
            </div>
            <div className="lp-card-2">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} alt="Analytics dashboard showing website performance metrics" />
            </div>
            <div className="lp-card-3">
              <img src="/assets/img/product.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SiteForge product design interface showcasing visual editing tools" />
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Product Design</h3>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                     onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                     onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <ArrowUpRight size={24} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Celebration Museum Section */}
      <div id="museum" className="lp-padding" style={{ background: 'linear-gradient(180deg, #090b10 0%, #11141c 50%, #0d0f15 100%)', position: 'relative', overflow: 'hidden', color: '#f3f4f6', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        
        {/* Ambient Glows & Watermark */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '500px', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.12) 0%, rgba(212, 175, 55, 0.06) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: '40%', height: '400px', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>
        <div className="lp-watermark-museum" aria-hidden="true">
          3D MUSEUM
        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 20px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(234, 88, 12, 0.12)', border: '1px solid rgba(234, 88, 12, 0.35)', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              <Sparkles size={16} /> Revolutionary 3D WebGL Space
            </div>
            
            <h2 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: '900', lineHeight: '1.08', letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 20px 0' }}>
              Walkable 3D Celebration Museum
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: '#9ca3af', lineHeight: '1.65', margin: '0 auto 36px auto', maxWidth: '720px' }}>
              Step inside a living digital celebration hall designed for <strong style={{ color: '#fff' }}>Weddings</strong>, <strong style={{ color: '#fff' }}>Birthdays</strong>, and <strong style={{ color: '#fff' }}>Milestone Events</strong>. Stroll with custom 3D avatars, admire illuminated photograph galleries, dance to ambient music, and capture instant Polaroid keepsakes — directly in any web browser with zero installs.
            </p>

            <div className="lp-museum-btns" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                onClick={onOpenMuseum}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 32px', 
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: '#ffffff', 
                  borderRadius: '32px', border: 'none', fontWeight: '700', fontSize: '1.05rem', 
                  cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 28px rgba(234, 88, 12, 0.35)' 
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(234, 88, 12, 0.5)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(234, 88, 12, 0.35)'; }}
              >
                <Play size={20} fill="#fff" />
                Launch 3D Museum
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('museum-advantages');
                  if (el) {
                    const c = document.querySelector('.lp-scroll-container');
                    if (c) c.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                  }
                }}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 26px', 
                  background: 'rgba(255,255,255,0.06)', color: '#f3f4f6', borderRadius: '32px', 
                  border: '1px solid rgba(255,255,255,0.15)', fontWeight: '600', fontSize: '1rem', 
                  cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' 
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                Explore Advantages & Controls ↓
              </button>
            </div>
          </div>

          {/* Interactive Showcase Dual Cards */}
          <div className="lp-museum-showcase">
            
            {/* Main Interactive Preview Card */}
            <div className="lp-museum-preview">
              <img 
                src="/assets/img/museum_preview.jpg" 
                alt="3D Walkable Celebration Museum Interior Hall with golden skylights, framed photographs and anime lighting" 
                className="lp-museum-bg-img"
              />
              {/* Gradient Scrim */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,16,24,0.3) 0%, rgba(13,16,24,0.1) 40%, rgba(13,16,24,0.92) 85%, #0d1018 100%)', pointerEvents: 'none' }}></div>

              {/* Top Floating Badges */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', zIndex: 5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,18,24,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>
                  Live Walkable 3D Gallery
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,18,24,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(234,88,12,0.4)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700', color: '#fb923c' }}>
                  <Palette size={14} /> Painted Anime Shader [P]
                </div>
              </div>

              {/* Bottom Card Content */}
              <div style={{ position: 'relative', zIndex: 5, padding: '32px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.12em', color: '#fbbf24', textTransform: 'uppercase' }}>
                  Grand Architecture · Interactive WebGL
                </span>
                <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: '800', color: '#fff', margin: '6px 0 12px 0' }}>
                  The Celebration Grand Hall
                </h3>
                <p style={{ color: '#d1d5db', fontSize: '0.98rem', lineHeight: '1.55', margin: '0 0 20px 0', maxWidth: '580px' }}>
                  Walk across parquet floors under vaulted timber ceilings with fairy lights, interact with high-definition framed portraits, admire the centerpiece altar, and read heartfelt wishes from friends and family.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={onOpenMuseum}
                    style={{ 
                      padding: '12px 24px', background: '#ea580c', color: '#fff', 
                      borderRadius: '30px', border: 'none', fontWeight: '700', fontSize: '0.95rem', 
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', 
                      transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(234,88,12,0.4)' 
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#f97316'}
                    onMouseOut={e => e.currentTarget.style.background = '#ea580c'}
                  >
                    Enter Live 3D Space <ArrowRight size={16} />
                  </button>
                  <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                    Works smoothly on Chrome, Safari, Edge, iOS & Android
                  </span>
                </div>
              </div>
            </div>

            {/* Virtual Photobooth Souvenir Card */}
            <div className="lp-polaroid-wrap">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', fontWeight: '600', color: '#fb923c', marginBottom: '20px' }}>
                <Camera size={14} /> Virtual Photobooth Souvenir
              </div>

              {/* Physical Polaroid Mockup */}
              <div className="lp-polaroid-frame">
                <img 
                  src="/assets/img/museum_polaroid.jpg" 
                  alt="Anime couple in celebration wedding attire posing in photobooth" 
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px', border: '1px solid #eee' }}
                />
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Pinyon Script", "Caveat", cursive, serif', fontSize: '1.45rem', color: '#1f2937', lineHeight: '1.2' }}>
                    A Day to Remember ♥
                  </div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280', marginTop: '4px' }}>
                    Celebration Keepsake
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center', width: '100%' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
                  Snap & Download Instant Photos
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: '1.5', margin: '0 auto 16px auto', maxWidth: '320px' }}>
                  Stand under the celebration floral arch, trigger the vintage flash effect, and generate authentic Polaroid souvenirs with date stamp.
                </p>
                <button 
                  onClick={onOpenMuseum}
                  style={{ 
                    padding: '9px 20px', background: 'transparent', color: '#fb923c', 
                    borderRadius: '20px', border: '1px solid rgba(234, 88, 12, 0.4)', 
                    fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(234, 88, 12, 0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Pose in the Photobooth →
                </button>
              </div>
            </div>

          </div>

          {/* Section: The Advantages & Key Features */}
          <div id="museum-advantages" style={{ paddingTop: '20px', marginBottom: '56px' }}>
            
            {/* Mobile Touch Mode Optimization Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(234, 88, 12, 0.12)', border: '1px solid rgba(234, 88, 12, 0.35)', borderRadius: '18px', padding: '16px 20px', marginBottom: '28px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', boxShadow: '0 4px 12px rgba(234,88,12,0.4)' }}>
                <Move size={20} />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fed7aa', lineHeight: '1.5' }}>
                <strong style={{ color: '#fff', display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>📱 100% Mobile & Touch Friendly</strong>
                On phones and tablets, a responsive on-screen virtual joystick appears automatically on the left to walk, with 360° swipe camera looking and pinch-to-zoom!
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ea580c' }}>
                  Unmatched Immersion
                </span>
                <h3 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  Why Experience The 3D Museum?
                </h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.98rem', maxWidth: '440px', margin: 0 }}>
                Every element is designed to make digital celebrations feel real, personal, and profoundly memorable.
              </p>
            </div>

            {/* 8 Advantages Cards Grid */}
            <div className="lp-adv-grid">
              
              {/* Advantage 1 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Move size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    Walkable 3D Freedom
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Move throughout the gallery freely with WASD/arrow keys or an intuitive on-screen touch joystick on smartphones.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  WASD & Mobile Joystick
                </div>
              </div>

              {/* Advantage 2 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Palette size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    Painted Anime Look
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Press <kbd style={{ background: '#000', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '1px 5px', color: '#fbbf24', fontSize: '0.75rem' }}>P</kbd> to switch into a warm, cel-shaded anime aesthetic with hand-drawn ink contours and Studio Ghibli warmth.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Instant Cel-Shading Toggle
                </div>
              </div>

              {/* Advantage 3 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Smile size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    3D VRM Avatars & Dance
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Walk as customizable 3D characters. Sit together on the gallery bench, talk, hold hands, or dance by pressing <kbd style={{ background: '#000', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '1px 5px', color: '#fbbf24', fontSize: '0.75rem' }}>G</kbd>.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Full Skeletal Emotes & Retargeting
                </div>
              </div>

              {/* Advantage 4 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Gift size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    3 Celebration Themes
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Switch in seconds between Weddings (ring altar & petals), Birthdays (cake, candles & balloons), and Baby Showers (floating musical mobile).
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Wedding · Birthday · Baby Shower
                </div>
              </div>

              {/* Advantage 5 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Camera size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    9-Frame Lightbox Gallery
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    9 illuminated artwork frames invite guests to step up and open a full-resolution modal lightbox view, alongside a live cinema slideshow screen.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Interactive Modal Lightbox
                </div>
              </div>

              {/* Advantage 6 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <MessageSquare size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    Interactive Wishes Easel
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Guests can walk up to an artist's easel to post heartfelt messages and greetings that pin onto the celebration board in real time.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Visitor Guestbook
                </div>
              </div>

              {/* Advantage 7 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Sliders size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    Zero-Code Personalization
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Tweak names, venue, date, captions, custom uploaded photos, and avatar clothing colors directly from the live in-museum personalization sheet.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live In-Game Editor
                </div>
              </div>

              {/* Advantage 8 */}
              <div className="lp-adv-card">
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: '#fb923c' }}>
                    <Share2 size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                    Zero Installs & Link Sharing
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: '1.55', margin: 0 }}>
                    Built with pure WebGL and Three.js. Share a single web link with friends and family across the globe with zero app downloads or VR gear.
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontWeight: '700', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  100% WebGL In-Browser
                </div>
              </div>

            </div>
          </div>

          {/* Keyboard & Touch Quick Controls Guide */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px 30px', marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={20} color="#fb923c" />
                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>Interactive Controls Cheat Sheet</span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Desktop & Mobile touch controls automatically supported</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div className="lp-ctrl-pill"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> <span>Walk Character</span></div>
              <div className="lp-ctrl-pill"><kbd>Drag</kbd> <span>Look 360°</span></div>
              <div className="lp-ctrl-pill"><kbd>P</kbd> <span>Toggle Painted Shading</span></div>
              <div className="lp-ctrl-pill"><kbd>T</kbd> <span>Time of Day (Sun / Night)</span></div>
              <div className="lp-ctrl-pill"><kbd>M</kbd> <span>Music Soundtrack</span></div>
              <div className="lp-ctrl-pill"><kbd>G</kbd> <span>Dance Together</span></div>
              <div className="lp-ctrl-pill"><kbd>F</kbd> <span>Interact / Lightbox / Photo</span></div>
            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(234,88,12,0.15) 0%, rgba(20,24,34,0.9) 50%, rgba(212,175,55,0.12) 100%)', 
            border: '1px solid rgba(234, 88, 12, 0.4)', borderRadius: '28px', padding: '48px 36px', 
            textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' 
          }}>
            <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', color: '#fff', margin: '0 0 14px 0' }}>
              Ready to Step Into Your 3D Celebration?
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#d1d5db', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
              Explore the demo hall now, personalize your celebration details, or create your website with SiteForge.
            </p>
            <div className="lp-museum-btns" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={onOpenMuseum}
                style={{ 
                  padding: '14px 34px', background: '#ea580c', color: '#fff', 
                  borderRadius: '30px', border: 'none', fontWeight: '700', fontSize: '1.05rem', 
                  cursor: 'pointer', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(234, 88, 12, 0.55)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.4)'; }}
              >
                <Sparkles size={18} /> Enter 3D Museum Now
              </button>
              <button 
                onClick={onGetStarted}
                style={{ 
                  padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: '#fff', 
                  borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '600', fontSize: '1rem', 
                  cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(8px)'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                Create a Website With SiteForge
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Projects Section (Dark) */}
      <div id="templates" className="lp-padding" style={{ background: '#111827', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-watermark-2" aria-hidden="true">
          WEBSITE TEMPLATES
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="lp-services-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
              <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
              Templates
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#fff', maxWidth: '500px' }}>
              Start With Fully Built Website Templates
            </h2>
          </div>
          
          <div className="lp-projects-grid">
            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Trend Fashion Apparel Store" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Trend - Fashion Apparel</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>Modern, minimalistic fashion storefront template with clean typography and elegant imagery.</p>
               <button onClick={() => onGetStarted('trend')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>

            <div className="lp-proj-offset" style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="SoleMate Sneaker Store" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>SoleMate - E-Commerce</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>High-conversion sneaker store layout featuring dynamic product grids, categories, and shopping flow.</p>
               <button onClick={() => onGetStarted('ecommerce')} style={{ marginTop: '20px', background: '#ea580c', border: 'none', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.boxShadow='0 4px 15px rgba(234, 88, 12, 0.4)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>Use Template</button>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Creative Studio Portfolio" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Studio - Creative Portfolio</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>A bold, elegant modern agency portfolio built to highlight rich media and high-resolution creative assets.</p>
               <button onClick={() => onGetStarted('portfolio')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>
            
            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="/assets/img/make_preview.png" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Make.com Automation Builder Mockup" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Make - Automation Builder</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>A visual workflow automation tool template inspired by platforms like Make.com.</p>
               <button onClick={() => onGetStarted('make')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>

            <div className="lp-proj-offset" style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Lumora Mobile App Showcase" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Lumora - App Showcase</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>High-converting mobile app showcase template with marquee features and download CTAs.</p>
               <button onClick={() => onGetStarted('app')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Foodies Delivery App" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Foodies - Delivery App</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>Vibrant, appetizing layout designed for restaurants, food delivery services, and culinary brands.</p>
               <button onClick={() => onGetStarted('food')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Pricing Section Placeholder (Hidden for now)
      <div id="pricing" className="lp-padding" style={{ background: '#ffffff', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderRadius: '30px', border: '1px solid #e5e7eb', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
          <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
          Pricing
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#111827', marginBottom: '20px' }}>
          Simple, transparent pricing
        </h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px' }}>
          Start building for free, then upgrade when you're ready to publish and scale.
        </p>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#f9fafb', padding: '40px', borderRadius: '24px', border: '1px solid #e5e7eb', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Starter</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>$0 <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Access all elements</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Standard templates</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Free subdomain</li>
            </ul>
            <button onClick={onGetStarted} style={{ width: '100%', padding: '12px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#d1d5db'} onMouseOut={e=>e.currentTarget.style.borderColor='#e5e7eb'}>Get Started Free</button>
          </div>
          <div style={{ background: '#111827', padding: '40px', borderRadius: '24px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#ea580c', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Pro</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>$19 <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Everything in Starter</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Custom domains</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle size={18} color="#ea580c" /> Export to React/HTML</li>
            </ul>
            <button onClick={onGetStarted} style={{ width: '100%', padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>Upgrade to Pro</button>
          </div>
        </div>
      </div>
      */}

    </div>
  );
}