# KaTeX 打不出粗斜体大写希腊字母

## 症状

使用 KaTeX 渲染公式，发现大写希腊字母的粗斜体，例如 $\boldsymbol{\varPhi},\boldsymbol{\varGamma},\boldsymbol{\varLambda},\boldsymbol{\varOmega}$ 渲染不出来。

在 MathJax 中使用代码 `\boldsymbol{\varPhi}` 就可以得到加粗斜体的大写希腊字母。但在 KaTeX 中：

| 代码                         |         效果         | 加粗 | 斜体 | 大写 |
| ---------------------------- | :------------------: | :--: | :--: | :--: |
| `\boldsymbol{\varPhi}`       |      $\varPhi$       |  ✕   |  ○   |  ○   |
| `\boldsymbol{\Phi}`          |  $\boldsymbol\Phi$   |  ○   |  ✕   |  ○   |
| `\mathit{\boldsymbol{\Phi}}` |  $\boldsymbol\Phi$   |  ○   |  ✕   |  ○   |
| `\boldsymbol{\mathit{\Phi}}` |      $\varPhi$       |  ✕   |  ○   |  ○   |
| `\boldsymbol{\phi}`          |  $\boldsymbol\phi$   |  ○   |  ○   |  ✕   |
| `\boldsymbol{\varphi}`       | $\boldsymbol\varphi$ |  ○   |  ○   |  ✕   |

总之得不到加粗斜体的大写希腊字母。

一开始容易怀疑是字体缺字。但用 DevTools 手动把 KaTeX 生成的类名从：

```html
<span class="mord mathit">...</span>
```

改成：

```html
<span class="mord boldsymbol">...</span>
```

之后，浏览器可以正常显示粗斜体大写希腊字母。也就是说字体其实是有的，问题出在 KaTeX 选择字体的逻辑上。

## 原因

### 字体信息嵌套覆盖

KaTeX 中 `\varPhi` 这类命令不是独立的符号，而是宏（[src/macros.ts:351-367](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/macros.ts#L351-L367)）：

```ts
//////////////////////////////////////////////////////////////////////
// amsmath.sty
// http://mirrors.concertpass.com/tex-archive/macros/latex/required/amsmath/amsmath.pdf

// Italic Greek capital letters.  AMS defines these with \DeclareMathSymbol,
// but they are equivalent to \mathit{\Letter}.
defineMacro('\\varGamma', '\\mathit{\\Gamma}')
defineMacro('\\varDelta', '\\mathit{\\Delta}')
defineMacro('\\varTheta', '\\mathit{\\Theta}')
defineMacro('\\varLambda', '\\mathit{\\Lambda}')
defineMacro('\\varXi', '\\mathit{\\Xi}')
defineMacro('\\varPi', '\\mathit{\\Pi}')
defineMacro('\\varSigma', '\\mathit{\\Sigma}')
defineMacro('\\varUpsilon', '\\mathit{\\Upsilon}')
defineMacro('\\varPhi', '\\mathit{\\Phi}')
defineMacro('\\varPsi', '\\mathit{\\Psi}')
defineMacro('\\varOmega', '\\mathit{\\Omega}')
```

因此：

```tex
\boldsymbol{\varPhi}
```

会先展开成：

```tex
\boldsymbol{\mathit{\Phi}}
```

问题就出在 `\boldsymbol` 和 `\mathit` 叠加的时候。KaTeX 的字体状态保存在 `options.font` 属性，在新增元素时合并字体信息（[src/functions/font.ts:16](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/functions/font.ts#L16)）：

```ts
const newOptions = options.withFont(font)
```

而 `withFont` 只是简单覆盖（[src/Options.ts:226-232](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/Options.ts#L226-L232)）：

```ts
class Options {
  /**
   * Creates a new options object with the given math font or old text font.
   * @type {[type]}
   */
  withFont(font: MathFont): Options {
    return this.extend({ font })
  }
}
```

所以在 `\boldsymbol{\varPhi}` 展开而成的 `\boldsymbol{\mit{\Phi}}` 中：

- 外层 `\boldsymbol` 把 `options.font` 设成 `boldsymbol`
- 内层 `\mathit` 把 `options.font` 覆盖成 `mathit`

等真正渲染 `\Phi` 时，KaTeX 只知道当前 `options.font` 是 `mathit`，完全不知道外面曾经包过一层 `boldsymbol`。那自然就只剩不加粗的斜体了。

这和 MathJax 的行为不同。MathJax 对字体样式有组合语义，在有多层字体信息嵌套时会按语义作合并处理。

### 大写希腊字母定义为文本

那为什么小写的 `\boldsymbol{\phi}` 是加粗斜体 $\boldsymbol\phi$，大写的 `\boldsymbol{\Phi}` $\boldsymbol\Phi$ 却是正体而非斜体？

检查 KaTeX 渲染出来的类名，小写的加粗斜体是 `boldsymbol`，大写的加粗正体是 `mathbf`。可明明都写的是 `\boldsymbol`，为什么被偷换成了 `\mathbf`？

原因在最终构建时对 `boldSymbol` 的处理（[src/buildCommon.ts:134-164](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/buildCommon.ts#L134-L164)）：

```ts
/**
 * Determines which of the two font names (Main-Bold and Math-BoldItalic) and
 * corresponding style tags (mathbf or boldsymbol) to use for font "boldsymbol",
 * depending on the symbol.  Use this function instead of fontMap for font
 * "boldsymbol".
 */
const boldSymbol = function (
  value: string,
  mode: Mode,
  type: 'mathord' | 'textord',
): {
  fontName: 'Math-BoldItalic' | 'Main-Bold'
  fontClass: 'boldsymbol' | 'mathbf'
} {
  if (
    type !== 'textord' && // [!code highlight]
    lookupSymbol(value, 'Math-BoldItalic', mode).metrics
  ) {
    return {
      fontName: 'Math-BoldItalic',
      fontClass: 'boldsymbol',
    }
  } else {
    // Some glyphs do not exist in Math-BoldItalic so we need to use
    // Main-Bold instead.
    return {
      fontName: 'Main-Bold',
      fontClass: 'mathbf',
    }
  }
}
```

这里明确写了：只有 `type !== "textord"`，并且 `Math-BoldItalic` 有对应字形时，才会用 `boldsymbol`。否则就回退到 `Main-Bold`，也就是 `mathbf`。

检查 KaTeX 的符号定义。大写希腊字母定义成了 `textord`（[src/symbols.ts:466-476](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/symbols.ts#L466-L476)）：

```ts
defineSymbol(math, main, textord, '\u0393', '\\Gamma', true)
defineSymbol(math, main, textord, '\u0394', '\\Delta', true)
defineSymbol(math, main, textord, '\u0398', '\\Theta', true)
defineSymbol(math, main, textord, '\u039b', '\\Lambda', true)
defineSymbol(math, main, textord, '\u039e', '\\Xi', true)
defineSymbol(math, main, textord, '\u03a0', '\\Pi', true)
defineSymbol(math, main, textord, '\u03a3', '\\Sigma', true)
defineSymbol(math, main, textord, '\u03a5', '\\Upsilon', true)
defineSymbol(math, main, textord, '\u03a6', '\\Phi', true)
defineSymbol(math, main, textord, '\u03a8', '\\Psi', true)
defineSymbol(math, main, textord, '\u03a9', '\\Omega', true)
```

小写希腊字母则是 `mathord`（[src/symbols.ts:496-525](https://github.com/KaTeX/KaTeX/blob/cd5ec4fb23803a6645ba90cccca2eeb7bc7be8dd/src/symbols.ts#L496-L525)）：

```ts
defineSymbol(math, main, mathord, '\u03b1', '\\alpha', true)
defineSymbol(math, main, mathord, '\u03b2', '\\beta', true)
defineSymbol(math, main, mathord, '\u03b3', '\\gamma', true)
defineSymbol(math, main, mathord, '\u03b4', '\\delta', true)
defineSymbol(math, main, mathord, '\u03f5', '\\epsilon', true)
defineSymbol(math, main, mathord, '\u03b6', '\\zeta', true)
defineSymbol(math, main, mathord, '\u03b7', '\\eta', true)
defineSymbol(math, main, mathord, '\u03b8', '\\theta', true)
defineSymbol(math, main, mathord, '\u03b9', '\\iota', true)
defineSymbol(math, main, mathord, '\u03ba', '\\kappa', true)
// ...
```

这也就是为什么小写 `\phi` 默认就是斜体 $\phi$，大写 `\Phi` 默认是正体 $\Phi$。

所以正常情况下：

- `\boldsymbol{\Phi}` 是 `textord`，走 `Main-Bold`，输出 `mathbf`；
- `\boldsymbol{\phi}` 是 `mathord`，走 `Math-BoldItalic`，输出 `boldsymbol`；
- `\boldsymbol{\varPhi}` 展开成 `\boldsymbol{\mathit{\Phi}}`，最后只剩 `mathit`，连 `boldSymbol` 这条分支都走不到。

## 解决

根本修复应该是让 KaTeX 记录字体状态的叠加关系，不能只用一个 `options.font` 表示当前字体。例如遇到 `boldsymbol + mathit` 时，后续渲染应该能知道这两个状态同时存在，再根据符号类型决定使用 `Math-BoldItalic` 还是 `Main-Bold`。

不过这对本项目来说有点重。实际遇到的问题集中在大写希腊字母，于是可以用一个更短视但有效的补丁：不再把它们定义成宏，而是直接注册成真正的 `mathord` 符号。

例如使用 `pnpm patch` 给 ESM 入口打补丁（CommonJS 的话要打到 `dist/katex.js` 上）：

```diff
diff --git a/dist/katex.mjs b/dist/katex.mjs
index b4a83b4b7b9b31064413fa7eb5447823110d7305..66e7a8990e7787968fe6359eae7a7ed7f19f03c0 100644
--- a/dist/katex.mjs
+++ b/dist/katex.mjs
@@ -4223,6 +4223,19 @@ defineSymbol(math, main, mathord, "\u03d6", "\\varpi", true);
 defineSymbol(math, main, mathord, "\u03f1", "\\varrho", true);
 defineSymbol(math, main, mathord, "\u03c2", "\\varsigma", true);
 defineSymbol(math, main, mathord, "\u03c6", "\\varphi", true);
+
+defineSymbol(math, main, mathord, "\u0393", "\\varGamma", true);
+defineSymbol(math, main, mathord, "\u0394", "\\varDelta", true);
+defineSymbol(math, main, mathord, "\u0398", "\\varTheta", true);
+defineSymbol(math, main, mathord, "\u039b", "\\varLambda", true);
+defineSymbol(math, main, mathord, "\u039e", "\\varXi", true);
+defineSymbol(math, main, mathord, "\u03a0", "\\varPi", true);
+defineSymbol(math, main, mathord, "\u03a3", "\\varSigma", true);
+defineSymbol(math, main, mathord, "\u03a5", "\\varUpsilon", true);
+defineSymbol(math, main, mathord, "\u03a6", "\\varPhi", true);
+defineSymbol(math, main, mathord, "\u03a8", "\\varPsi", true);
+defineSymbol(math, main, mathord, "\u03a9", "\\varOmega", true);
+
 defineSymbol(math, main, bin, "\u2217", "*", true);
 defineSymbol(math, main, bin, "+", "+");
 defineSymbol(math, main, bin, "\u2212", "-", true);
@@ -14029,19 +14042,7 @@ defineMacro("\u22ee", "\\vdots");
 //////////////////////////////////////////////////////////////////////
 // amsmath.sty
 // http://mirrors.concertpass.com/tex-archive/macros/latex/required/amsmath/amsmath.pdf
-// Italic Greek capital letters.  AMS defines these with \DeclareMathSymbol,
-// but they are equivalent to \mathit{\Letter}.
-defineMacro("\\varGamma", "\\mathit{\\Gamma}");
-defineMacro("\\varDelta", "\\mathit{\\Delta}");
-defineMacro("\\varTheta", "\\mathit{\\Theta}");
-defineMacro("\\varLambda", "\\mathit{\\Lambda}");
-defineMacro("\\varXi", "\\mathit{\\Xi}");
-defineMacro("\\varPi", "\\mathit{\\Pi}");
-defineMacro("\\varSigma", "\\mathit{\\Sigma}");
-defineMacro("\\varUpsilon", "\\mathit{\\Upsilon}");
-defineMacro("\\varPhi", "\\mathit{\\Phi}");
-defineMacro("\\varPsi", "\\mathit{\\Psi}");
-defineMacro("\\varOmega", "\\mathit{\\Omega}");
+// Italic Greek capital letters.  -- Patched and moved to symbols to avoid \boldsymbol and \mathit conflicts.
 //\newcommand{\substack}[1]{\subarray{c}#1\endsubarray}
 defineMacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
 // \renewcommand{\colon}{\nobreak\mskip2mu\mathpunct{}\nonscript
```

这样 `\varPhi` 就不再展开成 `\mathit{\Phi}`，而是直接作为 `mathord` 参与渲染。于是 `\boldsymbol{\varPhi}` 会直接进入 `boldSymbol` 中的 `mathord` 分支，使用 `Math-BoldItalic` 字体和 `boldsymbol` 类名。

不是对 KaTeX 字体系统的完整修复，只能修复粗斜体大写希腊字母一个问题。虽然短视，但有效。
