# Modelo de datos: HU-9

Los tipos vienen del contrato (`contratos/openapi.json`, v0.4.0) y se **generan**; esta tabla es informativa y **no** se transcribe a código.

| Esquema | Campos (obligatorios en negrita) | Notas |
|---|---|---|
| EstadoSalud | **estado**: texto | `/salud` |
| EstadoBaseDatos | **estado**: texto | `/salud/base`; 503 posible |
| Tienda | **codigo** (`^[A-Z]{3}$`), **nombre**, **moneda** (`^[A-Z]{3}$`) | `/tiendas/{codigo}` |
| ProblemDetails | **type** (uri), **title**, **status** (entero), detalle, instancia, **codigo**, **idCorrelacion**, errores (mapa de campo → lista de textos) | `application/problem+json` |

Operaciones: `obtenerSalud` GET `/salud` (200, 500) · `obtenerSaludBaseDatos` GET `/salud/base` (200, 503, 500) · `consultarTienda` GET `/tiendas/{codigo}` (200, 400, 404, 408, 500).

Respuestas del mock (decisión de esta HU): `/salud` → `{estado:"ok"}`; `/salud/base` → `{estado:"ok"}`; `MEX` → `{codigo:"MEX", nombre:"BlackHellHeim", moneda:"MXN"}`; código con formato inválido → 400; otro código válido → 404; ruta desconocida → 404. Los problemas llevan `type` = `https://blackhellheim.invalid/problemas/<codigo>`, `codigo` = `validacion` | `tienda_no_encontrada` | `ruta_no_encontrada` e `idCorrelacion` = UUID por petición.
