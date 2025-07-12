# Configuración de OpenAI GPT-3.5 Turbo

## 🚀 Pasos para configurar OpenAI

### 1. Obtener API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección "API Keys" en tu dashboard
4. Crea una nueva API key
5. Copia la clave (importante: solo se muestra una vez)

### 2. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y agrega tu API key:
```bash
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# OpenAI API Key
REACT_APP_OPENAI_API_KEY=sk-tu-api-key-de-openai-aqui

# Otras variables de entorno
REACT_APP_API_URL=http://localhost:3000
```

### 3. Reiniciar el servidor

Después de agregar las variables de entorno, reinicia el servidor:
```bash
npm start
```

## 🤖 Funcionalidades implementadas

### Chat con GPT-3.5 Turbo
- **Contexto turístico**: El bot está especializado en información sobre Huánuco, Perú
- **Historial de conversación**: Mantiene el contexto de la conversación
- **Respuestas inteligentes**: Utiliza GPT-3.5 Turbo para respuestas naturales
- **Detección de ubicación**: Puede mostrar mapas cuando se solicita información de ubicación

### Características del sistema de chat:
- ✅ **Respuestas contextualizadas** sobre turismo en Huánuco
- ✅ **Manejo de errores** robusto con fallback a respuestas predefinidas
- ✅ **Indicador de carga** mientras espera respuesta
- ✅ **Integración con mapas** automática cuando se menciona ubicación
- ✅ **Historial de conversación** para mantener contexto
- ✅ **Rate limiting** y manejo de cuotas de API

### Prompt del sistema:
El bot usa un prompt especializado que lo configura como:
> "Eres TuristeaBot, un asistente turístico especializado en Huánuco, Perú. Tu objetivo es proporcionar información precisa sobre lugares turísticos, recomendar actividades y experiencias, ayudar con direcciones y ubicaciones, sugerir rutas turísticas, y dar consejos prácticos para viajeros."

## 🛠️ Estructura de archivos

### Servicios
- `src/services/openaiService.js` - Servicio para comunicación con OpenAI API

### Contexto global
- `src/contex/generalState.js` - Estado global con funciones de OpenAI
- `src/contex/generalReducer.js` - Reducer actualizado con nuevos tipos
- `src/types/index.js` - Tipos para loading y errores

### Componentes actualizados
- `src/components/Chatbot.js` - Integración con OpenAI
- `src/components/MapaInteractivo.js` - Mapa con geolocalización

## 🔧 Personalización

### Modificar el comportamiento del bot:
Edita el prompt del sistema en `src/services/openaiService.js`:

```javascript
{
  role: "system",
  content: "Tu prompt personalizado aquí..."
}
```

### Ajustar parámetros de OpenAI:
```javascript
{
  model: "gpt-3.5-turbo",
  max_tokens: 500,        // Máximo de tokens en respuesta
  temperature: 0.7,       // Creatividad (0-1)
  top_p: 1,              // Diversidad de respuestas
  frequency_penalty: 0,   // Penalización por repetición
  presence_penalty: 0     // Penalización por temas repetidos
}
```

## 💡 Ejemplos de uso

El usuario puede preguntar:
- "¿Qué lugares puedo visitar en Huánuco?"
- "Recomiéndame un restaurante típico"
- "¿Cómo llego a Kotosh?"
- "Muéstrame un mapa" (mostrará mapa interactivo)
- "¿Dónde estoy?" (activará geolocalización)

## 🚨 Notas importantes

- **Costo**: Cada llamada a OpenAI tiene un costo. GPT-3.5-turbo es económico pero considera implementar rate limiting en producción
- **Seguridad**: Nunca expongas tu API key en el código fuente. Siempre usa variables de entorno
- **Límites**: OpenAI tiene límites de rate y quota. Maneja estos errores apropiadamente
- **Fallback**: El sistema incluye respuestas de fallback cuando OpenAI no está disponible
