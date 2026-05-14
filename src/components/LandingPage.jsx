import React, { useState } from 'react';
import { ArrowRight, Play, X, CheckCircle, Layout, Code, Globe, Star, ArrowUpRight } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  // Ticker items
  const tickerItems = ['Drag & Drop', '50+ Templates', 'Code Export', 'Responsive Design', 'SEO Optimized', 'Fast Editing', 'Custom Assets'];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <Star size={20} className="text-orange-500" /> },
    { value: '50+', label: 'Stunning Templates', icon: <Layout size={20} className="text-orange-500" /> },
    { value: '99%', label: 'Code Quality', icon: <Code size={20} className="text-orange-500" /> },
    { value: '1M+', label: 'Sites Exported', icon: <Globe size={20} className="text-orange-500" /> },
  ];

  return (
    <div style={{ position: 'relative', fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif', backgroundColor: '#ffffff', color: '#111827', height: '100dvh', overflowY: 'auto', overflowX: 'hidden' }}>
      
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
          SiteForge
        </div>
        
        <div className="lp-nav-links">
          <span style={{ cursor: 'pointer', color: '#111827', fontWeight: '600' }}>Home</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Templates</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Features</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Pricing</span>
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
      <div style={{ position: 'relative', paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Gradient Mesh Background */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '800px', background: 'radial-gradient(circle at top right, rgba(234, 88, 12, 0.4), rgba(255, 237, 213, 0.5) 40%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '40%', height: '600px', background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.3), rgba(255,255,255,0) 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 90%)', zIndex: 1, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderRadius: '30px', border: '1px solid #e5e7eb', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '600', color: '#111827', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
            SiteForge Builder
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

      {/* About Us / Impact Section */}
      <div className="lp-padding" style={{ background: '#ffffff' }}>
        <div className="lp-about-container">
          <div className="lp-about-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderRadius: '30px', border: '1px solid #e5e7eb', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
              <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
              About SiteForge
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '24px', color: '#111827' }}>
              SiteForge Creates Impactful Digital Strategies For Growth
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '40px', lineHeight: '1.6' }}>
              We're not just another site builder. Our design tools, responsive elements, and clean code export help businesses grow with data-driven insights and bold creativity.
            </p>
            <button 
              onClick={onGetStarted}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(234, 88, 12, 0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(234, 88, 12, 0.2)'; }}
              style={{ padding: '8px 8px 8px 24px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.2)' }}
            >
              About Our Story
              <div style={{ width: '36px', height: '36px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={18} color="#ea580c" />
              </div>
            </button>
          </div>
          
          <div className="lp-stats-grid">
            <div className="lp-stat-center-badge">
              <div style={{ width: '12px', height: '12px', background: '#ea580c', borderRadius: '2px', transform: 'rotate(45deg)' }}></div>
            </div>
            
            <div style={{ padding: '32px 24px', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f3f4f6', transition: 'transform 0.3s ease', cursor: 'default' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: '16px', background: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Layout size={20} className="text-orange-500" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Drag & Drop UI</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>Build layouts visually. Drop pre-made high quality components instantly.</p>
            </div>
            
            <div style={{ padding: '32px 24px', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f3f4f6', transition: 'transform 0.3s ease', cursor: 'default' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: '16px', background: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Code size={20} className="text-orange-500" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Export Code</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>Download perfect, production-ready React JSX or HTML/CSS code in one click.</p>
            </div>

            <div style={{ padding: '32px 24px', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f3f4f6', transition: 'transform 0.3s ease', cursor: 'default' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: '16px', background: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Globe size={20} className="text-orange-500" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Fully Responsive</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>Your generated designs will automatically look perfect on mobile devices.</p>
            </div>

            <div style={{ padding: '32px 24px', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f3f4f6', transition: 'transform 0.3s ease', cursor: 'default' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: '16px', background: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Star size={20} className="text-orange-500" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Premium Templates</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5' }}>Start instantly using our breathtaking and expertly crafted base templates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="lp-padding" style={{ background: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
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
               <img src="https://images.unsplash.com/photo-1542744094-24638ea0b3b5?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Creative digital workspace for web design projects" />
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
      <div className="lp-padding" style={{ background: '#111827', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-watermark-2" aria-hidden="true">
          LATEST PROJECTS
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="lp-services-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
              <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>
              Our Work
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#fff', maxWidth: '500px' }}>
              Discover the Latest Projects Driving Business Growth
            </h2>
          </div>
          
          <div className="lp-projects-grid">
            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="SaaS dashboard template with analytics charts and data visualization" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>SaaS Dashboard</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>Highly scalable layout components designed perfectly for sophisticated dashboard analytics and user interfaces.</p>
               <button onClick={onGetStarted} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>

            <div className="lp-proj-offset" style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="/assets/img/productdesign.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="E-commerce storefront template with product grid and shopping cart" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>E-Commerce Storefront</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>High-conversion focused product grids, features, and fully customizable checkout and shopping cart flows.</p>
               <button onClick={onGetStarted} style={{ marginTop: '20px', background: '#ea580c', border: 'none', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.boxShadow='0 4px 15px rgba(234, 88, 12, 0.4)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>Use Template</button>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ height: '220px', background: '#0f172a', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=600&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="Creative portfolio website template showcasing design work and media" />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Creative Portfolio</h3>
               <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>A bold and elegant modern agency portfolio built to highlight rich media and high resolution creative assets.</p>
               <button onClick={onGetStarted} style={{ marginTop: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 0', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>Use Template</button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
