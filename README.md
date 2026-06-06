# GitHub → Discord Webhook

## 🚀 Características

- Escucha eventos de GitHub mediante webhooks.
- Procesa únicamente eventos `push`.
- Extrae información del repositorio, rama, autor y commits.
- Genera un resumen automático de los cambios usando una API de IA.
- Envía una notificación visual a Discord utilizando embeds.

---

## 📋 Requisitos

- Node.js 18+ (o superior)
- Una URL de Webhook de Discord
- Un endpoint de IA compatible con el formato utilizado en el proyecto

---

## 📦 Instalación

```bash
git clone <repositorio>
cd <repositorio>

pnpm install
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
WEBHOOK_DISCORD=https://discord.com/api/webhooks/xxxxxxxxxxxxxxxx
URL_IA_API=http://localhost:11434
```

### Variables

| Variable | Descripción |
|-----------|-------------|
| `PORT` | Puerto donde se ejecutará el servidor. |
| `WEBHOOK_DISCORD` | URL del webhook de Discord que recibirá las notificaciones. |
| `URL_IA_API` | URL base de la API de IA utilizada para generar el resumen de commits. |

---

## ▶️ Ejecución

### Desarrollo

```bash
pnpm run dev
```

### Producción

```bash
npm run build
npm start
```

---

## 🔗 Configuración del Webhook en GitHub

1. Ir al repositorio.
2. Entrar en **Settings → Webhooks**.
3. Hacer clic en **Add webhook**.
4. Configurar:

| Campo | Valor |
|---------|---------|
| Payload URL | `https://tu-dominio.com/github-webhook` |
| Content Type | `application/json` |
| Events | Solo `push` |

5. Guardar la configuración.

---

## 📥 Endpoint Disponible

### `POST /github-webhook`

Recibe eventos enviados por GitHub.

#### Eventos soportados

- `push`

Los demás eventos son ignorados y responden con `200 OK`.

---

## 📨 Ejemplo de Mensaje en Discord

```text
🚀 Nuevo Push

📦 Repositorio: api-backend
🌿 Rama: main
👤 Autor: john

📝 Commits
• Fix login validation
• Add refresh token support
• Update user service

🤖 Resumen con IA
Se mejoró el sistema de autenticación agregando soporte para refresh tokens y validaciones adicionales en el proceso de inicio de sesión.
```

---

## 🏗 Flujo de Funcionamiento

```text
GitHub Push
     │
     ▼
/github-webhook
     │
     ▼
Extraer commits
     │
     ▼
Enviar commits a API IA
     │
     ▼
Generar resumen
     │
     ▼
Enviar Embed a Discord
```

---

## 📄 Formato Esperado de la API de IA

El servicio espera un endpoint:

```http
POST /chat
```

Con un body similar a:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Genera un resumen breve de los siguientes commits..."
    }
  ]
}
```

La respuesta debe devolver texto plano con el resumen generado.

---

## 🛡 Manejo de Errores

- Si `WEBHOOK_DISCORD` no está configurado se devuelve `500 Internal Server Error`.
- Si ocurre cualquier excepción durante el procesamiento se devuelve `500 Internal Server Error`.
- Los eventos distintos de `push` son ignorados.

---

## 📜 Licencia

MIT
