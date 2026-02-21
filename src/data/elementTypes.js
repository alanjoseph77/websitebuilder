export const ELEMENT_CATEGORIES = [
  {
    name: 'Sections',
    icon: '⊞',
    elements: [
      {
        type: 'navbar',
        label: 'Navbar',
        icon: '☰',
        description: 'Navigation bar',
        props: {
          brand: 'MyBrand',
          navLayout: 'classic',
          navLinkStyle: 'plain',
          navEffect: 'none',
          links: [
            { text: 'Home', href: '#' },
            { text: 'About', href: '#about' },
            { text: 'Services', href: '#services' },
            { text: 'Contact', href: '#contact' },
          ],
        },
        styles: {
          backgroundColor: '#1a1a2e',
          color: '#ffffff',
          padding: '16px 40px',
          fontSize: '1rem',
        },
      },
      {
        type: 'hero',
        label: 'Hero',
        icon: '⭐',
        description: 'Full-width hero section',
        props: {
          title: 'Welcome to Our Website',
          subtitle: 'We create amazing digital experiences for your business.',
          buttonText: 'Get Started',
          buttonHref: '#',
          buttonSecondaryText: 'Learn More',
          buttonSecondaryHref: '#about',
        },
        styles: {
          backgroundColor: '#1a1a2e',
          color: '#ffffff',
          padding: '100px 40px',
          textAlign: 'center',
          minHeight: '500px',
        },
      },
      {
        type: 'section',
        label: 'Section',
        icon: '▬',
        description: 'Generic section container',
        props: {
          title: 'Section Title',
          subtitle: 'Add your content here.',
          layout: 'stack',
          gap: '24px',
        },
        styles: {
          backgroundColor: '#ffffff',
          color: '#333333',
          padding: '60px 40px',
          textAlign: 'center',
        },
      },
      {
        type: 'columns',
        label: '3 Columns',
        icon: '⊟',
        description: 'Three-column layout',
        props: {
          columns: [
            { icon: '🚀', title: 'Feature One', text: 'Describe your feature here.' },
            { icon: '💡', title: 'Feature Two', text: 'Describe your feature here.' },
            { icon: '🛡️', title: 'Feature Three', text: 'Describe your feature here.' },
          ],
        },
        styles: {
          backgroundColor: '#f8f9fa',
          color: '#333333',
          padding: '60px 40px',
        },
      },
      {
        type: 'footer',
        label: 'Footer',
        icon: '⬛',
        description: 'Page footer',
        props: {
          brand: 'MyBrand',
          tagline: 'Building amazing things.',
          copyright: `© ${new Date().getFullYear()} MyBrand. All rights reserved.`,
          links: [
            { text: 'Privacy', href: '#' },
            { text: 'Terms', href: '#' },
            { text: 'Contact', href: '#' },
          ],
        },
        styles: {
          backgroundColor: '#1a1a2e',
          color: '#cccccc',
          padding: '40px',
          textAlign: 'center',
        },
      },
    ],
  },
  {
    name: 'Text',
    icon: 'T',
    elements: [
      {
        type: 'heading',
        label: 'Heading',
        icon: 'H',
        description: 'Title heading',
        props: { text: 'Your Heading Here', level: 'h2' },
        styles: {
          color: '#1a1a2e',
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'left',
          padding: '20px 40px 10px',
          lineHeight: '1.2',
          fontFamily: 'inherit',
        },
      },
      {
        type: 'paragraph',
        label: 'Paragraph',
        icon: '¶',
        description: 'Text paragraph',
        props: { text: 'Add your paragraph text here. Click to select and edit in the properties panel.' },
        styles: {
          color: '#555555',
          fontSize: '1rem',
          textAlign: 'left',
          padding: '10px 40px',
          lineHeight: '1.7',
          fontFamily: 'inherit',
        },
      },
      {
        type: 'quote',
        label: 'Quote',
        icon: '"',
        description: 'Blockquote',
        props: {
          text: 'The best way to predict the future is to create it.',
          author: '— Peter Drucker',
        },
        styles: {
          backgroundColor: '#f0f4ff',
          color: '#1a1a2e',
          padding: '30px 50px',
          borderLeft: '4px solid #4f6ef7',
          fontStyle: 'italic',
          fontSize: '1.2rem',
          margin: '20px 40px',
        },
      },
    ],
  },
  {
    name: 'Media',
    icon: '🖼',
    elements: [
      {
        type: 'image',
        label: 'Image',
        icon: '🖼',
        description: 'Image element',
        props: {
          src: 'https://placehold.co/800x400/4f6ef7/ffffff?text=Your+Image',
          alt: 'Image description',
          caption: '',
        },
        styles: {
          width: '100%',
          textAlign: 'center',
          padding: '20px 40px',
        },
      },
      {
        type: 'video',
        label: 'Video',
        icon: '▶',
        description: 'YouTube/Vimeo embed',
        props: {
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          title: 'Video',
        },
        styles: {
          padding: '20px 40px',
          textAlign: 'center',
          backgroundColor: '#000000',
        },
      },
    ],
  },
  {
    name: 'Components',
    icon: '🧩',
    elements: [
      {
        type: 'button',
        label: 'Button',
        icon: '⬤',
        description: 'Clickable button',
        props: {
          text: 'Click Me',
          href: '#',
          variant: 'primary',
        },
        styles: {
          padding: '20px 40px',
          textAlign: 'center',
        },
      },
      {
        type: 'card',
        label: 'Card',
        icon: '🃏',
        description: 'Content card',
        props: {
          image: 'https://placehold.co/400x200/4f6ef7/ffffff?text=Card+Image',
          title: 'Card Title',
          text: 'A short description of the card content goes here.',
          buttonText: 'Read More',
          buttonHref: '#',
        },
        styles: {
          padding: '20px 40px',
          backgroundColor: '#f8f9fa',
        },
      },
      {
        type: 'list',
        label: 'List',
        icon: '☰',
        description: 'Bulleted/numbered list',
        props: {
          variant: 'ul',
          items: ['First item', 'Second item', 'Third item', 'Fourth item'],
        },
        styles: {
          color: '#333333',
          fontSize: '1rem',
          padding: '20px 40px 20px 60px',
          lineHeight: '1.8',
        },
      },
      {
        type: 'form',
        label: 'Contact Form',
        icon: '📧',
        description: 'Contact/email form',
        props: {
          title: 'Get In Touch',
          subtitle: 'Fill out the form below and we\'ll get back to you.',
          submitText: 'Send Message',
        },
        styles: {
          backgroundColor: '#f8f9fa',
          padding: '60px 40px',
          textAlign: 'center',
        },
      },
      {
        type: 'divider',
        label: 'Divider',
        icon: '—',
        description: 'Horizontal rule',
        props: { style: 'solid' },
        styles: {
          padding: '10px 40px',
          color: '#dddddd',
        },
      },
      {
        type: 'spacer',
        label: 'Spacer',
        icon: '↕',
        description: 'Empty space',
        props: { height: '60px' },
        styles: {},
      },
      {
        type: 'counter',
        label: 'Stats',
        icon: '📊',
        description: 'Statistics/counters',
        props: {
          stats: [
            { number: '10K+', label: 'Happy Clients' },
            { number: '500+', label: 'Projects Done' },
            { number: '99%', label: 'Satisfaction' },
            { number: '24/7', label: 'Support' },
          ],
        },
        styles: {
          backgroundColor: '#4f6ef7',
          color: '#ffffff',
          padding: '60px 40px',
          textAlign: 'center',
        },
      },
      {
        type: 'testimonial',
        label: 'Testimonial',
        icon: '💬',
        description: 'Customer testimonial',
        props: {
          text: 'This product completely changed our workflow. Absolutely amazing!',
          author: 'Jane Smith',
          role: 'CEO, TechCorp',
          avatar: 'https://placehold.co/80x80/4f6ef7/ffffff?text=JS',
        },
        styles: {
          backgroundColor: '#f8f9fa',
          padding: '60px 40px',
          textAlign: 'center',
        },
      },
    ],
  },
]

export const ALL_ELEMENT_TYPES = ELEMENT_CATEGORIES.flatMap((cat) => cat.elements)

export function getElementDefault(type) {
  return ALL_ELEMENT_TYPES.find((el) => el.type === type) || null
}
