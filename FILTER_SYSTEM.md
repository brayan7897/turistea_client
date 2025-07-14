# Sistema de Filtro de Cards por Tipo

## 🎯 Objetivo
Implementar un filtro que muestre solo UN tipo de establecimiento en los cards a la vez (lugares turísticos, hoteles, o restaurantes), evitando mezclas confusas.

## 🔧 Funcionamiento

### Prioridades del Filtro:

1. **Identificadores Específicos (Máxima Prioridad)**
   - Si hay `[HOTEL:]` → Solo muestra hoteles
   - Si hay `[RESTAURANTE:]` → Solo muestra restaurantes  
   - Si hay `[LUGAR:]` → Solo muestra lugares turísticos

2. **Preguntas Específicas del Usuario**
   - Pregunta por hoteles → Solo muestra hoteles
   - Pregunta por restaurantes → Solo muestra restaurantes

3. **Por Defecto**
   - Si no se especifica tipo → Solo muestra lugares turísticos

### Ejemplos de Uso:

#### ✅ Casos que muestran SOLO hoteles:
- "¿Dónde puedo hospedarme?"
- "Necesito un hotel"
- "¿Qué hoteles hay?"
- Respuesta de GPT: "Te recomiendo [HOTEL:Gran Hotel Huánuco]"

#### ✅ Casos que muestran SOLO restaurantes:
- "¿Dónde puedo comer?"
- "Busco restaurantes"
- "¿Qué comida típica hay?"
- Respuesta de GPT: "Prueba [RESTAURANTE:El Fogón de la Abuela]"

#### ✅ Casos que muestran SOLO lugares turísticos:
- "¿Qué lugares puedo visitar?"
- "Los más visitados"
- "Atracciones turísticas"
- Respuesta de GPT: "Visita [LUGAR:Kotosh]"

## 🚫 Lo que YA NO sucede:
- ❌ Mezcla de hoteles + restaurantes + lugares
- ❌ Cards confusos con tipos mezclados
- ❌ Información irrelevante para la consulta específica

## 💡 Beneficios:
- **🎯 Enfoque Claro**: El usuario ve exactamente lo que pidió
- **📱 Mejor UX**: Cards más organizados y relevantes
- **🧠 Menos Confusión**: No hay información mixta innecesaria
- **⚡ Más Eficiente**: Procesamiento más rápido y directo

## 🔍 Debug:
El sistema incluye logs detallados:
- `[DEBUG] Filtro: Solo hoteles por identificadores`
- `[DEBUG] Filtro: Solo restaurantes por pregunta específica`
- `[DEBUG] Filtro: Solo lugares turísticos por defecto`

## 🔄 Flujo de Decisión:
```
Texto del usuario
       ↓
¿Hay [HOTEL:] en respuesta? → SÍ → Solo hoteles
       ↓ NO
¿Hay [RESTAURANTE:] en respuesta? → SÍ → Solo restaurantes  
       ↓ NO
¿Hay [LUGAR:] en respuesta? → SÍ → Solo lugares
       ↓ NO
¿Pregunta por hoteles? → SÍ → Solo hoteles
       ↓ NO
¿Pregunta por restaurantes? → SÍ → Solo restaurantes
       ↓ NO
Por defecto → Solo lugares turísticos
```

## 📊 Estructura de Respuesta:
```javascript
{
  touristPlaces: [...] | [],
  hotels: [...] | [],
  restaurants: [...] | [],
  hasAnyPlaces: boolean,
  filterType: "places" | "hotels" | "restaurants" | "none"
}
```

El filtro garantiza que solo uno de los arrays tenga elementos, nunca una mezcla.
