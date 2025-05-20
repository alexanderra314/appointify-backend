# Appointify Backend

Este directorio contiene el código backend de Appointify, un sistema SAAS multicliente para gestión de citas.

## Estructura del Proyecto

El backend está desarrollado con Node.js, NestJS y TypeScript, siguiendo una arquitectura de microservicios.

```
backend/
├── src/
│   ├── auth/                # Microservicio de autenticación y autorización
│   ├── business/            # Microservicio de gestión de negocios
│   ├── appointment/         # Microservicio de gestión de citas
│   ├── notification/        # Microservicio de notificaciones
│   ├── payment/             # Microservicio de pagos
│   ├── geolocation/         # Microservicio de geolocalización
│   ├── recommendation/      # Microservicio de recomendaciones
│   ├── analytics/           # Microservicio de análisis y reportes
│   ├── integration/         # Microservicio de integración con servicios externos
│   ├── common/              # Código compartido entre microservicios
│   │   ├── decorators/      # Decoradores personalizados
│   │   ├── dto/             # Objetos de transferencia de datos
│   │   ├── entities/        # Entidades de base de datos
│   │   ├── exceptions/      # Excepciones personalizadas
│   │   ├── filters/         # Filtros de excepción
│   │   ├── guards/          # Guardias de autenticación y autorización
│   │   ├── interfaces/      # Interfaces y tipos
│   │   ├── middlewares/     # Middlewares
│   │   └── utils/           # Utilidades y helpers
│   ├── config/              # Configuración de la aplicación
│   ├── main.ts              # Punto de entrada de la aplicación
│   └── app.module.ts        # Módulo principal
├── test/                    # Pruebas
├── package.json             # Dependencias y scripts
└── tsconfig.json            # Configuración de TypeScript
```

## Características Principales

- **Arquitectura de Microservicios**: Servicios independientes y escalables
- **Multitenencia**: Aislamiento de datos entre clientes
- **API RESTful**: Endpoints bien documentados con OpenAPI
- **Autenticación y Autorización**: JWT, OAuth 2.0 y RBAC
- **Geolocalización**: Búsqueda de negocios cercanos y cálculo de rutas
- **Notificaciones**: Email, SMS y WhatsApp
- **Pagos**: Integración con múltiples pasarelas de pago
- **Internacionalización**: Soporte para múltiples idiomas

## Tecnologías Utilizadas

- Node.js
- NestJS
- TypeScript
- PostgreSQL con PostGIS
- Redis
- Docker
- Kubernetes
- Jest (pruebas)
- Swagger/OpenAPI (documentación)
- Passport.js (autenticación)
- TypeORM (ORM)
- Bull (colas y trabajos en segundo plano)
- Winston (logging)
