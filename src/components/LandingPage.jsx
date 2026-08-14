import React, { useState } from 'react';
import { ArrowRight, Play, X, CheckCircle, Layout, Code, Globe, Star, ArrowUpRight, ArrowDown, Download, FileJson, FileCode2, Image as ImageIcon } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
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
        .lp-nav-links { display: flex; gap: 32px; font-weight: 500; font-size: 0.95rem; color: #4b5563; }
        @media (max-width: 768px) { .lp-nav-links { display: none; } }

        .lp-hero-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 80px; padding: 0 20px; }
        @media (max-width: 1024px) { .lp-hero-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .lp-hero-grid { grid-template-columns: 1fr; } }

        .lp-hero-img-wrap { border-radius: 20px; overflow: hidden; height: 260px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%); display: flex; align-items: center; justify-content: center; }
        .lp-hero-img-offset-1 { transform: translateY(-20px); }
        .lp-hero-img-offset-2 { transform: translateY(-10px); }
        @media (max-width: 600px) { .lp-hero-img-offset-1, .lp-hero-img-offset-2 { transform: translateY(0); } .lp-hero-img-wrap { height: 200px; } }

        .lp-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .lp-about-text { text-align: left; }
        @media (max-width: 1024px) { 
          .lp-about-container { grid-template-columns: 1fr; gap: 60px; } 
          .lp-about-text { text-align: center; display: flex; flex-direction: column; align-items: center; } 
        }

        .lp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; position: relative; }
        @media (max-width: 640px) { .lp-stats-grid { grid-template-columns: 1fr; } }
        .lp-stat-center-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: #ffffff; border: 2px solid #f3f4f6; border-radius: 50%; z-index: 10; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 640px) { .lp-stat-center-badge { display: none; } }

        .lp-services-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
        .lp-services-header h2 { text-align: right; }
        @media (max-width: 768px) { 
          .lp-services-header { flex-direction: column; align-items: center; gap: 20px; text-align: center; } 
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
        @media (max-width: 768px) { .lp-padding { padding: 80px 20px; } }

        .lp-watermark-1 { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-size: 18vw; font-weight: 900; color: rgba(0,0,0,0.03); white-space: nowrap; pointer-events: none; z-index: 0; margin: 0; }
        .lp-watermark-2 { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); font-size: 15vw; font-weight: 900; color: rgba(255,255,255,0.03); white-space: nowrap; pointer-events: none; z-index: 0; margin: 0; }
        @media (max-width: 768px) { 
          .lp-watermark-1 { font-size: 24vw; } 
          .lp-watermark-2 { font-size: 18vw; bottom: 0; }
        }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      `}} />

      {/* Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.4rem', color: '#111827', letterSpacing: '-0.5px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }}></div>
          </div>
          SiteForge <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#6b7280', letterSpacing: 'normal', marginTop: '4px' }}>by OTAGA</span>
        </div>
        
        <div className="lp-nav-links">
          <span onClick={() => scrollTo('top')} style={{ cursor: 'pointer', color: '#111827', fontWeight: '600' }}>Home</span>
          <span onClick={() => scrollTo('about')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>About</span>
          <span onClick={() => scrollTo('templates')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>Templates</span>
          <span onClick={() => scrollTo('features')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#ea580c'} onMouseOut={e=>e.currentTarget.style.color='inherit'}>Features</span>
        </div>

        <button 
          onClick={onGetStarted}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#111827', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          Open Editor 
          <div style={{ width: '24px', height: '24px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={14} color="#111827" />
          </div>
        </button>
      </nav>

      {/* Hero Section */}
      <div id="home" style={{ position: 'relative', paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', overflow: 'hidden' }}>
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

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.03em', marginBottom: '24px', color: '#111827' }}>
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

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
