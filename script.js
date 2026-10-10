'use strict';

// ===========================
// Calculator Class
// ===========================
class Calculator {
  constructor(currentEl, expressionEl, acBtn) {
    this.currentEl    = currentEl;
    this.expressionEl = expressionEl;
    this.acBtn        = acBtn;

    // State
    this.currentInput  = '0';
    this.previousInput = '';
    this.operator      = null;
    this.justEvaluated = false;   // true right after pressing "="
    this.shouldReplace = false;   // true after choosing an operator

    this.updateDisplay();
  }

  // -------------------------------------------------------
  // Input Handlers
  // -------------------------------------------------------

  /** Append a digit (0–9) */
  appendNumber(value) {
    if (this.justEvaluated) {
      // Start a fresh number after a result
      this.currentInput  = value;
      this.previousInput = '';
      this.operator      = null;
      this.justEvaluated = false;
      this.shouldReplace = false;
    } else if (this.shouldReplace) {
      this.currentInput  = value;
      this.shouldReplace = false;
    } else {
      if (this.currentInput === '0' && value !== '.') {
        this.currentInput = value;
      } else if (this.currentInput.length < 15) {
        this.currentInput += value;
      }
    }
    this.updateAcLabel();
    this.updateDisplay();
  }

  /** Toggle/append decimal point */
  appendDecimal() {
    if (this.justEvaluated || this.shouldReplace) {
      this.currentInput  = '0.';
      this.justEvaluated = false;
      this.shouldReplace = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  /** Choose an operator (+, −, ×, ÷) */
  chooseOperator(op) {
    if (this.justEvaluated) {
      // Chain from result: keep currentInput as previousInput
      this.previousInput = this.currentInput;
      this.operator      = op;
      this.shouldReplace = true;
      this.justEvaluated = false;
      this.updateExpression();
      this.updateDisplay();
      return;
    }

    // If an operator was already set and user changed their mind without typing
    if (this.shouldReplace && this.operator) {
      this.operator = op;
      this.updateExpression();
      return;
    }

    // Normal: evaluate any pending operation first, then set new operator
    if (this.previousInput !== '' && this.operator && !this.shouldReplace) {
      this.evaluate(false);
    }

    this.previousInput = this.currentInput;
    this.operator      = op;
    this.shouldReplace = true;

    this.updateExpression();
    this.updateDisplay();
  }

  /** Apply percentage */
  percent() {
    const val = parseFloat(this.currentInput);
    if (isNaN(val)) return;
    this.currentInput = this.formatResult(val / 100);
    this.justEvaluated = false;
    this.updateDisplay();
  }

  /** Delete last character */
  deleteLast() {
    if (this.justEvaluated || this.shouldReplace) return;

    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    this.updateAcLabel();
    this.updateDisplay();
  }

  /** Full reset */
  clear() {
    this.currentInput  = '0';
    this.previousInput = '';
    this.operator      = null;
    this.justEvaluated = false;
    this.shouldReplace = false;

    this.expressionEl.textContent = '';
    this.updateAcLabel();
    this.updateDisplay();
  }

  // -------------------------------------------------------
  // Core Evaluation
  // -------------------------------------------------------

  /** Compute the result */
  evaluate(finalEval = true) {
    if (this.operator === null || this.previousInput === '') return;

    const prev = parseFloat(this.previousInput);
    const curr = parseFloat(this.currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (this.operator) {
      case '+': result = prev + curr; break;
      case '−': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷':
        if (curr === 0) {
          this.showError('Error');
          return;
        }
        result = prev / curr;
        break;
      default: return;
    }

    const resultStr = this.formatResult(result);

    if (finalEval) {
      // Show the full expression in the expression row
      this.expressionEl.textContent =
        `${this.previousInput} ${this.operator} ${this.currentInput} =`;
      this.currentInput  = resultStr;
      this.previousInput = '';
      this.operator      = null;
      this.justEvaluated = true;
      this.shouldReplace = false;
    } else {
      // Intermediate (chained op): just update currentInput silently
      this.currentInput = resultStr;
    }

    this.animateResult();
    this.updateAcLabel();
    this.updateDisplay();
  }

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------

  formatResult(num) {
    // Avoid floating-point display noise (e.g. 0.1+0.2)
    const rounded = parseFloat(num.toPrecision(12));
    // Use exponential notation if the number is very large / very small
    if (Math.abs(rounded) > 1e12 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
      return rounded.toExponential(4);
    }
    return String(rounded);
  }

  showError(msg) {
    this.currentEl.textContent = msg;
    this.currentEl.classList.remove('small', 'xsmall');
    this.expressionEl.textContent = '';
    this.currentInput  = '0';
    this.previousInput = '';
    this.operator      = null;
    this.justEvaluated = false;
    this.shouldReplace = false;
    this.updateAcLabel();
    // Restore after 1.5 s
    setTimeout(() => {
      this.currentEl.textContent = '0';
    }, 1500);
  }

  updateDisplay() {
    this.currentEl.textContent = this.currentInput;
    // Shrink font for long numbers
    const len = this.currentInput.length;
    this.currentEl.classList.toggle('small',   len > 10 && len <= 14);
    this.currentEl.classList.toggle('xsmall',  len > 14);
  }

  updateExpression() {
    if (this.previousInput !== '' && this.operator) {
      this.expressionEl.textContent = `${this.previousInput} ${this.operator}`;
    } else {
      this.expressionEl.textContent = '';
    }
  }

  animateResult() {
    this.currentEl.classList.remove('animate');
    // Force reflow so the class removal registers before re-adding
    void this.currentEl.offsetWidth;
    this.currentEl.classList.add('animate');
  }

  updateAcLabel() {
    // Switch "AC" ↔ "C" when there's something to clear
    const hasInput = this.currentInput !== '0' || this.previousInput !== '';
    this.acBtn.textContent = hasInput ? 'C' : 'AC';
  }
}

// ===========================
// Bootstrap
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const currentEl    = document.getElementById('current');
  const expressionEl = document.getElementById('expression');
  const acBtn        = document.getElementById('ac-btn');

  const calc = new Calculator(currentEl, expressionEl, acBtn);

  // Highlight active operator button
  function clearActiveOp() {
    document.querySelectorAll('.btn--operator').forEach(b => b.classList.remove('active-op'));
  }

  // ---- Button clicks ----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value  = btn.dataset.value;

      switch (action) {
        case 'number':
          clearActiveOp();
          calc.appendNumber(value);
          break;
        case 'decimal':
          clearActiveOp();
          calc.appendDecimal();
          break;
        case 'operator':
          clearActiveOp();
          btn.classList.add('active-op');
          calc.chooseOperator(value);
          break;
        case 'percent':
          clearActiveOp();
          calc.percent();
          break;
        case 'delete':
          clearActiveOp();
          calc.deleteLast();
          break;
        case 'clear':
          clearActiveOp();
          calc.clear();
          break;
        case 'equals':
          clearActiveOp();
          calc.evaluate(true);
          break;
      }
    });
  });

  // ---- Keyboard support ----
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key;

    if (key >= '0' && key <= '9') {
      clearActiveOp();
      calc.appendNumber(key);
    } else if (key === '.') {
      clearActiveOp();
      calc.appendDecimal();
    } else if (key === '+') {
      clearActiveOp();
      document.querySelector('[data-value="+"]')?.classList.add('active-op');
      calc.chooseOperator('+');
    } else if (key === '-') {
      clearActiveOp();
      document.querySelector('[data-value="−"]')?.classList.add('active-op');
      calc.chooseOperator('−');
    } else if (key === '*') {
      clearActiveOp();
      document.querySelector('[data-value="×"]')?.classList.add('active-op');
      calc.chooseOperator('×');
    } else if (key === '/') {
      e.preventDefault(); // prevent browser quick-find
      clearActiveOp();
      document.querySelector('[data-value="÷"]')?.classList.add('active-op');
      calc.chooseOperator('÷');
    } else if (key === '%') {
      clearActiveOp();
      calc.percent();
    } else if (key === 'Enter' || key === '=') {
      clearActiveOp();
      calc.evaluate(true);
    } else if (key === 'Backspace') {
      clearActiveOp();
      calc.deleteLast();
    } else if (key === 'Escape' || key === 'Delete') {
      clearActiveOp();
      calc.clear();
    }
  });
});

