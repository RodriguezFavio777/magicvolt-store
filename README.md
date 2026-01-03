# MagicVolt Store 💎

Bienvenido a **MagicVolt**, una plataforma de comercio electrónico diseñada con una estética "Dark Luxury" para la venta de joyería exclusiva. Este proyecto combina un diseño visual impactante con funcionalidades robustas para ofrecer una experiencia de usuario premium.

## 🚀 Características Principales

*   **Experiencia de Usuario Premium**: Interfaz diseñada meticulosamente con estilos "Dark Luxury" para resaltar la exclusividad de los productos.
*   **Catálogo Interactivo**: Exploración de productos con capacidades de filtrado por categorías y vista detallada de cada pieza.
*   **Gestión de Carrito**: Funcionalidad completa de carrito de compras para agregar y gestionar productos antes del pago.
*   **Checkout Integrado con WhatsApp**: Flujo de compra innovador que permite a los clientes finalizar sus pedidos enviando los detalles directamente al vendedor vía WhatsApp.
*   **Panel de Administración**: Área segura para la gestión de inventario y stock de productos en tiempo real.
*   **Autenticación Segura**: Sistema de registro e inicio de sesión gestionado a través de Supabase.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack tecnológico moderno y eficiente:

*   **Frontend**: [React 19](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/) para una interfaz rápida y tipada.
*   **Build Tool**: [Vite](https://vitejs.dev/) para un entorno de desarrollo ágil y builds optimizados.
*   **Base de Datos y Auth**: [Supabase](https://supabase.com/) como backend-as-a-service para la persistencia de datos y autenticación.
*   **Enrutamiento**: [React Router](https://reactrouter.com/) para la navegación SPA.
*   **UI/UX**:
    *   **Iconos**: [Lucide React](https://lucide.dev/)
    *   **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/) para feedback visual elegante.

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd MagicVolt-Store
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de Supabase. Puedes usar el archivo `.env.example` como guía si existe, o seguir este formato:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
    ```

4.  **Ejecutar el servidor de desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📜 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run preview`: Previsualiza la build de producción localmente.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerencias y mejoras.
