# 🎨 Paleta de Cores - Apple Premium Design System

## Light Mode

```css
:root {
  /* Base */
  --background: 0 0% 100%;
  --foreground: 0 0% 8%;

  /* Cards e Popovers */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 8%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 8%;

  /* Primary (Preto/Branco) */
  --primary: 0 0% 8%;
  --primary-foreground: 0 0% 100%;

  /* Secondary */
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 8%;

  /* Muted (Textos secundários) */
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 40%;

  /* Accent (Dourado) */
  --accent: 45 80% 50%;
  --accent-foreground: 0 0% 8%;

  /* Destructive (Vermelho) */
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  /* Bordas e Inputs */
  --border: 0 0% 92%;
  --input: 0 0% 92%;
  --ring: 45 80% 50%;

  /* Premium Tokens */
  --gold: 45 80% 50%;
  --gold-hover: 45 80% 45%;
  --gold-light: 45 80% 97%;
  --surface: 0 0% 98%;
  --surface-elevated: 0 0% 100%;

  --radius: 0.75rem;
}
```

---

## Dark Mode

```css
.dark {
  /* Base */
  --background: 0 0% 4%;
  --foreground: 0 0% 96%;

  /* Cards e Popovers */
  --card: 0 0% 7%;
  --card-foreground: 0 0% 96%;
  --popover: 0 0% 7%;
  --popover-foreground: 0 0% 96%;

  /* Primary (invertido) */
  --primary: 0 0% 96%;
  --primary-foreground: 0 0% 4%;

  /* Secondary */
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 96%;

  /* Muted */
  --muted: 0 0% 14%;
  --muted-foreground: 0 0% 55%;

  /* Accent (Dourado mais vibrante) */
  --accent: 45 85% 55%;
  --accent-foreground: 0 0% 4%;

  /* Destructive */
  --destructive: 0 70% 45%;
  --destructive-foreground: 0 0% 98%;

  /* Bordas e Inputs */
  --border: 0 0% 18%;
  --input: 0 0% 18%;
  --ring: 45 85% 55%;

  /* Premium Tokens */
  --gold: 45 85% 55%;
  --gold-hover: 45 85% 62%;
  --gold-light: 45 60% 10%;
  --surface: 0 0% 6%;
  --surface-elevated: 0 0% 9%;
}
```

---

## Uso no Tailwind

```tsx
// Exemplos de uso com classes Tailwind

// Backgrounds
<div className="bg-background" />      // Fundo principal
<div className="bg-card" />            // Cards
<div className="bg-muted" />           // Elementos secundários
<div className="bg-accent" />          // Destaque dourado

// Textos
<p className="text-foreground" />      // Texto principal
<p className="text-muted-foreground" /> // Texto secundário
<p className="text-accent" />          // Texto dourado

// Bordas
<div className="border-border" />      // Borda padrão
<div className="border-accent" />      // Borda dourada

// Gold especial
<div className="bg-gold" />            // Dourado principal
<div className="bg-gold-light" />      // Dourado suave (fundo)
<div className="hover:bg-gold-hover" /> // Hover dourado
```

---

## Resumo Visual

| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `background` | Branco puro | Quase preto | Fundo geral |
| `foreground` | Preto 8% | Branco 96% | Texto principal |
| `accent/gold` | Dourado 50% | Dourado 55% | Destaques, CTAs |
| `muted` | Cinza 96% | Cinza 14% | Áreas secundárias |
| `border` | Cinza 92% | Cinza 18% | Bordas sutis |
