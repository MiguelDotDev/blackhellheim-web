# Marca BlackHellHeim (documento de diseño)

Versión: 2 (propuesta aprobada por David) · Fecha: 2026-11-12

## 1. Identidad
- Nombre visible: BlackHellHeim
- Frase corta: Playeras con alma mexicana
- Tono de voz: oscuro, orgulloso, directo, con humor mexicano
- Idioma de la interfaz: español de México
- Estética: oscura con alma mexicana. Inspiración general en el cartel de lucha libre, el papel picado, la talavera y el Día de Muertos. Todo se dibuja con elementos originales; no se copia ninguna marca, personaje ni ilustración existente.

## 2. Paleta (solo modo oscuro)
| Uso                          | Color   |
|------------------------------|---------|
| Primario (botones): rosa mexicano | #E4007C |
| Primario al pasar el cursor  | #C70069 |
| Acento (enlaces, foco): cempasúchil | #F5A623 |
| Acento secundario: turquesa de talavera | #2EC4B6 |
| Fondo de página              | #0B0B0D |
| Fondo de tarjetas            | #15151A |
| Texto principal              | #EDEDED |
| Texto secundario             | #A1A1AA |
| Bordes                       | #2A2A31 |
| Éxito                        | #3FA66B |
| Error                        | #E5484D |
| Aviso                        | #E0A93B |
- Modo: solo oscuro.
- Contraste AA: texto principal y secundario sobre el fondo cumplen; texto blanco sobre el primario cumple.
- El primario NO se usa como color de texto pequeño sobre el fondo oscuro; los enlaces y textos destacados usan el cempasúchil. El turquesa se usa en detalles decorativos y estados informativos.
- El error (rojo) y el primario (rosa) son parecidos: los errores siempre llevan icono y texto, no solo color.

## 3. Tipografía (fuentes libres, licencia SIL OFL, autoalojadas con @fontsource, sin CDN)
- Títulos: Anton (cartel de lucha libre), solo para encabezados
- Texto: Inter (peso variable)
- Tamaño base del texto: 16 px

## 4. Logo y monograma
- Logo principal: provisional, en texto con la fuente de títulos ("BLACKHELLHEIM"), en SVG, archivo docs/diseno/logo.svg
- Monograma: "BH" dentro de un escudo con borde recortado tipo papel picado, SVG propio y original, archivo docs/diseno/monograma.svg (provisional)
- Elemento decorativo: franja repetible tipo papel picado, hecha en SVG propio, para separadores y bordes
- Icono de la PWA: se genera desde el monograma, en 192x192 y 512x512, con versión maskable
- Todo lo marcado como provisional se sustituirá más adelante sin cambiar la interfaz

## 5. Forma de los componentes
- Esquinas: redondeadas leves (4 px)
- Sombras: ninguna; la separación se hace con bordes de 1 px
- Botones: primario relleno; secundario con contorno del color de borde
- Foco visible en todos los elementos interactivos, con el color de acento
- Precios en pesos mexicanos (MXN), formato es-MX

## 6. Reglas para el agente
- Usar solo estos colores, fuentes y activos; no inventar otros.
- Lo marcado como provisional se anota como tal; no tratarlo como definitivo.
- Fuentes e imágenes: solo con licencia libre; registrar la licencia.
- No reproducir marcas, personajes ni ilustraciones existentes, aunque sean mexicanas o de películas.
