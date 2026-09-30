# 2 AutoLISP 重点

## 弧度转度分秒函数

```lisp
(defun hd2dfm (hd)
  (setq jd (* (/ hd pi) 180)) ; 弧度转成度
  (setq d (fix jd)) ; 取出整数部分为度
  (setq f (fix (* (- jd d) 60))) ; 度的小数部分 x60 取整得到分
  (setq m (fix (* (- (* (- jd d) 60) f) 60))) ; 分的小数部分 x60 取整得到秒
  (princ d)
  (princ "°")
  (princ f)
  (princ "'")
  (princ m)
  (princ "\"")
  (princ)
)
```

## 图形绘制基础

### 画矩形命令

```lisp
(defun c:myrec ()
  (setq pt1 (getpoint "first point:"))
  (setq pt2 (getcorner pt1))
  (setq x1 (car pt1)
        y1 (cadr pt1)
  )
  (setq x2 (car pt2)
        y2 (cadr pt2)
  )
  (setq pt3 (list x1 y2))
  (setq pt4 (list x2 y1))
  (command "pline" pt1 pt3 pt2 pt4 "c")
  (command "line" pt1 pt2 "")
  (command "line" pt3 pt4 "")
)
```

### 矩形加内矩形

```lisp
(defun c:myrec2 ()
  (setq pt1 (getpoint "first point:"))
  (setq pt3 (getcorner pt1))
  (setq x1 (car pt1)
        y1 (cadr pt1)
  )
  (setq x3 (car pt3)
        y3 (cadr pt3)
  )
  (setq pt2 (list x1 y3))
  (setq pt4 (list x3 y1))
  (command "pline" pt1 pt2 pt3 pt4 "c")
  (setq xbias (* (- x1 x3) 0.25)) ; 计算内矩形相对外矩形的偏移量
  (setq ybias (* (- y1 y3) 0.25))
  (setq pt5 (list (- x1 xbias) (- y1 ybias)))
  (setq pt6 (list (- x1 xbias) (+ y3 ybias)))
  (setq pt7 (list (+ x3 xbias) (+ y3 ybias)))
  (setq pt8 (list (+ x3 xbias) (- y1 ybias)))
  (command "pline" pt5 pt6 pt7 pt8 "c")
  (command "line" pt5 pt7 "")
  (command "change" "l" "" "p" "c" "1" "")
  (command "line" pt6 pt8 "")
  (command "change" "l" "" "p" "c" "1" "")
  (princ)
)
```

## 表操作

### 向用户要求实数，形成表

```lisp
(defun c:p ()
  (setq a (getreal "a="))
  (setq alist nil)
  (while (/= a nil)
    (setq alist (cons a alist))
    (setq a (getreal "a="))
  )
  (setq alist (reverse alist))
  (princ alist)
  (princ)
)
```

### 求出这个表的数字的和

```lisp
(defun sum (b)
  (setq n    (length b)
        i    0
        sum1 0
  )
  (while (< i n)
    (setq bi (nth i b))
    (setq sum1 (+ sum1 bi))
    (setq i (1+ i))
  )
  (princ "sum=")
  (princ sum1)
  (princ)
)
```

### 求出这个表的最大值

```lisp
(defun getmax (b)
  (setq bmax (car b))
  (foreach bi b
    (if (> bi bmax)
      (setq bmax bi)
    )
  )
  bmax
)
```

### 求出表的最小值，并输出下标

```lisp
(defun getmini (b)
  (setq bmin (car b))
  (setq n     (length b)
        i     0
        bmini 0
  )
  (while (< i n)
    (setq bi (nth i b))
    (if (< bi bmin)
      (setq bmin  bi
            bmini i
      )
    )
    (setq i (1+ i))
  )
  (princ "min=")
  (princ bmin)
  (princ "\n下标:")
  (princ bmini)
  (princ)
)
```

### 累乘函数

```lisp
(defun getmul (b)
  (setq res (car b))
  (setq n (length b)
        i 1
  )
  (while (< i n)
    (setq res (* res (nth i b)))
    (setq i (1+ i))
  )
  (princ "累乘=")
  (princ res)
  (princ)
)
```

## 选择集操作

### 选择一个选择集，显示其中 `text` 与坐标

```lisp
(defun c:ch ()
  (setvar "cmdecho" 0)
  (setq s (ssget))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (while (< i len)
        (setq e (ssname s i))
        (setq en (entget e))
        (setq stname (cdr (assoc 0 en)))
        (if (= stname "TEXT")
          (progn
            (setq txt (cdr (assoc 1 en)))
            (setq pt (cdr (assoc 10 en)))
            (princ txt)
            (princ "\n")
            (princ "坐标：")
            (princ pt)
            (princ "\n")
            (princ)
          )
        )
        (setq i (+ i 1))
      )
    )
    (princ "未选择")
  )
)
```

### 通过选择集修改实体、注记的大小，按比例修改注记大小等

```lisp
; 通过选择集修改实体大小
(defun ch_txt1 (sc)
  (setq s (ssget))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (while (< i len)
        (setq e (ssname s i))
        (setq en (entget e))
        (setq pt (cdr (assoc 10 en)))
        (command "scale" e "" pt sc)
        (setq i (1+ i))
      )
    )
  )
  (princ)
)

; 通过选择集修改注记大小
(defun ch_txt2 (lay sc)
  (setq s (ssget "x" (list (cons 0 "TEXT") (cons 8 lay))))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (while (< i len)
        (setq e (ssname s i))
        (setq en (entget e))
        (setq old (assoc 40 en))
        (setq oldh (cdr old))
        (setq newh (* oldh sc))
        (setq new (cons 40 newh))
        (setq en (subst new old en))
        (entmod en) ; 表示对实体表作出修改后更新
        (setq i (+ i 1))
      )
    )
  )
  (princ)
)
```

### 修改注记的内容，替换第一个字母为汉字

```lisp
(defun ch_txt3 (lay)
  (setq s (ssget "x" (list (cons 0 "TEXT") (cons 8 lay))))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (while (< i len)
        (setq e (ssname s i))
        (setq en (entget e))
        (setq old (assoc 1 en))
        (setq oldc (cdr old))
        (if (= (strcase (substr oldc 1 1)) "H")
          ; strcase将字母转化为大写
          (progn
            (setq newc (strcat "混" (substr oldc 2 100)))
            ; strcat 为连接两个字符串
            (setq new (cons 1 newc))
            (setq en (subst new old en))
          )
        )
        (if (= (strcase (substr oldc 1 1)) "J")
          (progn
            (setq newc (strcat "坚" (substr oldc 2 100)))
            (setq new (cons 1 newc))
            (setq en (subst new old en))
          )
        )
        (if (= (strcase (substr oldc 1 1)) "T")
          (progn
            (setq newc (strcat "砼" (substr oldc 2 100)))
            (setq new (cons 1 newc))
            (setq en (subst new old en))
          )
        )
        (entmod en)
        (setq i (1+ i))
      )
    )
  )
)
```

## 图形绘制进阶

### 求距离的函数

```lisp
(defun ss1 (pt1 pt2)
  (distance pt1 pt2)
)

(defun ss2 (pt1 pt2)
  (setq x1 (car pt1)
        y1 (cadr pt1)
  )
  (setq x2 (car pt2)
        y2 (cadr pt2)
  )
  (sqrt (+ (* (- x2 x1) (- x2 x1)) (* (- y2 y1) (- y2 y1))))
)
```

### 画出三角形并求周长面积

```lisp
(defun c:pp1 ()
  (setq osm (getvar "osmode"))
  (setvar "osmode" 0)
  (setq pt1 (getpoint "p1:"))
  (setq pt2 (getpoint pt1))
  (setq pt3 (getpoint pt2))
  (ss3 pt1 pt2 pt3)
  (setvar "osmode" osm)
  (princ)
)

(defun ss3 (pt1 pt2 pt3)
  (command "pline" pt1 pt2 pt3 "c")
  (command "area" "o" "l" "")
  (setq area (getvar "area"))
  (setq per (getvar "perimeter"))
  (princ "area=")
  (princ (rtos area 2 2))
  (princ "\nperimeter=")
  (princ (rtos per 2 2))
  (setq x0 (/ (+ (car pt1) (car pt2) (car pt3)) 3.0))
  (setq y0 (/ (+ (cadr pt1) (cadr pt2) (cadr pt3)) 3.0))
  (command "text"
           "j"
           "mc"
           (list x0 (+ y0 (/ per 110.0)))
           (/ per 60.0)
           0.0
           (strcat "area=" (rtos area 2 2))
  )
  (command "text"
           "j"
           "mc"
           (list x0 (- y0 (/ per 110.0)))
           (/ per 60.0)
           0.0
           (strcat "per=" (rtos per 2 2))
  )
  (princ)
)
```

### 画出四边形并求周长面积，标在图形中

```lisp
(defun c:pp ()
  (setvar "osmode" 0)
  (setq pt1 (getpoint "pt1:"))
  (setq pt2 (getpoint pt1))
  (setq pt3 (getpoint pt2))
  (setq pt4 (getpoint pt3))
  (ss pt1 pt2 pt3 pt4)
  (zj pt1 pt2)
  (zj pt2 pt3)
  (zj pt3 pt4)
  (zj pt4 pt1)
  (princ)
)

(defun ss (pt1 pt2 pt3 pt4)
  (command "pline" pt1 pt2 pt3 pt4 "c")
  (command "area" "o" "l" "")
  (setq area (getvar "area"))
  (setq per (getvar "perimeter"))

  (setq x0 (/ (+ (car pt1) (car pt2) (car pt3) (car pt4)) 4.0))
  (setq y0 (/ (+ (cadr pt1) (cadr pt2) (cadr pt3) (cadr pt4)) 4.0))

  (command "text"
           "j"
           "mc"
           (list x0 (+ y0 (/ per 110.0)))
           (/ per 60.0)
           0.0
           (strcat "area=" (rtos area 2 2))
  )
  (command "text"
           "j"
           "mc"
           (list x0 (- y0 (/ per 110.0)))
           (/ per 60.0)
           0.0
           (strcat "per=" (rtos per 2 2))
  )
  (princ)
)

(defun zj (pt01 pt02)
  (setq ds (distance pt01 pt02))
  (setq x0 (/ (+ (car pt01) (car pt02)) 2.0))
  (setq y0 (/ (+ (cadr pt01) (cadr pt02)) 2.0))
  (setq ang (angle pt01 pt02))
  (command "text" "j" "bc" (list x0 y0) (/ ds 30.0) pt02 (rtos ds 2 2))
  (princ)
)
```

### 快速标注数字，如门牌号

```lisp
(defun c:t1 ()
  (setq m1 (getint "起始门牌号："))
  (setq dm (getint "间隔(1,2)："))
  (setq h1 (getreal "highet of text:"))
  (setq pt (getpoint "first point:"))
  (while pt
    (command "text" "j" "bc" pt h1 0 (strcat "M" (itoa m1)))
    (setq pt (getpoint "next point:"))
    (setq m1 (+ m1 dm))
  )
  (princ)
)
```

### 将实体坐标表输出为文本文件

```lisp
(defun get_poly_xy (e / ptlist)
  (setq fp (open "D:\\points.txt" "w"))
  (setq en (entget e))
  (setq ptlist nil)
  (setq f (assoc 10 en))
  (while f
    (setq pt (cdr f))
    (princ (cadr pt) fp)
    (princ "," fp)
    (princ (car pt) fp)
    (princ "\n" fp)
    (setq ptlist (cons pt ptlist))
    (setq en (subst (cons 999 999) f en))
    (setq f (assoc 10 en))
  )
  (close fp)
  ptlist
)
```

### 颠倒 `LWPolyline`

```lisp
(defun c:lwpolyline ()
  (setq e (car (entsel "select a polyline")))
  (setq ptlist (get_poly_xy e))
  (command "pline")
  (foreach pt ptlist
    (command pt)
  )
  (command "")
  (command "erase" e "")
  (princ "OK")
  (princ)
)
```

### 选择注记，将其所在图层的所有注记得到选择集，将这些注记与坐标输出为文本文件

```lisp
(defun c:tt ()
  (setq e (car (entsel "select a text:")))
  (setq lay (cdr (assoc 8 (entget e))))
  (setq s (ssget "x" (list (cons 8 lay) (cons 0 "text"))))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (setq fp (open "d:\\text.txt" "w"))
      (while (< i len)
        (setq e (ssname i))
        (setq en (entget e))
        (setq pt (cdr (assoc 10 en)))
        (setq txt (cdr (assoc 1 en)))
        (princ (cadr pt) fp)
        (princ "," fp)
        (princ (car pt) fp)
        (princ "," fp)
        (princ txt fp)
        (princ "\n" fp)
        (setq i (1+ i))
      )
      (close fp)
    )
    (princ "not found text in...")
  )
  (princ "ok")
  (princ)
)
```

### 选择块，将其所在图层的所有块得到选择集，将块名和坐标输出为文本文件

```lisp
(defun c:bb ()
  (setq e (car (entsel "select a block:")))
  (setq lay (cdr (assoc 8 (entget e))))
  (setq s (ssget "x" (list (cons 8 lay) (cons 0 "insert"))))
  (if s
    (progn
      (setq len (sslength s)
            i   0
      )
      (setq fp (open "d:\\bl.txt" "w"))
      (while (< i len)
        (setq e (ssname i))
        (setq en (entget e))
        (setq pt (cdr (assoc 10 en)))
        (setq txt (cdr (assoc 2 en)))
        (princ (cadr pt) fp)
        (princ "," fp)
        (princ (car pt) fp)
        (princ "," fp)
        (princ txt fp)
        (princ "\n" fp)
        (setq i (1+ i))
      )
      (close fp)
    )
    (princ "not found block in...")
  )
  (princ "ok")
  (princ)
)
```
