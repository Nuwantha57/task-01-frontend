# Visual Style Guide - Admin Portal

## Color Palette

### Primary Colors

```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
```

### Text Colors

- Primary Text: `#2c3e50`
- Secondary Text: `#6c757d`
- Disabled Text: `#adb5bd`

### Status Colors

- Success: `#28a745` (Green)
- Error: `#c53030` (Red)
- Warning: `#ffc107` (Yellow)
- Info: `#667eea` (Blue)

## Typography

### Font Families

```css
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'
Code: source-code-pro, Menlo, Monaco, Consolas, 'Courier New'
```

### Font Sizes

- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- H4: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

## Spacing System

### Margin/Padding Scale

- 0.5rem (8px)
- 1rem (16px)
- 1.5rem (24px)
- 2rem (32px)
- 2.5rem (40px)

## Component Styles

### Buttons

#### Primary Button

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
color: white
padding: 1rem 2rem
border-radius: 8px
```

#### Secondary Button

```css
background: white
color: #6c757d
border: 2px solid #dee2e6
padding: 1rem 2rem
border-radius: 8px
```

### Cards

```css
background: white
padding: 2rem
border-radius: 12px
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07)
```

### Input Fields

```css
padding: 0.875rem 1.25rem
border: 2px solid #e9ecef
border-radius: 8px
Focus: border-color: #667eea
```

## Animations

### Hover Effects

- Transform: `translateY(-2px)` to `translateY(-8px)`
- Duration: 0.3s ease

### Fade In

```css
@keyframes fadeIn {
  from: opacity 0, translateY(20px)
  to: opacity 1, translateY(0)
}
Duration: 0.5s ease
```

### Button Hover

```css
transform: translateY(-2px)
box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3)
```

## Responsive Breakpoints

- Mobile: max-width: 768px
- Tablet: max-width: 1024px
- Desktop: 1025px and above

## Icon Usage

### Emoji Icons (Current)

- Home: 🏠
- Profile: 👤
- Users: 👥
- Audit Logs: 📋
- Login: 🔐
- Logout: 🚪
- Save: 💾
- Email: ✉️
- Globe: 🌍

## Layout Patterns

### Page Container

```css
max-width: 1400px
margin: 0 auto
padding: 2rem
```

### Grid Layout (Action Cards)

```css
display: grid
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
gap: 1.5rem
```

### Form Layout

```css
display: flex
flex-direction: column
gap: 1.5rem
```

## Best Practices

1. **Consistency**: Use the same color palette across all pages
2. **Spacing**: Follow the spacing system for margins and padding
3. **Typography**: Stick to the defined font sizes
4. **Shadows**: Use subtle shadows for depth
5. **Animations**: Keep animations smooth and purposeful
6. **Responsive**: Test on mobile, tablet, and desktop
7. **Accessibility**: Ensure proper contrast ratios
8. **Loading States**: Show feedback for async operations
9. **Error Handling**: Display clear error messages
10. **Clean Code**: Keep CSS organized and commented

## Component Examples

### Navigation Bar

- Height: 70px
- Position: Sticky top
- Z-index: 1000
- Gradient background with shadow

### Table Headers

- Gradient background
- White text
- Uppercase labels
- Sticky positioning

### Status Badges

- Inline-block
- Padding: 0.35rem 0.75rem
- Border-radius: 20px
- Font-size: 0.8rem
- Bold text

### Modal/Card Hover

- Initial: box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07)
- Hover: box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1)
- Transform: translateY(-5px)

## Accessibility Guidelines

1. **Color Contrast**: Minimum 4.5:1 for normal text
2. **Focus States**: Visible outline for keyboard navigation
3. **Alt Text**: Provide for all images
4. **ARIA Labels**: Use where appropriate
5. **Semantic HTML**: Use proper heading hierarchy
6. **Keyboard Navigation**: All interactive elements accessible

## Browser Support

- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile Safari: Latest version
- Chrome Mobile: Latest version
