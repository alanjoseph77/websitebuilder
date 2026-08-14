import { normalizeHref, escHtml } from '../utils';
import { generateElementHTML, stylesToInline, getSidebarIconSVG } from '../../codeGenerator';

export function form(el, idx, allPages) {
  const { type, props = {}, styles = {} } = el;
  const inlineStyle = stylesToInline(styles);
  const sAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
  

  return `<section class="form-section"${sAttr}>
  ${props.title ? `<h2>${escHtml(props.title)}</h2>` : ''}
  ${props.subtitle ? `<p class="form-subtitle">${escHtml(props.subtitle)}</p>` : ''}
  <form class="contact-form" method="post">
    <div class="form-group">
      <label for="name">Full Name</label>
      <input type="text" id="name" name="name" placeholder="John Doe" required />
    </div>
    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="john@example.com" required />
    </div>
    <div class="form-group">
      <label for="subject">Subject</label>
      <input type="text" id="subject" name="subject" placeholder="How can we help?" />
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">${escHtml(props.submitText || 'Send Message')}</button>
  </form>
</section>`
}
