# 🧮 Modern Calculator

A clean, responsive calculator web app built with pure **HTML**, **CSS**, and **vanilla JavaScript** — no frameworks, no dependencies.

![Calculator Preview](./preview.png)
> *Screenshot coming soon — open `index.html` in your browser to see it live.*

---

## ✨ Features

- ➕ Addition, ➖ Subtraction, ✖️ Multiplication, ➗ Division
- 🔢 Chained operations (e.g. `3 + 5 × 2`)
- % Percentage support
- ⌫ Delete last digit
- **AC / C** — full clear or single clear
- 🛡️ Division by zero error handling
- 🔤 Floating-point display noise prevention
- ⌨️ Full **keyboard support**
- 📱 Fully **responsive** — works on mobile and desktop
- 🎨 Glassmorphism dark theme with smooth animations

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9`, `.` | Input digits / decimal |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last digit |
| `Escape` / `Delete` | Clear (AC) |
| `%` | Percentage |

---

## 🚀 How to Run Locally

**Option 1 — Open directly (no setup):**
```
Double-click index.html → opens in your default browser
```

**Option 2 — VS Code Live Server (recommended, auto-reloads on save):**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Visit `http://127.0.0.1:5500`

**Option 3 — Python local server:**
```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## 📁 Project Structure

```
calculator/
├── index.html    # App shell and button layout
├── style.css     # Dark glassmorphism theme, responsive grid
├── script.js     # Calculator logic (class-based, no libraries)
├── .gitignore
└── README.md
```

---

## 🛠️ Built With

- HTML5
- CSS3 (Grid, Custom Properties, Animations, Backdrop Filter)
- Vanilla JavaScript (ES6 Class, DOM events, Keyboard API)

---

## 📄 License

MIT — free to use, modify, and distribute.
