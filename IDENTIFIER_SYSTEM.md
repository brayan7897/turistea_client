# Sistema de Identificadores para Cards Unificadas

## Descripción General

Este sistema permite que el chatbot turístico de Huánuco distinga claramente entre lugares turísticos, hoteles y restaurantes utilizando identificadores específicos en las respuestas de OpenAI. Esto evita confusiones y garantiza que se muestren exactamente los tipos de cards que el usuario solicita.

## ¿Cómo Funciona?

### 1. Identificadores en el Prompt de OpenAI

El prompt del sistema ahora incluye identificadores específicos que GPT debe usar:

- **Lugares turísticos**: `[LUGAR:Nombre Exacto]`
- **Hoteles**: `[HOTEL:Nombre Exacto]` 
- **Restaurantes**: `[RESTAURANTE:Nombre Exacto]`

### 2. Ejemplo de Respuesta de GPT

```
Te recomiendo visitar [LUGAR:Kotosh], famoso por el Templo de las Manos Cruzadas.

Para hospedarte, [HOTEL:Gran Hotel Huánuco] está muy bien ubicado en el centro.

Para comer, [RESTAURANTE:El Fogón de la Abuela] tiene los mejores platos típicos huanuqueños.
```

### 3. Procesamiento de la Respuesta

El sistema procesa la respuesta en el siguiente orden:

1. **Extracción**: Los servicios extraen los identificadores del texto crudo
2. **Formateo**: Los identificadores se convierten a formato markdown para mostrar al usuario
3. **Renderizado**: Se muestran los cards correspondientes a cada tipo

## Componentes del Sistema

### `ResponseFormatter` (nuevo)
- `formatForDisplay()`: Convierte identificadores a formato markdown
- `extractIdentifiers()`: Extrae todos los identificadores para debugging
- `hasIdentifiers()`: Verifica si hay identificadores en el texto
- `cleanText()`: Elimina completamente los identificadores

### `UnifiedExtractionService` (actualizado)
- `extractHotelsFromText()`: Prioriza identificadores [HOTEL:] sobre keywords
- `extractRestaurantsFromText()`: Prioriza identificadores [RESTAURANTE:] sobre keywords
- `extractAllFromText()`: Coordina la extracción de todos los tipos

### `TouristPlacesService` (actualizado)
- `extractTouristPlaces()`: Prioriza identificadores [LUGAR:] sobre keywords

### `OpenAIService` (actualizado)
- Prompt actualizado con identificadores específicos
- Procesamiento mejorado: extracción → formateo → renderizado

## Prioridades de Detección

### 1. Alta Prioridad: Identificadores Específicos
Si se detectan identificadores como `[HOTEL:Gran Hotel Huánuco]`, solo se procesan esos lugares específicos.

### 2. Media Prioridad: Keywords Específicos
Si no hay identificadores, se buscan menciones por keywords (nombres exactos).

### 3. Baja Prioridad: Términos Generales
Solo si no hay menciones específicas, se procesan términos generales como "hotel", "restaurante", etc.

## Ventajas del Sistema

### ✅ Precisión
- GPT menciona exactamente lo que debe mostrar cards
- No hay ambigüedad entre tipos de lugares
- Previene cards no solicitados

### ✅ Control
- El usuario ve solo lo que pidió
- Sistema predecible y confiable
- Fácil debugging y mantenimiento

### ✅ Flexibilidad
- Soporta menciones múltiples de diferentes tipos
- Mantiene compatibilidad con el sistema anterior
- Permite expansión futura

## Formato de Respuesta al Usuario

### Antes (con identificadores):
```
Te recomiendo [LUGAR:Kotosh] y [HOTEL:Gran Hotel Huánuco].
```

### Después (mostrado al usuario):
```
Te recomiendo **Kotosh** y **Gran Hotel Huánuco**.
```

## Mantenimiento

### Agregar Nuevos Lugares
1. Actualizar el JSON correspondiente
2. Agregar el identificador al prompt de OpenAI
3. Verificar que el nombre sea exacto

### Debugging
Usar `ResponseFormatter.extractIdentifiers()` para ver qué identificadores detecta el sistema.

## Ejemplo Completo

### Pregunta del Usuario:
"¿Dónde puedo quedarme y comer en Huánuco?"

### Respuesta de GPT (interna):
```
Para hospedarte recomiendo [HOTEL:Gran Hotel Huánuco] en el centro histórico.

Para comer, [RESTAURANTE:El Fogón de la Abuela] tiene excelente comida típica.
```

### Mostrado al Usuario:
```
Para hospedarte recomiendo **Gran Hotel Huánuco** en el centro histórico.

Para comer, **El Fogón de la Abuela** tiene excelente comida típica.
```

### Cards Renderizados:
- 1 card de hotel: Gran Hotel Huánuco
- 1 card de restaurante: El Fogón de la Abuela

Este sistema garantiza que el usuario reciba exactamente la información que solicitó, sin confusiones ni cards irrelevantes.
